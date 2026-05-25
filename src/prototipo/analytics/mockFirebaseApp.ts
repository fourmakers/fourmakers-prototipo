import type { AnalyticsEnvironment, AnalyticsPlatform, FirebaseAppDashboardData } from "./types";

function diasNoPeriodo(inicio: string, fim: string): number {
  const a = new Date(inicio);
  const b = new Date(fim);
  return Math.max(1, Math.round((b.getTime() - a.getTime()) / 86400000) + 1);
}

function serieEventos(dias: number, base: number): { data: string; valor: number }[] {
  const out: { data: string; valor: number }[] = [];
  const hoje = new Date();
  for (let i = dias - 1; i >= 0; i--) {
    const d = new Date(hoje);
    d.setDate(d.getDate() - i);
    const jitter = 0.85 + Math.random() * 0.3;
    out.push({
      data: d.toISOString().slice(0, 10),
      valor: Math.round(base * jitter),
    });
  }
  return out;
}

/** Top eventos: prioridade eventos já no app Flutter; roadmap misturado no mock. */
const TOP_EVENTOS_BASE = [
  { eventName: "screen_view", feature: "core" },
  { eventName: "feature_tapped", feature: "core" },
  { eventName: "app_open", feature: "core" },
  { eventName: "login", feature: "auth" },
  { eventName: "logout", feature: "auth" },
  { eventName: "action_result", feature: "core" },
  { eventName: "form_validation_failed", feature: "forms" },
  { eventName: "friction_error", feature: "core" },
  { eventName: "form_started", feature: "forms" },
  { eventName: "form_submitted", feature: "forms" },
];

const SCREENS = [
  "home",
  "login",
  "jornada_comercial",
  "encontros_agendas",
  "agenda_detail",
  "crm_leads",
  "lead_detail",
  "perfil360",
  "gemini_console",
  "notificacoes",
];

export function getMockFirebaseAppDashboard(
  env: AnalyticsEnvironment,
  platform: AnalyticsPlatform,
  dataInicio: string,
  dataFim: string,
): FirebaseAppDashboardData {
  const dias = diasNoPeriodo(dataInicio, dataFim);
  const envFactor = env === "prod" ? 1.4 : 1;
  const platFactor = platform === "android" ? 1.1 : platform === "ios" ? 0.95 : 1;
  const f = envFactor * platFactor;

  const dau = Math.round(420 * f);
  const mau = Math.round(1280 * f);
  const eventosDia = Math.round(8200 * f);

  return {
    periodoLabel: `${dataInicio} → ${dataFim} · ${env.toUpperCase()} · ${platform === "all" ? "Android + iOS" : platform}`,
    kpis: [
      { id: "dau", label: "Utilizadores activos (dia)", value: dau.toLocaleString("pt-BR"), trendPct: 4.2, variant: "info" },
      { id: "mau", label: "Utilizadores activos (30d)", value: mau.toLocaleString("pt-BR"), trendPct: 2.1, variant: "default" },
      { id: "events", label: "Eventos (período)", value: (eventosDia * dias).toLocaleString("pt-BR"), hint: "GA4 / BigQuery events_*", variant: "default" },
      { id: "screens", label: "Screen views", value: Math.round(12400 * f * dias).toLocaleString("pt-BR"), variant: "default" },
      { id: "sessions", label: "Sessões", value: Math.round(3100 * f * dias).toLocaleString("pt-BR"), variant: "success" },
      { id: "login_rate", label: "Taxa login concluído", value: "94,2%", hint: "login_completed / login_started", variant: "success" },
    ],
    eventosPorDia: serieEventos(Math.min(dias, 14), eventosDia),
    topEventos: TOP_EVENTOS_BASE.map((e, i) => ({
      ...e,
      totalEvents: Math.round((eventosDia * (1 - i * 0.07)) * f),
      uniqueUsers: Math.round(dau * (0.95 - i * 0.08)),
    })),
    screenViews: SCREENS.map((screenName, i) => ({
      screenName,
      views: Math.round(1800 * (1 - i * 0.08) * f),
      uniqueUsers: Math.round(dau * (0.9 - i * 0.06)),
    })),
    funis: [
      {
        id: "sessao",
        titulo: "Sessão (app)",
        etapas: [
          { nome: "app_open", usuarios: Math.round(520 * f) },
          { nome: "screen_view", usuarios: Math.round(498 * f), taxaConversaoPct: 95.8 },
          { nome: "feature_tapped", usuarios: Math.round(410 * f), taxaConversaoPct: 82.3 },
        ],
      },
      {
        id: "login",
        titulo: "Autenticação",
        etapas: [
          { nome: "screen_view (login)", usuarios: Math.round(480 * f) },
          { nome: "login", usuarios: Math.round(455 * f), taxaConversaoPct: 94.8 },
          { nome: "action_result (sucesso)", usuarios: Math.round(430 * f), taxaConversaoPct: 94.5 },
        ],
      },
      {
        id: "friccao",
        titulo: "Fricção",
        etapas: [
          { nome: "form_validation_failed", usuarios: Math.round(124 * f) },
          { nome: "friction_error", usuarios: Math.round(186 * f), taxaConversaoPct: 150 },
          { nome: "action_result (falha)", usuarios: Math.round(42 * f), taxaConversaoPct: 22.6 },
        ],
      },
    ],
    userProperties: [
      { name: "environment", value: env, usuarios: mau },
      { name: "user_role", value: "gestor", usuarios: Math.round(mau * 0.22) },
      { name: "user_role", value: "comercial", usuarios: Math.round(mau * 0.48) },
      { name: "user_role", value: "operacional", usuarios: Math.round(mau * 0.3) },
      { name: "feature", value: "jornada_comercial", usuarios: Math.round(mau * 0.55) },
    ],
    erros: [
      { eventName: "friction_error", totalEvents: Math.round(186 * f), uniqueUsers: Math.round(94 * f), feature: "core" },
      { eventName: "form_validation_failed", totalEvents: Math.round(124 * f), uniqueUsers: Math.round(78 * f), feature: "forms" },
      { eventName: "action_result", totalEvents: Math.round(88 * f), uniqueUsers: Math.round(52 * f), feature: "core" },
    ],
    integracao: {
      bigQueryExportAtivo: false,
      debugViewAtivo: env === "hml" || env === "dev",
      ultimaSyncBigQuery: "Aguardando Analytics API / BigQuery Export (cenário dev)",
    },
  };
}
