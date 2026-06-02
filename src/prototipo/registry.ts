import type { ComponentType } from "react";
import { AgenteAutodescobertaPage } from "@/prototipo/pages/AgenteAutodescobertaPage";
import { DashboardComercialQualidadeBasePage } from "@/prototipo/dashboard-comercial/DashboardComercialQualidadeBasePage";
import { AnalyticsMetricasAppPage } from "@/prototipo/pages/AnalyticsMetricasAppPage";
import { AberturaVagaSubstituicaoPage } from "@/prototipo/pages/AberturaVagaSubstituicaoPage";
import { AnaliseAderenciaPage } from "@/prototipo/pages/AnaliseAderenciaPage";

/** Grupo no menu lateral e na home */
export type PrototipoMenuGroup = "prototipos" | "analytics";

export const MENU_GROUP_LABELS: Record<PrototipoMenuGroup, string> = {
  prototipos: "Protótipos",
  analytics: "Analytics",
};

/**
 * Registro de protótipos sob `/prototipo/*`.
 * Novo protótipo: crie a página, importe aqui e adicione um item — menu e cards da home atualizam automaticamente.
 */
export interface PrototipoRegistryEntry {
  /** Identificador estável (rota e chave React) */
  id: string;
  /** Caminho completo, ex.: `/prototipo/minha-feature` */
  path: string;
  /** Grupo no menu (Protótipos ou Analytics) */
  menuGroup: PrototipoMenuGroup;
  /** Rótulo no menu lateral */
  menuLabel: string;
  /** Título no card da página inicial */
  cardTitle: string;
  /** Subtítulo / descrição no card */
  cardDescription: string;
  /** Texto monoespaçado no card (slug da rota) */
  routeSlug: string;
  /**
   * Nome do ficheiro Markdown em `docs/` e `public/docs/` (ex.: `FEATURE_DOCUMENTACAO_TECNICA.md`).
   * O botão de download na home usa `/docs/{nome}`. Sincronização: `npm run sync:prototipo-docs` (corre no dev/build).
   */
  documentationMarkdownFile?: string;
  Component: ComponentType;
}

export const PROTOTIPO_REGISTRY: PrototipoRegistryEntry[] = [
  {
    id: "agente-autodescoberta",
    path: "/prototipo/agente-autodescoberta",
    menuGroup: "prototipos",
    menuLabel: "Agente de Autodescoberta",
    cardTitle: "Agente de Autodescoberta",
    cardDescription:
      "Chat guiado em 9 etapas: acolhimento, profissão, valores (10 de 32), situações e devolução com competências e cargos (protótipo com respostas simuladas).",
    routeSlug: "agente-autodescoberta",
    documentationMarkdownFile: "FOURMAKERS_AGENTE_DOCUMENTACAO_TECNICA.md",
    Component: AgenteAutodescobertaPage,
  },
  {
    id: "dashboard-comercial-qualidade-base",
    path: "/prototipo/dashboard-comercial",
    menuGroup: "prototipos",
    menuLabel: "Dashboard comercial",
    cardTitle: "Dashboard comercial",
    cardDescription: "Qualidade da base — KPIs, recência de visitas (C-Level/Decisor) e painéis expansíveis.",
    routeSlug: "dashboard-comercial",
    documentationMarkdownFile: "DASHBOARD_COMERCIAL_DOCUMENTACAO_TECNICA.md",
    Component: DashboardComercialQualidadeBasePage,
  },
  {
    id: "analise-aderencia",
    path: "/prototipo/recrutamento/analise-aderencia",
    menuGroup: "prototipos",
    menuLabel: "Análise de aderência",
    cardTitle: "Análise de aderência",
    cardDescription:
      "Triagem com IA: upload de CV/ZIP/LinkedIn, panorama da vaga, ranking e parecer visual (radar, critérios, PDI e trajetória).",
    routeSlug: "recrutamento/analise-aderencia",
    documentationMarkdownFile: "ANALISE_ADERENCIA_DOCUMENTACAO_TECNICA.md",
    Component: AnaliseAderenciaPage,
  },
  {
    id: "abertura-vaga-substituicao",
    path: "/prototipo/recrutamento/abertura-vaga-substituicao",
    menuGroup: "prototipos",
    menuLabel: "Abertura de vaga — substituição",
    cardTitle: "Abertura de vaga — substituição",
    cardDescription:
      "Etapa Contexto do formulário de abertura: origem da vaga, motivo de saída e colaborador substituído com cálculo de período de experiência (90 dias).",
    routeSlug: "recrutamento/abertura-vaga-substituicao",
    documentationMarkdownFile: "ABERTURA_VAGA_SUBSTITUICAO_DOCUMENTACAO_TECNICA.md",
    Component: AberturaVagaSubstituicaoPage,
  },
  {
    id: "analytics-metricas-app",
    path: "/prototipo/analytics/metricas-app",
    menuGroup: "analytics",
    menuLabel: "Métricas APP",
    cardTitle: "Métricas APP",
    cardDescription:
      "Dashboards App — Firebase Analytics (GA4/BigQuery) e Contentsquare (replay, fricção, jornadas) com seletor e filtros; base para comparativo Web.",
    routeSlug: "analytics/metricas-app",
    documentationMarkdownFile: "ANALYTICS_METRICAS_APP_DOCUMENTACAO_TECNICA.md",
    Component: AnalyticsMetricasAppPage,
  },
];

export function registryByMenuGroup(group: PrototipoMenuGroup): PrototipoRegistryEntry[] {
  return PROTOTIPO_REGISTRY.filter((e) => e.menuGroup === group);
}
