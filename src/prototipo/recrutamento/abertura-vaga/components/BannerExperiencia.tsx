import { AlertTriangle, Check, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ColaboradorRef } from "../types";
import {
  DIAS_EXPERIENCIA,
  calcularExperiencia,
  formatarDataAdmissao,
} from "../utils/experiencia";

interface BannerExperienciaProps {
  colaborador: ColaboradorRef | null;
}

const BARRA_COR: Record<string, string> = {
  error: "bg-error",
  warning: "bg-warning",
  info: "bg-info",
};

export function BannerExperiencia({ colaborador }: BannerExperienciaProps) {
  if (!colaborador) return null;

  const { dias, dentro, pct, corBarra } = calcularExperiencia(colaborador.data_admissao);

  if (dentro) {
    return (
      <div
        className="flex gap-3 rounded-md border border-warningBorder bg-[#FEF3C7] p-4"
        role="status"
      >
        <AlertTriangle className="mt-0.5 size-[18px] shrink-0 text-warning" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-primaryText">
            {colaborador.nome} ainda está no período de experiência
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-secondaryText">
            Com <strong className="font-semibold text-primaryText">{dias} dias</strong> de empresa,
            este desligamento ocorre dentro dos {DIAS_EXPERIENCIA} dias de experiência. Este caso
            será sinalizado no dashboard para acompanhamento do recrutador responsável.
          </p>
          <div className="mt-2.5">
            <div className="h-1.5 overflow-hidden rounded-full bg-black/[0.08]">
              <div
                className={cn("h-full rounded-full transition-[width] duration-500", BARRA_COR[corBarra])}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-secondaryText">
              <span>Admissão · {formatarDataAdmissao(colaborador.data_admissao)}</span>
              <span>Dia {DIAS_EXPERIENCIA}</span>
            </div>
          </div>
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-warningBorder px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#92400E]">
            <LayoutDashboard className="size-2.5" aria-hidden />
            Aparecerá no dashboard
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex gap-3 rounded-md border border-successBorder bg-[#F0FDF4] p-4"
      role="status"
    >
      <Check className="mt-0.5 size-[18px] shrink-0 text-success" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-primaryText">Fora do período de experiência</p>
        <p className="mt-0.5 text-xs leading-relaxed text-secondaryText">
          {colaborador.nome} tem{" "}
          <strong className="font-semibold text-primaryText">{dias} dias</strong> de empresa — o
          período de experiência já foi concluído. Esta substituição não será sinalizada como caso
          de experiência no dashboard.
        </p>
        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-successBorder px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#166534]">
          <Check className="size-2.5" aria-hidden />
          Não entra no monitoramento
        </span>
      </div>
    </div>
  );
}
