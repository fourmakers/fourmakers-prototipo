import { BigQuery } from "@google-cloud/bigquery";
import { bqConfigured, bqDatasetId, config } from "../config.js";
import type {
  AppQueryParams,
  EventoRanking,
  FirebaseAppDashboardData,
  FunilEtapa,
  PropriedadeUsuario,
} from "../types.js";

const bigquery = new BigQuery({ projectId: config.gcpProjectId });

const FUNNEL_SESSAO = ["app_open", "screen_view", "feature_tapped"] as const;
const FUNNEL_LOGIN = ["screen_view", "login", "action_result"] as const;
const ERROR_EVENTS = ["friction_error", "form_validation_failed", "action_result"] as const;

function tableRef(): string {
  const dataset = bqDatasetId();
  return `\`${config.gcpProjectId}.${dataset}.events_*\``;
}

function platformWhere(device?: AppQueryParams["device_platform"]): string {
  if (!device || device === "all") return "TRUE";
  const os = device === "android" ? "Android" : "iOS";
  return `device.operating_system = '${os}'`;
}

function environmentWhere(env: string): string {
  return `EXISTS (
    SELECT 1 FROM UNNEST(event_params) ep
    WHERE ep.key = 'environment' AND ep.value.string_value = @environment
  )`;
}

async function runQuery<T>(sql: string, params: Record<string, unknown>): Promise<T[]> {
  const [rows] = await bigquery.query({ query: sql, params, location: "US" });
  return rows as T[];
}

export async function enrichFirebaseFromBigQuery(
  q: AppQueryParams,
  base: FirebaseAppDashboardData,
): Promise<{ data: FirebaseAppDashboardData; bqActive: boolean }> {
  if (!bqConfigured()) {
    return { data: base, bqActive: false };
  }

  const table = tableRef();
  const params = {
    from: q.from,
    to: q.to,
    environment: q.environment,
    feature: q.feature ?? null,
  };

  try {
    const topSql = `
      SELECT
        event_name AS eventName,
        COUNT(*) AS totalEvents,
        COUNT(DISTINCT user_pseudo_id) AS uniqueUsers
      FROM ${table}
      WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE(@from))
        AND FORMAT_DATE('%Y%m%d', DATE(@to))
        AND platform IN ('ANDROID', 'IOS')
        AND (${platformWhere(q.device_platform)})
        AND (${environmentWhere(q.environment)})
      GROUP BY event_name
      ORDER BY totalEvents DESC
      LIMIT 15
    `;

    const topRows = await runQuery<{
      eventName: string;
      totalEvents: number;
      uniqueUsers: number;
    }>(topSql, params);

    const errosSql = `
      SELECT
        event_name AS eventName,
        COUNT(*) AS totalEvents,
        COUNT(DISTINCT user_pseudo_id) AS uniqueUsers
      FROM ${table}
      WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE(@from))
        AND FORMAT_DATE('%Y%m%d', DATE(@to))
        AND event_name IN UNNEST(@errorEvents)
        AND (${platformWhere(q.device_platform)})
        AND (${environmentWhere(q.environment)})
      GROUP BY event_name
      ORDER BY totalEvents DESC
    `;

    const errosRows = await runQuery<EventoRanking>(errosSql, {
      ...params,
      errorEvents: [...ERROR_EVENTS],
    });

    const funis = await Promise.all([
      buildFunnel(q, table, "sessao", "Sessão (app)", [...FUNNEL_SESSAO]),
      buildFunnel(q, table, "login", "Autenticação", [...FUNNEL_LOGIN]),
    ]);

    const userPropsSql = `
      SELECT
        ep.key AS name,
        COALESCE(ep.value.string_value, CAST(ep.value.int_value AS STRING)) AS value,
        COUNT(DISTINCT user_pseudo_id) AS usuarios
      FROM ${table}, UNNEST(event_params) ep
      WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE(@from))
        AND FORMAT_DATE('%Y%m%d', DATE(@to))
        AND ep.key IN ('environment', 'user_role', 'feature')
        AND (${platformWhere(q.device_platform)})
      GROUP BY name, value
      ORDER BY usuarios DESC
      LIMIT 20
    `;

    const userProperties = await runQuery<PropriedadeUsuario>(userPropsSql, params);

    const lastSyncSql = `
      SELECT MAX(PARSE_DATE('%Y%m%d', _TABLE_SUFFIX)) AS lastDate
      FROM ${table}
      WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE(@from))
        AND FORMAT_DATE('%Y%m%d', DATE(@to))
    `;
    const syncRows = await runQuery<{ lastDate: { value: string } | string | null }>(lastSyncSql, params);
    const lastDate = syncRows[0]?.lastDate;
    const ultimaSync =
      typeof lastDate === "object" && lastDate && "value" in lastDate
        ? String(lastDate.value)
        : lastDate
          ? String(lastDate)
          : new Date().toISOString().slice(0, 10);

    return {
      bqActive: true,
      data: {
        ...base,
        topEventos: topRows.length ? topRows : base.topEventos,
        erros: errosRows.length ? errosRows : base.erros,
        funis: funis.filter((f) => f.etapas.length > 0),
        userProperties: userProperties.length ? userProperties : base.userProperties,
        integracao: {
          ...base.integracao,
          bigQueryExportAtivo: true,
          ultimaSyncBigQuery: `${ultimaSync}T00:00:00Z`,
        },
      },
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      bqActive: false,
      data: {
        ...base,
        integracao: {
          ...base.integracao,
          bigQueryExportAtivo: false,
          ultimaSyncBigQuery: `BigQuery indisponível: ${msg}`,
        },
      },
    };
  }
}

