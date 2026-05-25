import type { ContentsquareAppDashboardData, FirebaseAppDashboardData, FunilEtapa, KpiMetric } from "../types";
import type {
  AnalyticsAppRetorno,
  AnalyticsAppSource,
  UnifiedAppChannelDto,
  UnifiedFunnelStepDto,
  UnifiedMetricCardDto,
} from "./analyticsApiTypes";

function isFirebaseShape(data: Record<string, unknown>): data is FirebaseAppDashboardData {
  return Array.isArray(data.kpis) && Array.isArray(data.topEventos);
}

function isContentsquareShape(data: Record<string, unknown>): data is ContentsquareAppDashboardData {
  return Array.isArray(data.kpis) && Array.isArray(data.conversoes) && Array.isArray(data.fricoes);
}

function kpiVariantFromTrend(trend?: string, delta?: number): KpiMetric["variant"] {
  if (trend === "down" || (delta != null && delta < 0)) return "warning";
  if (trend === "up" || (delta != null && delta > 0)) return "success";
  return "default";
}

function mapUnifiedKpis(cards: UnifiedMetricCardDto[]): KpiMetric[] {
  return cards.map((c) => ({
    id: c.id,
    label: c.label,
    value: c.value,
    hint: c.description,
    trendPct: c.deltaPercent,
    variant: kpiVariantFromTrend(c.trend, c.deltaPercent),
  }));
}

function mapFunnelSteps(steps: UnifiedFunnelStepDto[]): FunilEtapa[] {
  return steps.map((s) => ({
    nome: s.name,
    usuarios: s.users,
    taxaConversaoPct: s.conversionRatePct,
  }));
}

export function normalizeFirebaseFromUnified(dto: UnifiedAppChannelDto, fallbackLabel: string): FirebaseAppDashboardData {
  return {
    periodoLabel: dto.periodoLabel ?? fallbackLabel,
    kpis: dto.kpis ? mapUnifiedKpis(dto.kpis) : [],
    eventosPorDia: (dto.eventsByDay ?? []).map((p) => ({ data: p.date, valor: p.value })),
    topEventos: dto.topEvents ?? [],
    screenViews: dto.screenViews ?? [],
    funis: (dto.funnels ?? []).map((f) => ({
      id: f.id,
      titulo: f.titulo,
      etapas: mapFunnelSteps(f.etapas),
    })),
    userProperties: dto.userProperties ?? [],
    erros: dto.errors ?? [],
    integracao: {
      bigQueryExportAtivo: Boolean(dto.integracao?.bigQueryExportAtivo ?? true),
      debugViewAtivo: Boolean(dto.integracao?.debugViewAtivo ?? false),
      ultimaSyncBigQuery: String(dto.integracao?.ultimaSyncBigQuery ?? new Date().toISOString()),
    },
  };
}

export function normalizeContentsquareFromUnified(
  dto: UnifiedAppChannelDto,
  fallbackLabel: string,
): ContentsquareAppDashboardData {
  return {
    periodoLabel: dto.periodoLabel ?? fallbackLabel,
    kpis: dto.kpis ? mapUnifiedKpis(dto.kpis) : [],
    sessoesPorDia: (dto.sessionsByDay ?? dto.eventsByDay ?? []).map((p) => ({
      data: p.date,
      valor: p.value,
    })),
    screenViews: dto.screenViews ?? [],
    conversoes: dto.conversoes ?? [],
    fricoes: dto.fricoes ?? [],
    customVariables: dto.customVariables ?? [],
    maskingPorTela: dto.maskingPorTela ?? [],
    jornadaTop: dto.jornadaTop ?? [],
    integracao: {
      sdkIniciado: Boolean(dto.integracao?.sdkIniciado ?? true),
      sessionReplayAtivo: Boolean(dto.integracao?.sessionReplayAtivo ?? true),
      gtmComplementar: Boolean(dto.integracao?.gtmComplementar ?? false),
      ultimaColeta: String(dto.integracao?.ultimaColeta ?? new Date().toISOString()),
    },
  };
}

function extractChannelRaw(retorno: AnalyticsAppRetorno, source: AnalyticsAppSource): unknown {
  if (source === "firebase" && retorno.firebase) return retorno.firebase;
  if (source === "contentsquare" && retorno.contentsquare) return retorno.contentsquare;
  if (retorno.dashboard && retorno.source === source) return retorno.dashboard;
  if (retorno.dashboard && !retorno.source) return retorno.dashboard;
  const unified = retorno as unknown as UnifiedAppChannelDto;
  if (unified.kpis || unified.eventsByDay || unified.sessionsByDay) return unified;
  return null;
}

export function resolveFirebaseDashboard(
  retorno: AnalyticsAppRetorno,
  periodoLabel: string,
): FirebaseAppDashboardData {
  const raw = extractChannelRaw(retorno, "firebase");
  if (!raw || typeof raw !== "object") {
    throw new Error("Resposta Analytics API sem canal Firebase.");
  }
  const obj = raw as Record<string, unknown>;
  if (isFirebaseShape(obj)) return obj;
  return normalizeFirebaseFromUnified(raw as UnifiedAppChannelDto, periodoLabel);
}

export function resolveContentsquareDashboard(
  retorno: AnalyticsAppRetorno,
  periodoLabel: string,
): ContentsquareAppDashboardData {
  const raw = extractChannelRaw(retorno, "contentsquare");
  if (!raw || typeof raw !== "object") {
    throw new Error("Resposta Analytics API sem canal Contentsquare.");
  }
  const obj = raw as Record<string, unknown>;
  if (isContentsquareShape(obj)) return obj;
  return normalizeContentsquareFromUnified(raw as UnifiedAppChannelDto, periodoLabel);
}
