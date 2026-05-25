import type { AnalyticsEnvironment, AnalyticsPlatform } from "../types";
import { getMockContentsquareAppDashboard } from "../mockContentsquareApp";
import { getMockFirebaseAppDashboard } from "../mockFirebaseApp";
import type { ContentsquareAppDashboardData, FirebaseAppDashboardData } from "../types";
import {
  analyticsApiBaseUrl,
  analyticsApiBearerToken,
  analyticsFallbackMockOnError,
  analyticsUseMock,
} from "./analyticsConfig";
import type {
  AnalyticsApiEnvelope,
  AnalyticsApiFilter,
  AnalyticsAppRetorno,
  AnalyticsAppSource,
} from "./analyticsApiTypes";
import { AnalyticsApiError } from "./analyticsApiTypes";
import { resolveContentsquareDashboard, resolveFirebaseDashboard } from "./analyticsNormalizers";

export interface AnalyticsUiFilter {
  dataInicio: string;
  dataFim: string;
  environment: AnalyticsEnvironment;
  platform: AnalyticsPlatform;
  feature?: string;
}

function buildApiFilter(ui: AnalyticsUiFilter): AnalyticsApiFilter {
  return {
    from: ui.dataInicio,
    to: ui.dataFim,
    platform: "app",
    environment: ui.environment,
    devicePlatform: ui.platform,
    feature: ui.feature,
  };
}

function buildPeriodoLabel(ui: AnalyticsUiFilter): string {
  const plat =
    ui.platform === "all" ? "Android + iOS" : ui.platform === "android" ? "Android" : "iOS";
  return `${ui.dataInicio} → ${ui.dataFim} · ${ui.environment.toUpperCase()} · ${plat}`;
}

function buildQueryParams(filter: AnalyticsApiFilter, source: AnalyticsAppSource): string {
  const q = new URLSearchParams({
    from: filter.from,
    to: filter.to,
    platform: filter.platform,
    environment: filter.environment,
    source,
  });
  if (filter.devicePlatform !== "all") {
    q.set("device_platform", filter.devicePlatform);
  }
  if (filter.organizationId) q.set("organization_id", filter.organizationId);
  if (filter.userRole) q.set("user_role", filter.userRole);
  if (filter.feature) q.set("feature", filter.feature);
  if (filter.appVersion) q.set("app_version", filter.appVersion);
  if (filter.clientId) q.set("client_id", filter.clientId);
  return q.toString();
}

async function parseEnvelope<T>(res: Response): Promise<T> {
  let json: unknown;
  try {
    json = await res.json();
  } catch {
    throw new AnalyticsApiError("Resposta inválida da Analytics API.", null, res.status);
  }
  const body = json as AnalyticsApiEnvelope<T>;
  if (!res.ok || !body.sucesso || body.retorno == null) {
    const erros = body.erros;
    throw new AnalyticsApiError(
      body.mensagem ?? `Erro HTTP ${res.status} na Analytics API.`,
      erros,
      res.status,
    );
  }
  return body.retorno;
}

/** Rotas tentadas em ordem (hub §12 + legado doc protótipo). Base vazio → paths relativos (proxy Vite em dev). */
function endpointCandidates(source: AnalyticsAppSource): string[] {
  const base = analyticsApiBaseUrl();
  const root = base || "";
  return [
    `${root}/analytics/app`,
    `${root}/api/analytics/app/${source}/dashboard`,
  ];
}

async function fetchAppChannel(
  ui: AnalyticsUiFilter,
  source: AnalyticsAppSource,
): Promise<AnalyticsAppRetorno> {
  const filter = buildApiFilter(ui);
  const query = buildQueryParams(filter, source);
  const token = analyticsApiBearerToken();
  const headers: HeadersInit = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  let lastError: Error | null = null;

  for (const path of endpointCandidates(source)) {
    const url = `${path}?${query}`;
    try {
      const res = await fetch(url, { method: "GET", headers, credentials: "omit" });
      const retorno = await parseEnvelope<AnalyticsAppRetorno>(res);
      if (source === "firebase" && !retorno.firebase && retorno.dashboard) {
        return { ...retorno, firebase: retorno.dashboard as FirebaseAppDashboardData };
      }
      if (source === "contentsquare" && !retorno.contentsquare && retorno.dashboard) {
        return { ...retorno, contentsquare: retorno.dashboard as ContentsquareAppDashboardData };
      }
      return retorno;
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
    }
  }

  throw lastError ?? new AnalyticsApiError("Analytics API indisponível.", null);
}

export async function fetchFirebaseAppDashboard(
  ui: AnalyticsUiFilter,
): Promise<{ data: FirebaseAppDashboardData; mode: "mock" | "api" | "api-fallback-mock" }> {
  if (analyticsUseMock()) {
    return {
      data: getMockFirebaseAppDashboard(ui.environment, ui.platform, ui.dataInicio, ui.dataFim),
      mode: "mock",
    };
  }

  try {
    const retorno = await fetchAppChannel(ui, "firebase");
    return {
      data: resolveFirebaseDashboard(retorno, buildPeriodoLabel(ui)),
      mode: "api",
    };
  } catch (err) {
    if (analyticsFallbackMockOnError()) {
      return {
        data: getMockFirebaseAppDashboard(ui.environment, ui.platform, ui.dataInicio, ui.dataFim),
        mode: "api-fallback-mock",
      };
    }
    throw err;
  }
}

export async function fetchContentsquareAppDashboard(
  ui: AnalyticsUiFilter,
): Promise<{ data: ContentsquareAppDashboardData; mode: "mock" | "api" | "api-fallback-mock" }> {
  if (analyticsUseMock()) {
    return {
      data: getMockContentsquareAppDashboard(ui.environment, ui.platform, ui.dataInicio, ui.dataFim),
      mode: "mock",
    };
  }

  try {
    const retorno = await fetchAppChannel(ui, "contentsquare");
    return {
      data: resolveContentsquareDashboard(retorno, buildPeriodoLabel(ui)),
      mode: "api",
    };
  } catch (err) {
    if (analyticsFallbackMockOnError()) {
      return {
        data: getMockContentsquareAppDashboard(ui.environment, ui.platform, ui.dataInicio, ui.dataFim),
        mode: "api-fallback-mock",
      };
    }
    throw err;
  }
}