async function buildFunnel(
  q: AppQueryParams,
  table: string,
  id: string,
  titulo: string,
  steps: string[],
): Promise<{ id: string; titulo: string; etapas: FunilEtapa[] }> {
  const sql = `
    WITH users AS (
      SELECT DISTINCT user_pseudo_id
      FROM ${table}
      WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE(@from))
        AND FORMAT_DATE('%Y%m%d', DATE(@to))
        AND (${platformWhere(q.device_platform)})
        AND (${environmentWhere(q.environment)})
    ),
    step_counts AS (
      SELECT
        event_name,
        COUNT(DISTINCT user_pseudo_id) AS usuarios
      FROM ${table}
      WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE(@from))
        AND FORMAT_DATE('%Y%m%d', DATE(@to))
        AND event_name IN UNNEST(@steps)
        AND (${platformWhere(q.device_platform)})
        AND (${environmentWhere(q.environment)})
      GROUP BY event_name
    )
    SELECT event_name AS nome, usuarios FROM step_counts
  `;

  const rows = await runQuery<{ nome: string; usuarios: number }>(sql, {
    from: q.from,
    to: q.to,
    environment: q.environment,
    steps,
  });

  const order = new Map(steps.map((s, i) => [s, i]));
  const sorted = rows.sort((a, b) => (order.get(a.nome) ?? 99) - (order.get(b.nome) ?? 99));

  let prev = 0;
  const etapas: FunilEtapa[] = sorted.map((row, i) => {
    const taxa =
      i > 0 && prev > 0 ? Math.round((row.usuarios / prev) * 1000) / 10 : undefined;
    prev = row.usuarios;
    return { nome: row.nome, usuarios: row.usuarios, taxaConversaoPct: taxa };
  });

  return { id, titulo, etapas };
}

export async function checkBigQueryExport(): Promise<boolean> {
  if (!bqConfigured()) return false;
  try {
    const [tables] = await bigquery.dataset(bqDatasetId()).getTables();
    return tables.some((t) => t.id?.startsWith("events_"));
  } catch {
    return false;
  }
}
