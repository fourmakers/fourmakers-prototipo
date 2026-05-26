import { config } from "../config.js";
import type { AppQueryParams, ContentsquareAppDashboardData, SerieDia } from "../types.js";

function periodoLabel(q: AppQueryParams): string {
  const plat =
    q.device_platform === "android"
      ? "Android"
      : q.device_platform === "ios"
        ? "iOS"
        : "Android + iOS";
  return `${q.from} → ${q.to} · ${q.environment.toUpperCase()} · ${plat}`;
}

/** Contentsquare Metrics API — requer CONTENTSQUARE_API_KEY + SITE_ID no servidor. */
async function fetchContentsquareLive(
  q: AppQueryParams,
): Promise<ContentsquareAppDashboardData | null> {
  const key = config.contentsquareApiKey;
  const siteId = config.contentsquareSiteId;
  if (!key || !siteId) return null;

  const base = config.contentsquareApiBaseUrl;
  const url = new URL(`${base}/v1/sites/${siteId}/metrics`);
  url.searchParams.set("from", q.from);
  url.searchParams.set("to", q.to);

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${key}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Contentsquare API HTTP ${res.status}`);
  }

  const json = (await res.json()) as Record<string, unknown>;
  const sessions = Number(json.sessions ?? json.total_sessions ?? 0);
  const replays = Boolean(json.session_replay_enabled ?? true);

  return {
    periodoLabel: periodoLabel(q),
    kpis: [
      {
        id: "sessions",
        label: "Sessões",
        value: sessions.toLocaleString("pt-BR"),
        variant: "info",
      },
      {
        id: "replay",
        label: "Session replay",
        value: replays ? "Activo" : "Inactivo",
        variant: replays ? "success" : "warning",
      },
    ],
    sessoesPorDia: Array.isArray(json.sessions_by_day)
      ? (json.sessions_by_day as { date: string; value: number }[]).map((p) => ({
          data: p.date,
          valor: p.value,
        }))
      : [{ data: q.to, valor: sessions }],
    screenViews: [],
    conversoes: [],
    fricoes: [],
    customVariables: [],
    maskingPorTela: [],
    jornadaTop: [],
    integracao: {
      sdkIniciado: true,
      sessionReplayAtivo: replays,
      gtmComplementar: false,
      ultimaColeta: new Date().toISOString(),
      apiLive: true,
    },
  };
}

/** Fallback estruturado quando CS não está configurado (P1 — contrato válido para o hub). */
function buildContentsquareStub(q: AppQueryParams, live: boolean): ContentsquareAppDashboardData {
  const f = q.environment === "prod" ? 1.3 : 1;
  const sessoes = Math.round(2800 * f);
  const serie: SerieDia[] = [{ data: q.to, valor: Math.round(sessoes / 7) }];

  return {
    periodoLabel: periodoLabel(q),
    kpis: [
      {
        id: "sessions",
        label: "Sessões",
        value: sessoes.toLocaleString("pt-BR"),
        hint: live ? undefined : "Configure CONTENTSQUARE_API_KEY no servidor",
        variant: live ? "info" : "warning",
      },
      {
        id: "friction",
        label: "Eventos de fricção",
        value: Math.round(340 * f).toLocaleString("pt-BR"),
      },
    ],
    sessoesPorDia: serie,
    screenViews: [
      { screenName: "home", views: 1200, uniqueUsers: 800 },
      { screenName: "crm_leads", views: 640, uniqueUsers: 410 },
    ],
    conversoes: [
      { nome: "Login concluído", sessoes: Math.round(920 * f), taxaPct: 88.4 },
      { nome: "Lead criado", sessoes: Math.round(210 * f), taxaPct: 42.1 },
    ],
    fricoes: [
      { eventName: "rage_click", ocorrencias: 84, sessoesAfetadas: 62 },
      { eventName: "error_tap", ocorrencias: 41, sessoesAfetadas: 38 },
    ],
    customVariables: [{ name: "environment", value: q.environment, usuarios: sessoes }],
    maskingPorTela: [
      { tela: "perfil360", replay: true, nivelMasking: "Alto" },
      { tela: "login", replay: false, nivelMasking: "Máximo" },
    ],
    jornadaTop: [
      { passo: "Home", sessoes: Math.round(1100 * f) },
      { passo: "CRM", sessoes: Math.round(520 * f), dropoffPct: 12.4 },
    ],
    integracao: {
      sdkIniciado: true,
      sessionReplayAtivo: true,
      gtmComplementar: false,
      ultimaColeta: new Date().toISOString(),
      apiLive: live,
    },
  };
}

export async function fetchContentsquareDashboard(q: AppQueryParams): Promise<{
  data: ContentsquareAppDashboardData;
  warnings: string[];
}> {
  const warnings: string[] = [];

  try {
    const live = await fetchContentsquareLive(q);
    if (live) return { data: live, warnings };
  } catch (err) {
    warnings.push(
      `Contentsquare API: ${err instanceof Error ? err.message : String(err)} — usando stub.`,
    );
  }

  if (!config.contentsquareApiKey) {
    warnings.push("CONTENTSQUARE_API_KEY não configurada — dados estruturais de referência.");
  }

  return {
    data: buildContentsquareStub(q, false),
    warnings,
  };
}
