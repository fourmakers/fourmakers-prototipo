import { cacheGet, cacheKey, cacheSet } from "../cache.js";
import { config } from "../config.js";
import type { AnalyticsAppRetorno, AppQueryParams } from "../types.js";
import { enrichFirebaseFromBigQuery } from "./bigQueryProvider.js";
import { fetchContentsquareDashboard } from "./contentsquareProvider.js";
import { fetchFirebaseFromGa4 } from "./ga4Provider.js";

export async function buildAnalyticsAppResponse(q: AppQueryParams): Promise<AnalyticsAppRetorno> {
  const key = cacheKey({
    route: "app",
    source: q.source,
    from: q.from,
    to: q.to,
    environment: q.environment,
    device_platform: q.device_platform,
    feature: q.feature,
  });

  const cached = cacheGet<AnalyticsAppRetorno>(key);
  if (cached) {
    return {
      ...cached,
      meta: { ...cached.meta, dataMode: "cached", cachedAt: cached.meta?.cachedAt ?? new Date().toISOString() },
    };
  }

  const warnings: string[] = [];
  let retorno: AnalyticsAppRetorno;

  if (q.source === "firebase") {
    const ga4 = await fetchFirebaseFromGa4(q);
    warnings.push(...ga4.warnings);
    const enriched = await enrichFirebaseFromBigQuery(q, ga4.data);
    retorno = {
      firebase: enriched.data,
      source: "firebase",
      meta: {
        dataMode: config.demoMode && !config.ga4PropertyId ? "demo" : "live",
        cachedAt: new Date().toISOString(),
        warnings: warnings.length ? warnings : undefined,
      },
    };
  } else {
    const cs = await fetchContentsquareDashboard(q);
    warnings.push(...cs.warnings);
    retorno = {
      contentsquare: cs.data,
      source: "contentsquare",
      meta: {
        dataMode: cs.data.integracao.apiLive ? "live" : "mock",
        cachedAt: new Date().toISOString(),
        warnings: warnings.length ? warnings : undefined,
      },
    };
  }

  cacheSet(key, retorno);
  return retorno;
}
