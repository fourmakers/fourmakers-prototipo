import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { HeatmapInsight } from "./types";

function destaqueClass(destaque?: HeatmapInsight["metricas"][0]["destaque"]): string {
  if (destaque === "positive") return "text-success";
  if (destaque === "warning") return "text-warning";
  if (destaque === "danger") return "text-destructive";
  return "text-primaryText";
}

export function HeatmapZoomModal({
  insight,
  open,
  onOpenChange,
}: {
  insight: HeatmapInsight | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!insight?.imagemUrl) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[95vh] max-w-[min(96vw,1400px)] border-borderSoft bg-surfaceElevated p-0"
        data-testid="heatmap-zoom-modal"
      >
        <DialogHeader className="border-borderSoft px-6 pt-6 text-left">
          <div className="flex flex-wrap items-center gap-2 pr-8">
            <DialogTitle className="text-primaryText">{insight.titulo}</DialogTitle>
            <Badge variant="secondary" className="font-normal text-xs">
              {insight.pagina}
            </Badge>
          </div>
          <DialogDescription className="text-secondaryText">
            Heatmap Contentsquare — amplie para validar pontos de clique e zonas de calor.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="px-6 pb-6">
          <div className="overflow-auto rounded-lg border border-borderSoft bg-secondaryBackground">
            <img
              src={insight.imagemUrl}
              alt={`Heatmap ampliado: ${insight.titulo}`}
              className="mx-auto w-full min-w-[min(92vw,1360px)] object-contain"
              data-testid="heatmap-zoom-image"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {insight.metricas.map((m) => (
              <div
                key={m.label}
                className="rounded-md border border-borderSoft bg-secondaryBackground/60 px-3 py-2"
              >
                <p className="text-[10px] uppercase tracking-wide text-secondaryText">{m.label}</p>
                <p className={cn("text-sm font-semibold tabular-nums", destaqueClass(m.destaque))}>{m.valor}</p>
              </div>
            ))}
          </div>

          <p className="mt-3 text-sm leading-relaxed text-secondaryText">{insight.observacao}</p>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
