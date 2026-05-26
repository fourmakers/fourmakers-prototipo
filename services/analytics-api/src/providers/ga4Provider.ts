import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { config, ga4Configured } from "../config.js";
import type { AppQueryParams, EventoRanking, FirebaseAppDashboardData, ScreenRanking, SerieDia } from "../types.js";
import { buildDemoFirebaseDashboard } from "./demoFirebase.js";

const client = new BetaAnalyticsDataClient();

function propertyName(): string {
  return `properties/${config.ga4PropertyId}`;
}

function periodoLabel(q: AppQueryParams): string {
  const plat =
    q.device_platform === "android"
      ? "Android"
      : q.device_platform === "ios"
        ? "iOS"
        : "Android + iOS";
  return `${q.from} → ${q.to} · ${q.environment.toUpperCase()} · ${plat}`;
}

function platformDimensionFilter(platform: AppQueryParams["device_platform"]) {
  if (!platform || platform === "all") return undefined;
  const os = platform === "android" ? "Android" : "iOS";
  return {
    filter: {
      fieldName: "operatingSystem",
      stringFilter: { matchType: "EXACT" as const, value: os },
    },
  };
}

function environmentDimensionFilter(env: string) {
  return {
    filter: {
      fieldName: "customEvent:environment",
      stringFilter: { matchType: "EXACT" as const, value: env },
    },
  };
}

function combineFilters(
  platform?: ReturnType<typeof platformDimensionFilter>,
  environment?: ReturnType<typeof environmentDimensionFilter>,
) {
  const parts = [platform?.filter, environment?.filter].filter(Boolean);
  if (parts.length === 0) return undefined;
  if (parts.length === 1) return { dimensionFilter: { filter: parts[0] } };
  return {
    dimensionFilter: {
      andGroup: { expressions: parts.map((filter) => ({ filter })) },
    },
  };
}

async function runReport(
  q: AppQueryParams,
  dimensions: { name: string }[],
  metrics: { name: string }[],
  extra?: { dimensionFilter?: unknown; metricFilter?: unknown; limit?: number },
) {
  const [response] = await client.runReport({
    property: propertyName(),
    dateRanges: [{ startDate: q.from, endDate: q.to }],
    dimensions,
    metrics,
    limit: extra?.limit ?? 10000,
    dimensionFilter: extra?.dimensionFilter as never,
    metricFilter: extra?.metricFilter as never,
  });
  return response ?? { rows: [] };
}

function parseMetric(row: { metricValues?: { value?: string | null }[] | null }, index: number): number {
  const v = row.metricValues?.[index]?.value;
  return v ? Number(v) : 0;
}

function parseDim(row: { dimensionValues?: { value?: string | null }[] | null }, index: number): string {
  return row.dimensionValues?.[index]?.value ?? "";
}

