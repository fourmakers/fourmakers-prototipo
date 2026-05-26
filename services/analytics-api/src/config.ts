function env(name: string, fallback = ""): string {
  return (process.env[name] ?? fallback).trim();
}

function envBool(name: string, fallback = false): boolean {
  const v = env(name).toLowerCase();
  if (v === "true" || v === "1" || v === "yes") return true;
  if (v === "false" || v === "0" || v === "no") return false;
  return fallback;
}

export const config = {
  port: Number(env("PORT", "3001")),
  ga4PropertyId: env("GA4_PROPERTY_ID", "530562554"),
  gcpProjectId: env("GCP_PROJECT_ID", "fourmakers-app"),
  bqEnabled: envBool("BQ_ENABLED"),
  bqDataset: env("BQ_DATASET"),
  analyticsApiToken: env("ANALYTICS_API_TOKEN"),
  corsOrigins: env("CORS_ORIGINS", "http://localhost:8080").split(",").map((s) => s.trim()).filter(Boolean),
  cacheTtlMs: Number(env("CACHE_TTL_MS", "900000")),
  demoMode: envBool("DEMO_MODE"),
  contentsquareApiKey: env("CONTENTSQUARE_API_KEY"),
  contentsquareSiteId: env("CONTENTSQUARE_SITE_ID"),
  contentsquareApiBaseUrl: env("CONTENTSQUARE_API_BASE_URL", "https://api.contentsquare.com").replace(/\/$/, ""),
};

export function ga4Configured(): boolean {
  return Boolean(config.ga4PropertyId);
}

export function bqConfigured(): boolean {
  return config.bqEnabled && Boolean(config.bqDataset || config.ga4PropertyId);
}

export function bqDatasetId(): string {
  if (config.bqDataset) return config.bqDataset;
  if (config.ga4PropertyId) return `analytics_${config.ga4PropertyId}`;
  return "";
}
