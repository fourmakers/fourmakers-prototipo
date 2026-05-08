import type { ComponentType } from "react";
import { DashboardComercialQualidadeBasePage } from "@/prototipo/dashboard-comercial/DashboardComercialQualidadeBasePage";

/**
 * Registro de protótipos sob `/prototipo/*`.
 * Novo protótipo: crie a página, importe aqui e adicione um item — menu e cards da home atualizam automaticamente.
 */
export interface PrototipoRegistryEntry {
  /** Identificador estável (rota e chave React) */
  id: string;
  /** Caminho completo, ex.: `/prototipo/minha-feature` */
  path: string;
  /** Rótulo no menu lateral (grupo Protótipos) */
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
    id: "dashboard-comercial-qualidade-base",
    path: "/prototipo/dashboard-comercial",
    menuLabel: "Dashboard comercial",
    cardTitle: "Dashboard comercial",
    cardDescription: "Qualidade da base — KPIs, recência de visitas (C-Level/Decisor) e painéis expansíveis.",
    routeSlug: "dashboard-comercial",
    documentationMarkdownFile: "DASHBOARD_COMERCIAL_DOCUMENTACAO_TECNICA.md",
    Component: DashboardComercialQualidadeBasePage,
  },
];
