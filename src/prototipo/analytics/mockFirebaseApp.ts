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

const TOP_EVENTOS_BASE = [
  { eventName: "screen_viewed", feature: "core" },
  { eventName: "home_opened", feature: "home" },
  { eventName: "jornada_kanban_opened", feature: "jornada_comercial" },
  { eventName: "agenda_list_opened", feature: "encontros_agendas" },
  { eventName: "login_completed", feature: "auth" },
  { eventName: "lead_created", feature: "crm_leads" },
  { eventName: "acao_marked_as_done", feature: "jornada_comercial" },
  { eventName: "ai_next_steps_created", feature: "ia" },
  { eventName: "perfil360_opened", feature: "perfil360" },
  { eventName: "notification_opened", feature: "notificacoes" },
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
        id: "login",
        titulo: "Autenticação",
        etapas: [
          { nome: "login_started", usuarios: Math.round(520 * f) },
          { nome: "login_completed", usuarios: Math.round(489 * f), taxaConversaoPct: 94.0 },
          { nome: "sso_microsoft_completed", usuarios: Math.round(312 * f), taxaConversaoPct: 63.8 },
        ],
      },
      {
        id: "jornada",
        titulo: "Jornada comercial",
        etapas: [
          { nome: "jornada_kanban_opened", usuarios: Math.round(380 * f) },
          { nome: "jornada_card_opened", usuarios: Math.round(290 * f), taxaConversaoPct: 76.3 },
          { nome: "acao_marked_as_done", usuarios: Math.round(142 * f), taxaConversaoPct: 48.9 },
        ],
      },
      {
        id: "crm",
        titulo: "CRM",
        etapas: [
          { nome: "crm (screen)", usuarios: Math.round(210 * f) },
          { nome: "lead_created", usuarios: Math.round(68 * f), taxaConversaoPct: 32.4 },
          { nome: "lead_stage_changed", usuarios: Math.round(41 * f), taxaConversaoPct: 60.3 },
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
      { eventName: "api_error_shown", totalEvents: Math.round(186 * f), uniqueUsers: Math.round(94 * f), feature: "core" },
      { eventName: "form_validation_failed", totalEvents: Math.round(124 * f), uniqueUsers: Math.round(78 * f), feature: "forms" },
      { eventName: "upload_failed", totalEvents: Math.round(42 * f), uniqueUsers: Math.round(31 * f), feature: "crm_leads" },
      { eventName: "ai_next_steps_failed", totalEvents: Math.round(18 * f), uniqueUsers: Math.round(14 * f), feature: "ia" },
    ],
    integracao: {
      bigQueryExportAtivo: true,
      debugViewAtivo: env === "hml",
      ultimaSyncBigQuery: "2026-05-24T06:00:00Z",
    },
  };
}
