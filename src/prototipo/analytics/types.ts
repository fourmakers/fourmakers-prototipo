export type AnalyticsEnvironment = "hml" | "prod";
export type AnalyticsPlatform = "all" | "android" | "ios";

export interface AnalyticsDateRange {
  dataInicio: string;
  dataFim: string;
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
  };
}

export interface ConversaoContentsquare {
  nome: string;
  sessoes: number;
  taxaPct: number;
}

export interface FriccaoContentsquare {
  eventName: string;
  ocorrencias: number;
  sessoesAfetadas: number;
}

export interface MaskingTela {
  tela: string;
  replay: boolean;
  nivelMasking: "Alto" | "Médio" | "Médio/Alto" | "Muito alto" | "Máximo" | "Evitar";
}

export interface ContentsquareAppDashboardData {
  periodoLabel: string;
  kpis: KpiMetric[];
  sessoesPorDia: SerieDia[];
  screenViews: ScreenRanking[];
  conversoes: ConversaoContentsquare[];
  fricoes: FriccaoContentsquare[];
  customVariables: PropriedadeUsuario[];
  maskingPorTela: MaskingTela[];
  jornadaTop: { passo: string; sessoes: number; dropoffPct?: number }[];
  integracao: {
    sdkIniciado: boolean;
    sessionReplayAtivo: boolean;
    gtmComplementar: boolean;
    ultimaColeta: string;
  };
}