export async function fetchFirebaseFromGa4(q: AppQueryParams): Promise<{
  data: FirebaseAppDashboardData;
  warnings: string[];
}> {
  const warnings: string[] = [];

  if (!ga4Configured()) {
    if (config.demoMode) {
      return { data: buildDemoFirebaseDashboard(q), warnings: ["DEMO_MODE: GA4_PROPERTY_ID não configurado."] };
    }
    throw new Error("GA4_PROPERTY_ID não configurado no servidor.");
  }

  const dimFilter = combineFilters(
    platformDimensionFilter(q.device_platform),
    environmentDimensionFilter(q.environment),
  );

  let envFilterApplied = true;
  let summary;
  try {
    summary = await runReport(
      q,
      [],
      [
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "eventCount" },
        { name: "screenPageViews" },
      ],
      { dimensionFilter: dimFilter },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("customEvent:environment") || msg.includes("INVALID_ARGUMENT")) {
      envFilterApplied = false;
      warnings.push(
        `Filtro environment=${q.environment} ignorado (param customEvent:environment ausente no GA4).`,
      );
      summary = await runReport(
        q,
        [],
        [
          { name: "activeUsers" },
          { name: "sessions" },
          { name: "eventCount" },
          { name: "screenPageViews" },
        ],
        { dimensionFilter: combineFilters(platformDimensionFilter(q.device_platform)) },
      );
    } else {
      throw err;
    }
  }

  const summaryRow = summary.rows?.[0];
  const activeUsers = summaryRow ? parseMetric(summaryRow, 0) : 0;
  const sessions = summaryRow ? parseMetric(summaryRow, 1) : 0;
  const eventCount = summaryRow ? parseMetric(summaryRow, 2) : 0;
  const screenViewsTotal = summaryRow ? parseMetric(summaryRow, 3) : 0;

  const eventsByDayRes = await runReport(
    q,
    [{ name: "date" }],
    [{ name: "eventCount" }],
    { dimensionFilter: envFilterApplied ? dimFilter : combineFilters(platformDimensionFilter(q.device_platform)) },
  );

  const eventosPorDia: SerieDia[] = (eventsByDayRes.rows ?? [])
    .map((row) => ({
      data: formatGa4Date(parseDim(row, 0)),
      valor: parseMetric(row, 0),
    }))
    .sort((a, b) => a.data.localeCompare(b.data));

  const topEventsRes = await runReport(
    q,
    [{ name: "eventName" }],
    [{ name: "eventCount" }, { name: "activeUsers" }],
    {
      dimensionFilter: envFilterApplied ? dimFilter : combineFilters(platformDimensionFilter(q.device_platform)),
      limit: 15,
    },
  );

  const topEventos: EventoRanking[] = (topEventsRes.rows ?? [])
    .map((row) => ({
      eventName: parseDim(row, 0),
      totalEvents: parseMetric(row, 0),
      uniqueUsers: parseMetric(row, 1),
    }))
    .sort((a, b) => b.totalEvents - a.totalEvents);

  const screenRes = await runReport(
    q,
    [{ name: "unifiedScreenName" }],
    [{ name: "screenPageViews" }, { name: "activeUsers" }],
    {
      dimensionFilter: {
        andGroup: {
          expressions: [
            {
              filter: {
                fieldName: "eventName",
                stringFilter: { matchType: "EXACT", value: "screen_view" },
              },
            },
            ...(dimFilter?.dimensionFilter
              ? [dimFilter.dimensionFilter as { filter: unknown }]
              : []),
          ],
        },
      },
      limit: 20,
    },
  ).catch(async () => {
    return runReport(
      q,
      [{ name: "pagePath" }],
      [{ name: "screenPageViews" }, { name: "activeUsers" }],
      { dimensionFilter: dimFilter, limit: 20 },
    );
  });

  const screenViews: ScreenRanking[] = (screenRes.rows ?? [])
    .map((row) => ({
      screenName: parseDim(row, 0) || "(unknown)",
      views: parseMetric(row, 0),
      uniqueUsers: parseMetric(row, 1),
    }))
    .sort((a, b) => b.views - a.views);

  const erros = topEventos.filter((e) =>
    ["friction_error", "form_validation_failed"].includes(e.eventName),
  );

  const data: FirebaseAppDashboardData = {
    periodoLabel: periodoLabel(q),
    kpis: [
      {
        id: "dau",
        label: "Utilizadores activos (período)",
        value: activeUsers.toLocaleString("pt-BR"),
        variant: "info",
        hint: "GA4 activeUsers",
      },
      {
        id: "sessions",
        label: "Sessões",
        value: sessions.toLocaleString("pt-BR"),
        variant: "success",
      },
      {
        id: "events",
        label: "Eventos",
        value: eventCount.toLocaleString("pt-BR"),
        hint: "GA4 eventCount",
      },
      {
        id: "screens",
        label: "Screen views",
        value: screenViewsTotal.toLocaleString("pt-BR"),
      },
    ],
    eventosPorDia,
    topEventos,
    screenViews,
    funis: [],
    userProperties: envFilterApplied
      ? [{ name: "environment", value: q.environment, usuarios: activeUsers }]
      : [],
    erros,
    integracao: {
      bigQueryExportAtivo: false,
      debugViewAtivo: q.environment !== "prod",
      ultimaSyncBigQuery: new Date().toISOString(),
      ga4DataApi: true,
    },
  };

  if (!envFilterApplied) {
    warnings.push("Configure custom param `environment` no app ou active BQ_ENABLED para filtro por ambiente.");
  }

  return { data, warnings };
}

function formatGa4Date(yyyymmdd: string): string {
  if (yyyymmdd.length !== 8) return yyyymmdd;
  return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`;
}
