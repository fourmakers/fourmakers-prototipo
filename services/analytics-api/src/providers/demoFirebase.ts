import type { AppQueryParams, FirebaseAppDashboardData } from "../types.js";

function periodoLabel(q: AppQueryParams): string {
  const plat =
    q.device_platform === "android"
      ? "Android"
      : q.device_platform === "ios"
        ? "iOS"
        : "Android + iOS";
  return `${q.from} → ${q.to} · ${q.environment.toUpperCase()} · ${plat}`;
}

/** Dados determinísticos quando GA4/BQ não estão configurados (DEMO_MODE). */
export function buildDemoFirebaseDashboard(q: AppQueryParams): FirebaseAppDashboardData {
  const f = q.environment === "prod" ? 1.4 : 1;
  const dau = Math.round(420 * f);
  const mau = Math.round(1280 * f);

  return {
    periodoLabel: periodoLabel(q),
    kpis: [
      { id: "dau", label: "Utilizadores activos (dia)", value: dau.toLocaleString("pt-BR"), trendPct: 4.2, variant: "info" },
      { id: "mau", label: "Utilizadores activos (30d)", value: mau.toLocaleString("pt-BR"), trendPct: 2.1, variant: "default" },
      { id: "events", label: "Eventos (período)", value: (8200 * f * 7).toLocaleString("pt-BR"), hint: "DEMO_MODE — configure GA4_PROPERTY_ID", variant: "warning" },
      { id: "sessions", label: "Sessões", value: Math.round(3100 * f * 7).toLocaleString("pt-BR"), variant: "success" },
    ],
    eventosPorDia: [{ data: q.to, valor: Math.round(8200 * f) }],
    topEventos: [
      { eventName: "screen_view", totalEvents: 12000, uniqueUsers: dau, feature: "core" },
      { eventName: "feature_tapped", totalEvents: 8400, uniqueUsers: Math.round(dau * 0.9), feature: "core" },
      { eventName: "app_open", totalEvents: 7200, uniqueUsers: Math.round(dau * 0.95), feature: "core" },
    ],
    screenViews: [
      { screenName: "home", views: 4200, uniqueUsers: dau },
      { screenName: "jornada_comercial", views: 3100, uniqueUsers: Math.round(dau * 0.7) },
    ],
    funis: [],
    userProperties: [{ name: "environment", value: q.environment, usuarios: mau }],
    erros: [],
    integracao: {
      bigQueryExportAtivo: false,
      debugViewAtivo: q.environment !== "prod",
      ultimaSyncBigQuery: new Date().toISOString(),
      ga4DataApi: false,
    },
  };
}
