/** Contrato alinhado ao protótipo (FirebaseAppDashboardData PT). */

export type AnalyticsEnvironment = "dev" | "hml" | "prod";
export type DevicePlatform = "all" | "android" | "ios";
export type AnalyticsAppSource = "firebase" | "contentsquare";

export interface AppQueryParams {
  from: string;
  to: string;
  platform: "app";
  environment: AnalyticsEnvironment;
  source: AnalyticsAppSource;
  device_platform?: DevicePlatform;
  feature?: string;
  organization_id?: string;
  user_role?: string;
  app_version?: string;
  client_id?: string;
}

export interface KpiMetric {
  id: string;
  label: string;
  value: string | number;
  hint?: string;
  trendPct?: number;
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

export interface SerieDia {
  data: string;
  valor: number;
}

export interface EventoRanking {
  eventName: string;
  totalEvents: number;
  uniqueUsers: number;
  feature?: string;
}

export interface ScreenRanking {
  screenName: string;
  views: number;
  uniqueUsers: number;
}

export interface FunilEtapa {
  nome: string;
  usuarios: number;
  taxaConversaoPct?: number;
}

export interface PropriedadeUsuario {
  name: string;
  value: string;
  usuarios: number;
}

export interface FirebaseAppDashboardData {
  periodoLabel: string;
  kpis: KpiMetric[];
  eventosPorDia: SerieDia[];
  topEventos: EventoRanking[];
  screenViews: ScreenRanking[];
  funis: { id: string; titulo: string; etapas: FunilEtapa[] }[];
  userProperties: PropriedadeUsuario[];
  erros: EventoRanking[];
  integracao: {
    bigQueryExportAtivo: boolean;
    debugViewAtivo: boolean;
    ultimaSyncBigQuery: string;
    ga4DataApi?: boolean;
  };
}

export interface ContentsquareAppDashboardData {
  periodoLabel: string;
  kpis: KpiMetric[];
  sessoesPorDia: SerieDia[];
  screenViews: ScreenRanking[];
  conversoes: { nome: string; sessoes: number; taxaPct: number }[];
  fricoes: { eventName: string; ocorrencias: number; sessoesAfetadas: number }[];
  customVariables: PropriedadeUsuario[];
  maskingPorTela: { tela: string; replay: boolean; nivelMasking: string }[];
  jornadaTop: { passo: string; sessoes: number; dropoffPct?: number }[];
  integracao: {
    sdkIniciado: boolean;
    sessionReplayAtivo: boolean;
    gtmComplementar: boolean;
    ultimaColeta: string;
    apiLive?: boolean;
  };
}

export interface AnalyticsAppRetorno {
  firebase?: FirebaseAppDashboardData;
  contentsquare?: ContentsquareAppDashboardData;
  dashboard?: FirebaseAppDashboardData | ContentsquareAppDashboardData;
  source?: AnalyticsAppSource;
  meta?: {
    dataMode?: "live" | "mock" | "cached" | "demo";
    cachedAt?: string;
    warnings?: string[];
  };
}

export interface AnalyticsApiEnvelope<T> {
  retorno: T | null;
  sucesso: boolean;
  mensagem: string | null;
  erros: string[] | string | null;
}
