/**
 * Configuração da Analytics API FourMakers (hub).
 * @see docs/ANALYTICS_METRICAS_APP_DOCUMENTACAO_TECNICA.md
 */

function envFlag(name: string): string | undefined {
  const v = import.meta.env[name];
  return typeof v === "string" ? v.trim() : undefined;
}

/** Base URL sem barra final (ex.: https://api.example.com ou vazio para mock). */
export function analyticsApiBaseUrl(): string {
  const raw = envFlag("VITE_ANALYTICS_API_BASE_URL");
  if (!raw) return "";
  return raw.replace(/\/$/, "");
}

/** Força mocks locais (default: true se não houver base URL). */
export function analyticsUseMock(): boolean {
  const explicit = envFlag("VITE_ANALYTICS_USE_MOCK");
  if (explicit === "true") return true;
  if (explicit === "false") return false;
  return !analyticsApiBaseUrl();
}

/** Se a API falhar, voltar a mocks (útil em protótipo sem backend). */
export function analyticsFallbackMockOnError(): boolean {
  return envFlag("VITE_ANALYTICS_FALLBACK_MOCK") === "true" || analyticsUseMock();
}

/** Token Bearer (nunca commitar valor real — só .env local / CI). */
export function analyticsApiBearerToken(): string | undefined {
  return envFlag("VITE_ANALYTICS_API_TOKEN");
}

export type AnalyticsDataMode = "mock" | "api" | "api-fallback-mock";

/** UI: borda warning quando dados não vêm da Analytics API em modo live. */
export function isAnalyticsMockMode(mode: AnalyticsDataMode | undefined): boolean {
  return mode === "mock" || mode === "api-fallback-mock" || mode === undefined;
}

/** GA4 Property ID conhecido (handoff) — só metadado UI / default servidor. */
export const GA4_PROPERTY_ID_DEFAULT = "530562554";

/** Stream Android (GA4 Admin → Fluxos de dados) — handoff Analytics. */
export const GA4_ANDROID_STREAM_ID = "14319499513";

/** Measurement ID do stream Android — handoff Analytics. */
export const GA4_MEASUREMENT_ID_DEFAULT = "G-530562554";

export function ga4PropertyIdDisplay(): string {
  const v = import.meta.env.VITE_GA4_PROPERTY_ID;
  if (typeof v === "string" && v.trim()) return v.trim();
  return GA4_PROPERTY_ID_DEFAULT;
}

export function describeAnalyticsDataMode(mode: AnalyticsDataMode): string {
  switch (mode) {
    case "mock":
      return "Dados simulados";
    case "api":
      return "Analytics API";
    case "api-fallback-mock":
      return "API indisponível · simulado";
  }
}
