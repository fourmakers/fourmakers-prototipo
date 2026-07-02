import type { KpiMetric, SerieDia } from "@/prototipo/analytics/types";

export type ContentsquareReportKind = "recruitment" | "candidate";

export interface ContentsquareReportPeriod {
  begin: string;
  end: string;
  label: string;
}

export interface HeatmapInsight {
  id: string;
  titulo: string;
  pagina: string;
  imagemUrl?: string;
  metricas: { label: string; valor: string; destaque?: "positive" | "warning" | "danger" | "neutral" }[];
  observacao: string;
}

export interface InsightItem {
  tipo: "positive" | "warning" | "danger" | "info";
  titulo: string;
  descricao: string;
}

export interface ExecutiveParecer {
  resumo: string;
  pontosPositivos: InsightItem[];
  pontosAtencao: InsightItem[];
  recomendacoes: string[];
  notaGeral: "excelente" | "bom" | "regular" | "critico";
}

export interface ReportTableRow {
  [key: string]: string | number;
}

export interface ReportTable {
  id: string;
  titulo: string;
  colunas: { key: string; label: string; align?: "left" | "right" }[];
  linhas: ReportTableRow[];
}

export interface ReportSerie {
  id: string;
  titulo: string;
  dados: SerieDia[];
  unidade?: string;
}

export interface ContentsquareWebReport {
  version: 1;
  kind: ContentsquareReportKind;
  workspaceName: string;
  exportDate: string;
  periodo: ContentsquareReportPeriod;
  fonte: "default" | "imported";
  importadoEm?: string;
  kpis: KpiMetric[];
  series: ReportSerie[];
  tabelas: ReportTable[];
  heatmapInsights: HeatmapInsight[];
  parecer: ExecutiveParecer;
}

export interface ContentsquareWidget {
  name: string;
  meta: Record<string, string>;
  headers: string[];
  rows: string[][];
}

export interface ParsedContentsquareExport {
  workspaceName: string;
  exportDate: string;
  widgets: ContentsquareWidget[];
}
