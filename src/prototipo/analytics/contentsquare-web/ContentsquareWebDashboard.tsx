import { useState } from "react";
import { ScanEye, ZoomIn } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ContentsquareWebReport, HeatmapInsight } from "./types";
import { AnalyticsKpiGrid } from "@/prototipo/analytics/AnalyticsShared";
import { ContentsquareSerieChart } from "./ContentsquareSerieChart";
import { ExecutiveInsightsPanel } from "./ExecutiveInsightsPanel";
import { HeatmapZoomModal } from "./HeatmapZoomModal";
import { MultiDataTableCard } from "./MultiDataTableCard";

function destaqueClass(destaque?: HeatmapInsight["metricas"][0]["destaque"]): string {
  if (destaque === "positive") return "text-success";
  if (destaque === "warning") return "text-warning";
  if (destaque === "danger") return "text-destructive";
  return "text-primaryText";
}

function HeatmapCard({ insight }: { insight: HeatmapInsight }) {
  const [zoomOpen, setZoomOpen] = useState(false);

  return (
    <>
      <Card className="border-borderSoft bg-surfaceElevated shadow-softToken overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-sm font-semibold text-primaryText">{insight.titulo}</CardTitle>
            <Badge variant="secondary" className="font-normal text-xs">
              {insight.pagina}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {insight.imagemUrl ? (
            <button
              type="button"
              className="group relative w-full overflow-hidden rounded-lg border border-borderSoft bg-secondaryBackground text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              onClick={() => setZoomOpen(true)}
              aria-label={`Ampliar heatmap: ${insight.titulo}`}
              data-testid={`heatmap-thumb-${insight.id}`}
            >
              <img
                src={insight.imagemUrl}
                alt={`Heatmap: ${insight.titulo}`}
                className="w-full object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/25">
                <span className="flex items-center gap-1.5 rounded-full bg-surfaceElevated/95 px-3 py-1.5 text-xs font-medium text-primaryText opacity-0 shadow-softToken transition-opacity group-hover:opacity-100">
                  <ZoomIn className="size-3.5" aria-hidden />
                  Clique para ampliar
                </span>
              </div>
            </button>
          ) : null}
          <div className="flex flex-wrap gap-2">
            {insight.metricas.map((m) => (
              <div
                key={m.label}
                className="rounded-md border border-borderSoft bg-secondaryBackground/60 px-2.5 py-1.5"
              >
                <p className="text-[10px] uppercase tracking-wide text-secondaryText">{m.label}</p>
                <p className={cn("text-sm font-semibold tabular-nums", destaqueClass(m.destaque))}>{m.valor}</p>
              </div>
            ))}
          </div>
          <p className="text-xs leading-relaxed text-secondaryText">{insight.observacao}</p>
        </CardContent>
      </Card>

      <HeatmapZoomModal insight={insight} open={zoomOpen} onOpenChange={setZoomOpen} />
    </>
  );
}

export function ContentsquareWebDashboard({ report }: { report: ContentsquareWebReport }) {
  const titulo = report.kind === "recruitment" ? "Recrutamento — Criação de vagas" : "Candidatos — Vaga externa";

  return (
    <div className="space-y-6" data-testid={`cs-dashboard-${report.kind}`}>
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-borderSoft bg-accentSoft/50 px-4 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/20 text-accent">
          <ScanEye className="size-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-primaryText">{titulo}</p>
          <p className="text-xs text-secondaryText">
            {report.workspaceName} · {report.periodo.label}
          </p>
        </div>
        <Badge variant="outline" className="font-normal">
          Contentsquare
        </Badge>
      </div>

      <AnalyticsKpiGrid kpis={report.kpis} testIdPrefix={`cs-${report.kind}`} />

      {report.series.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {report.series.map((serie) => (
            <ContentsquareSerieChart
              key={serie.id}
              titulo={serie.titulo}
              serie={serie.dados}
              unidade={serie.unidade}
              testId={`cs-chart-${serie.id}`}
            />
          ))}
        </div>
      ) : null}

      <div>
        <h2 className="mb-3 text-base font-semibold text-primaryText">Análise de heatmaps</h2>
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {report.heatmapInsights.map((h) => (
            <HeatmapCard key={h.id} insight={h} />
          ))}
        </div>
      </div>

      {report.tabelas.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {report.tabelas.map((tabela) => (
            <MultiDataTableCard key={tabela.id} table={tabela} reportKind={report.kind} />
          ))}
        </div>
      ) : null}

      <ExecutiveInsightsPanel parecer={report.parecer} />
    </div>
  );
}
