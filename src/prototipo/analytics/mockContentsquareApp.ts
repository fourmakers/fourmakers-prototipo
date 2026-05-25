import type { AnalyticsEnvironment, AnalyticsPlatform, ContentsquareAppDashboardData } from "./types";

function serieSessoes(dias: number, base: number): { data: string; valor: number }[] {
  const out: { data: string; valor: number }[] = [];
  const hoje = new Date();
  for (let i = dias - 1; i >= 0; i--) {
    const d = new Date(hoje);
    d.setDate(d.getDate() - i);
    out.push({
      data: d.toISOString().slice(0, 10),
      valor: Math.round(base * (0.88 + Math.random() * 0.24)),
    });
  }
  return out;
}

const SCREENS_CS = [
  "home",
  "login",
  "jornada_comercial",
  "jornada_acao_detail",
  "encontros_agendas",
  "agenda_detail",
  "nova_interacao",
  "crm_leads",
  "lead_detail",
  "perfil360",
  "dados_pessoais",
  "gemini_console",
  "maverick_dashboard",
  "notificacoes",
  "configuracoes",
];

const MASKING: ContentsquareAppDashboardData["maskingPorTela"] = [
  { tela: "Login", replay: true, nivelMasking: "Alto" },
  { tela: "Home", replay: true, nivelMasking: "Médio" },
  { tela: "Jornada Comercial", replay: true, nivelMasking: "Médio/Alto" },
  { tela: "Agenda Detail", replay: true, nivelMasking: "Alto" },
  { tela: "Nova Interação", replay: true, nivelMasking: "Alto" },
  { tela: "CRM Leads", replay: true, nivelMasking: "Alto" },
  { tela: "Perfil 360", replay: true, nivelMasking: "Muito alto" },
  { tela: "Dados Pessoais", replay: false, nivelMasking: "Máximo" },
  { tela: "Gemini Console", replay: false, nivelMasking: "Máximo" },
];

export function getMockContentsquareAppDashboard(
  env: AnalyticsEnvironment,
  platform: AnalyticsPlatform,
  dataInicio: string,
  dataFim: string,
): ContentsquareAppDashboardData {
  const dias = Math.min(
    14,
    Math.max(1, Math.round((new Date(dataFim).getTime() - new Date(dataInicio).getTime()) / 86400000) + 1),
  );
  const f = (env === "prod" ? 1.35 : 1) * (platform === "android" ? 1.05 : platform === "ios" ? 0.98 : 1);
  const sessoesDia = Math.round(2800 * f);

  return {
    periodoLabel: `${dataInicio} → ${dataFim} · ${env.toUpperCase()} · ${platform === "all" ? "Android + iOS" : platform}`,
    kpis: [
      { id: "sessions", label: "Sessões analisadas", value: (sessoesDia * dias).toLocaleString("pt-BR"), trendPct: 3.8, variant: "info" },
      { id: "replay", label: "Sessões com replay", value: `${Math.round(72 * (env === "hml" ? 0.9 : 1))}%`, hint: "Session Replay", variant: "success" },
      { id: "duration", label: "Duração média", value: "4m 12s", variant: "default" },
      { id: "friction", label: "Índice de fricção", value: "18", hint: "Escala interna CS", variant: "warning" },
      { id: "rage", label: "Rage taps (período)", value: Math.round(340 * f).toLocaleString("pt-BR"), variant: "danger" },
      { id: "conv_login", label: "Conversão login", value: "91,8%", variant: "success" },
    ],
    sessoesPorDia: serieSessoes(dias, sessoesDia),
    screenViews: SCREENS_CS.map((screenName, i) => ({
      screenName,
      views: Math.round(920 * (1 - i * 0.04) * f),
      uniqueUsers: Math.round(380 * (0.92 - i * 0.04) * f),
    })),
    conversoes: [
      { nome: "login_completed", sessoes: Math.round(410 * f), taxaPct: 91.8 },
      { nome: "agenda_created", sessoes: Math.round(88 * f), taxaPct: 21.4 },
      { nome: "encontro_created", sessoes: Math.round(62 * f), taxaPct: 15.1 },
      { nome: "acao_marked_as_done", sessoes: Math.round(118 * f), taxaPct: 28.8 },
      { nome: "lead_created", sessoes: Math.round(54 * f), taxaPct: 13.2 },
      { nome: "lead_stage_changed", sessoes: Math.round(36 * f), taxaPct: 8.8 },
      { nome: "nps_registered", sessoes: Math.round(22 * f), taxaPct: 5.4 },
      { nome: "ai_next_steps_created", sessoes: Math.round(48 * f), taxaPct: 11.7 },
    ],
    fricoes: [
      { eventName: "form_validation_failed", ocorrencias: Math.round(156 * f), sessoesAfetadas: Math.round(98 * f) },
      { eventName: "upload_failed", ocorrencias: Math.round(48 * f), sessoesAfetadas: Math.round(35 * f) },
      { eventName: "api_error_shown", ocorrencias: Math.round(210 * f), sessoesAfetadas: Math.round(112 * f) },
      { eventName: "biometric_auth_failed", ocorrencias: Math.round(24 * f), sessoesAfetadas: Math.round(22 * f) },
      { eventName: "ai_next_steps_failed", ocorrencias: Math.round(16 * f), sessoesAfetadas: Math.round(14 * f) },
    ],
    customVariables: [
      { name: "environment", value: env, usuarios: Math.round(1200 * f) },
      { name: "user_role", value: "gestor", usuarios: Math.round(280 * f) },
      { name: "user_role", value: "comercial", usuarios: Math.round(520 * f) },
      { name: "app_version", value: "1.0.0", usuarios: Math.round(890 * f) },
      { name: "feature", value: "jornada_comercial", usuarios: Math.round(640 * f) },
      { name: "platform_type", value: platform === "all" ? "android" : platform, usuarios: Math.round(600 * f) },
    ],
    maskingPorTela: MASKING,
    jornadaTop: [
      { passo: "login → home", sessoes: Math.round(380 * f), dropoffPct: 8.2 },
      { passo: "home → jornada_comercial", sessoes: Math.round(210 * f), dropoffPct: 44.7 },
      { passo: "jornada → acao_detail", sessoes: Math.round(142 * f), dropoffPct: 32.4 },
      { passo: "home → encontros_agendas", sessoes: Math.round(118 * f), dropoffPct: 43.8 },
      { passo: "crm_leads → lead_detail", sessoes: Math.round(86 * f), dropoffPct: 27.1 },
    ],
    integracao: {
      sdkIniciado: true,
      sessionReplayAtivo: env === "hml" || env === "prod",
      gtmComplementar: false,
      ultimaColeta: "2026-05-25T08:30:00Z",
    },
  };
}
