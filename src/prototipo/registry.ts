import type { ComponentType } from "react";
import { AgenteAutodescobertaPage } from "@/prototipo/pages/AgenteAutodescobertaPage";
import { DashboardComercialQualidadeBasePage } from "@/prototipo/dashboard-comercial/DashboardComercialQualidadeBasePage";
import { AnalyticsMetricasAppPage } from "@/prototipo/pages/AnalyticsMetricasAppPage";
import { AnalyticsMetricasRecrutamentoPage } from "@/prototipo/pages/AnalyticsMetricasRecrutamentoPage";
import { AnalyticsMetricasCandidatosPage } from "@/prototipo/pages/AnalyticsMetricasCandidatosPage";
import { AberturaVagaSubstituicaoPage } from "@/prototipo/pages/AberturaVagaSubstituicaoPage";
import { AnaliseAderenciaPage } from "@/prototipo/pages/AnaliseAderenciaPage";
import { CriacaoVagaAssistentePage } from "@/prototipo/pages/CriacaoVagaAssistentePage";

/** Grupo no menu lateral e na home */
export type PrototipoMenuGroup = "prototipos" | "analytics";

export const MENU_GROUP_LABELS: Record<PrototipoMenuGroup, string> = {
  prototipos: "Protótipos",
  analytics: "Analytics",
};

/**
 * Registro de protótipos (rotas na raiz do app, sem prefixo `/prototipo/`).
 * URL publicada: `{base}/fourmakers-prototipo/{routeSlug}` (ex.: `/analise-aderencia`).
 * Novo protótipo: crie a página, importe aqui e adicione um item — menu e cards da home atualizam automaticamente.
 */
export interface PrototipoRegistryEntry {
  /** Identificador estável (rota e chave React) */
  id: string;
  /** Caminho completo na raiz, ex.: `/minha-feature` */
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
    path: "/agente-autodescoberta",
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
    path: "/dashboard-comercial",
    menuGroup: "prototipos",
    menuLabel: "Dashboard comercial",
    cardTitle: "Dashboard comercial",
    cardDescription: "Qualidade da base — KPIs, recência de visitas (C-Level/Decisor) e painéis expansíveis.",
    routeSlug: "dashboard-comercial",
    documentationMarkdownFile: "DASHBOARD_COMERCIAL_DOCUMENTACAO_TECNICA.md",
    Component: DashboardComercialQualidadeBasePage,
  },
  {
    id: "criacao-vaga-assistente",
    path: "/criacao-vaga-assistente",
    menuGroup: "prototipos",
    menuLabel: "Assistente criação de vaga",
    cardTitle: "Assistente de criação de vaga",
    cardDescription:
      "Criação dinâmica de perfil/vaga com IA (prompt ou formulário), preview editável e completude do perfil antes da publicação.",
    routeSlug: "criacao-vaga-assistente",
    documentationMarkdownFile: "CRIACAO_VAGA_ASSISTENTE_DOCUMENTACAO_TECNICA.md",
    Component: CriacaoVagaAssistentePage,
  },
  {
    id: "analise-aderencia",
    path: "/analise-aderencia",
    menuGroup: "prototipos",
    menuLabel: "Análise de aderência",
    cardTitle: "Análise de aderência",
    cardDescription:
      "Triagem com IA: upload de CV/ZIP/LinkedIn, panorama da vaga, ranking e parecer visual (radar, critérios, PDI e trajetória).",
    routeSlug: "analise-aderencia",
    documentationMarkdownFile: "ANALISE_ADERENCIA_DOCUMENTACAO_TECNICA.md",
    Component: AnaliseAderenciaPage,
  },
  {
    id: "abertura-vaga-substituicao",
    path: "/abertura-vaga-substituicao",
    menuGroup: "prototipos",
    menuLabel: "Abertura de vaga — substituição",
    cardTitle: "Abertura de vaga — substituição",
    cardDescription:
      "Etapa Contexto do formulário de abertura: origem da vaga, motivo de saída e colaborador substituído com cálculo de período de experiência (90 dias).",
    routeSlug: "abertura-vaga-substituicao",
    documentationMarkdownFile: "ABERTURA_VAGA_SUBSTITUICAO_DOCUMENTACAO_TECNICA.md",
    Component: AberturaVagaSubstituicaoPage,
  },
  {
    id: "analytics-metricas-app",
    path: "/metricas-app",
    menuGroup: "analytics",
    menuLabel: "Métricas APP",
    cardTitle: "Métricas APP",
    cardDescription:
      "Dashboards App — Firebase Analytics (GA4/BigQuery) e Contentsquare (replay, fricção, jornadas) com seletor e filtros; base para comparativo Web.",
    routeSlug: "metricas-app",
    documentationMarkdownFile: "ANALYTICS_METRICAS_APP_DOCUMENTACAO_TECNICA.md",
    Component: AnalyticsMetricasAppPage,
  },
  {
    id: "analytics-metricas-recrutamento",
    path: "/metricas-recrutamento",
    menuGroup: "analytics",
    menuLabel: "Métricas Recrutamento",
    cardTitle: "Métricas Recrutamento",
    cardDescription:
      "Dashboard executivo Contentsquare — criação de vagas, heatmaps, erros JS, uso de IA e parecer de churn/fricção com import/export de planilhas.",
    routeSlug: "metricas-recrutamento",
    Component: AnalyticsMetricasRecrutamentoPage,
  },
  {
    id: "analytics-metricas-candidatos",
    path: "/metricas-candidatos",
    menuGroup: "analytics",
    menuLabel: "Métricas Candidatos",
    cardDescription:
      "Dashboard executivo Contentsquare — inscrição em vagas externas, upload de CV, bounce/exit rate e análise geográfica com import/export.",
    cardTitle: "Métricas Candidatos",
    routeSlug: "metricas-candidatos",
    Component: AnalyticsMetricasCandidatosPage,
  },
];

export function registryByMenuGroup(group: PrototipoMenuGroup): PrototipoRegistryEntry[] {
  return PROTOTIPO_REGISTRY.filter((e) => e.menuGroup === group);
}
