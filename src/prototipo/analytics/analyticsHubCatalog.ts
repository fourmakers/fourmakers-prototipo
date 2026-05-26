/**
 * Catálogo alinhado ao app Flutter + ANALYTICS_HUB_CENARIO_ESTADO_E_PENDENCIAS (dev).
 * Mocks e filtros usam nomes reais de eventos já instrumentados no fourmakers_app.
 */

/** Eventos Firebase já enviados pelo app (coleta — fase 1). */
export const APP_FIREBASE_EVENTS_INSTRUMENTED = [
  "app_open",
  "login",
  "logout",
  "feature_tapped",
  "screen_view",
  "action_result",
  "form_started",
  "form_submitted",
  "form_validation_failed",
  "friction_error",
] as const;

/** Eventos alvo do guia (ainda não todos no app — mocks misturam para UI de funis). */
export const APP_FIREBASE_EVENTS_ROADMAP = [
  "agenda_created",
  "lead_stage_changed",
  "jornada_kanban_opened",
  "lead_created",
  "ai_next_steps_created",
] as const;

export const APP_DEFAULT_PARAMS = [
  "environment",
  "app_version",
  "build_number",
  "platform",
  "org_id",
] as const;

/** Features para filtro global (hub + RouteService). */
export const APP_FEATURES = [
  { id: "all", label: "Todas as features" },
  { id: "home", label: "Home" },
  { id: "jornada_comercial", label: "Jornada comercial" },
  { id: "encontros_agendas", label: "Agendas" },
  { id: "crm_leads", label: "CRM" },
  { id: "perfil360", label: "Perfil 360" },
  { id: "comunicacao", label: "Comunicação (API)" },
  { id: "auth", label: "Autenticação" },
] as const;

export const FIREBASE_CONSOLE_LINKS = {
  analytics: "https://console.firebase.google.com/project/fourmakers-app/analytics",
  debugView: "https://console.firebase.google.com/project/fourmakers-app/analytics/debugview",
  crashlytics: "https://console.firebase.google.com/project/fourmakers-app/crashlytics",
  performance: "https://console.firebase.google.com/project/fourmakers-app/performance",
} as const;

/** Endpoints hub — prioridade Fase A (dev doc §6). */
export const ANALYTICS_API_ENDPOINTS = {
  overview: "/analytics/overview",
  app: "/analytics/app",
  web: "/analytics/web",
  features: "/analytics/features",
  errors: "/analytics/errors",
  friction: "/analytics/friction",
} as const;

export const HUB_FASE_A_BLOCKERS = [
  "GA4 Property 530562554 — confirmar BigQuery Export activo (analytics_530562554).",
  "Service account Viewer na propriedade GA4 + JSON no Secret Manager.",
  "Deploy Cloud Run (services/analytics-api) → VITE_ANALYTICS_API_BASE_URL.",
  "App: user property/event param `environment` (dev|hml|prod) no DebugView.",
  "Contentsquare: CONTENTSQUARE_API_KEY no servidor (tab CS).",
] as const;

export const ANALYTICS_API_LOCAL_DEV = {
  readme: "services/analytics-api/README.md",
  frontendBff: "docs/ANALYTICS_FRONTEND_BFF_CONFIG.md",
  setupGcp: "docs/ANALYTICS_API_SETUP_GCP.md",
  contrato: "docs/ANALYTICS_API_CONTRATO_BACKEND.md",
  devCommand: "npm run analytics-api:dev",
} as const;
