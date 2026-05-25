import type { ContentsquareAppDashboardData, FirebaseAppDashboardData } from "../types";

/** Envelope padrão Fourmakers (.NET / Analytics API). */
export interface AnalyticsApiEnvelope<T> {
  retorno: T | null;
  sucesso: boolean;
  mensagem: string | null;
  erros: string[] | string | null;
}

/** Filtros globais — alinhado a fourmakers_analytics_hub_instrucoes §12. */
export interface AnalyticsApiFilter {
  from: string;
  to: string;
  platform: "app";
  environment: "dev" | "hml" | "prod";
  devicePlatform: "all" | "android" | "ios";
  organizationId?: string;
  userRole?: string;
  feature?: string;
  appVersion?: string;
  clientId?: string;
}

export type AnalyticsAppSource = "firebase" | "contentsquare";

/** Resposta unificada GET /analytics/app (canais opcionais). */
export interface AnalyticsAppRetorno {
  firebase?: FirebaseAppDashboardData;
  contentsquare?: ContentsquareAppDashboardData;
  /** Formato alternativo: payload único por source */
  dashboard?: FirebaseAppDashboardData | ContentsquareAppDashboardData;
  source?: AnalyticsAppSource;
  meta?: {
    sourcesEnabled?: Partial<Record<AnalyticsAppSource | "hotjar" | "ga4", boolean>>;
    cachedAt?: string;
    dataMode?: "live" | "mock" | "cached";
  };
}

/** Cartão métrico unificado (hub) — normalizer converte se API só enviar isto. */
export interface UnifiedMetricCardDto {
  id: string;
  label: string;
  value: number | string;
  previousValue?: number | string;
  deltaPercent?: number;
  trend?: "up" | "down" | "flat";
  source?: string[];
  description?: string;
}

export interface UnifiedTimeSeriesPointDto {
  date: string;
  value: number;
}

export interface UnifiedFunnelStepDto {
  name: string;
  users: number;
  conversionRatePct?: number;
}

export interface UnifiedAppChannelDto {
  periodoLabel?: string;
  kpis?: UnifiedMetricCardDto[];
  eventsByDay?: UnifiedTimeSeriesPointDto[];
  topEvents?: {
    eventName: string;
    totalEvents: number;
    uniqueUsers: number;
    feature?: string;
  }[];
  screenViews?: { screenName: string; views: number; uniqueUsers: number }[];
  funnels?: { id: string; titulo: string; etapas: UnifiedFunnelStepDto[] }[];
  userProperties?: { name: string; value: string; usuarios: number }[];
  errors?: {
    eventName: string;
    totalEvents: number;
    uniqueUsers: number;
    feature?: string;
  }[];
  integracao?: Record<string, unknown>;
  sessionsByDay?: UnifiedTimeSeriesPointDto[];
  conversoes?: { nome: string; sessoes: number; taxaPct: number }[];
  fricoes?: { eventName: string; ocorrencias: number; sessoesAfetadas: number }[];
  customVariables?: { name: string; value: string; usuarios: number }[];
  maskingPorTela?: ContentsquareAppDashboardData["maskingPorTela"];
  jornadaTop?: { passo: string; sessoes: number; dropoffPct?: number }[];
}

export class AnalyticsApiError extends Error {
  constructor(
    message: string,
    public readonly erros?: string[] | string | null,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "AnalyticsApiError";
  }
}
