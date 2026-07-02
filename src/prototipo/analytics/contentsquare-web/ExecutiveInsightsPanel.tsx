import { AlertTriangle, CheckCircle2, Info, Lightbulb, ThumbsUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ExecutiveParecer, InsightItem } from "./types";

const NOTA_LABELS = {
  excelente: { label: "Excelente", className: "bg-success/15 text-success" },
  bom: { label: "Bom", className: "bg-info/15 text-info" },
  regular: { label: "Regular", className: "bg-warning/15 text-warning" },
  critico: { label: "Crítico", className: "bg-destructive/15 text-destructive" },
} as const;

function InsightIcon({ tipo }: { tipo: InsightItem["tipo"] }) {
  if (tipo === "positive") return <ThumbsUp className="size-4 shrink-0 text-success" />;
  if (tipo === "warning") return <AlertTriangle className="size-4 shrink-0 text-warning" />;
  if (tipo === "danger") return <AlertTriangle className="size-4 shrink-0 text-destructive" />;
  return <Info className="size-4 shrink-0 text-info" />;
}

function InsightList({ items, titulo }: { items: InsightItem[]; titulo: string }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-primaryText">{titulo}</h3>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.titulo} className="flex gap-2.5">
            <InsightIcon tipo={item.tipo} />
            <div>
              <p className="text-sm font-medium text-primaryText">{item.titulo}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-secondaryText">{item.descricao}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ExecutiveInsightsPanel({ parecer }: { parecer: ExecutiveParecer }) {
  const nota = NOTA_LABELS[parecer.notaGeral];

  return (
    <Card className="border-borderSoft bg-surfaceElevated shadow-softToken" data-testid="cs-executive-parecer">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold text-primaryText">Parecer executivo</CardTitle>
          <p className="mt-1 text-sm leading-relaxed text-secondaryText">{parecer.resumo}</p>
        </div>
        <Badge className={cn("shrink-0 font-semibold", nota.className)}>Nota: {nota.label}</Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <InsightList items={parecer.pontosPositivos} titulo="Pontos positivos" />
          <InsightList items={parecer.pontosAtencao} titulo="Pontos de atenção" />
        </div>

        <div className="rounded-lg border border-borderSoft bg-accentSoft/40 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primaryText">
            <Lightbulb className="size-4 text-warning" />
            Recomendações
          </div>
          <ol className="list-decimal space-y-1.5 pl-5 text-sm text-secondaryText">
            {parecer.recomendacoes.map((rec) => (
              <li key={rec}>{rec}</li>
            ))}
          </ol>
        </div>

        <div className="flex items-center gap-2 text-xs text-secondaryText">
          <CheckCircle2 className="size-3.5 text-success" />
          Análise gerada a partir dos dados Contentsquare e heatmaps do período.
        </div>
      </CardContent>
    </Card>
  );
}
