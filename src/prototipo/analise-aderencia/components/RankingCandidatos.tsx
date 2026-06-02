import { Medal, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CandidatoAnalise } from "../types";

interface RankingCandidatosProps {
  candidatos: CandidatoAnalise[];
  selecionadoId: string | null;
  onSelect: (id: string) => void;
  /** Cards mais compactos na coluna lateral */
  compact?: boolean;
}

const POTENCIAL_LABEL = {
  alto: { label: "Alto", className: "bg-successSoft text-success border-successBorder" },
  medio: { label: "Médio", className: "bg-infoSoft text-info border-infoBorder" },
  em_desenvolvimento: {
    label: "Dev.",
    className: "bg-warningSoft text-warning border-warningBorder",
  },
};

export function RankingCandidatos({
  candidatos,
  selecionadoId,
  onSelect,
  compact = false,
}: RankingCandidatosProps) {
  const ordenados = [...candidatos].sort((a, b) => a.ranking - b.ranking);

  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-base font-bold text-primaryText">Ranking de aderência</h3>
        <p className="text-[11px] text-secondaryText">
          {ordenados.length} candidatos · clique para o parecer
        </p>
      </div>
      <ul className={cn("space-y-2", compact && "space-y-1.5")}>
        {ordenados.map((c) => {
          const pot = POTENCIAL_LABEL[c.potencial];
          const selected = selecionadoId === c.id;
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onSelect(c.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border text-left transition-all duration-300",
                  compact ? "p-3" : "gap-4 p-4",
                  "hover:-translate-y-0.5 hover:shadow-[var(--elevation-card-hover)]",
                  selected
                    ? "border-accent bg-accentSoft shadow-[0_0_24px_rgba(154,27,255,0.12)]"
                    : "border-borderSoft bg-secondaryBackground analise-glow-card",
                )}
              >
                <span
                  className={cn(
                    "flex shrink-0 items-center justify-center rounded-full font-bold",
                    compact ? "size-8 text-xs" : "size-10 text-sm",
                    c.ranking === 1 ? "analise-brand-gradient text-white" : "bg-surfaceSubtle text-primaryText",
                  )}
                >
                  {c.ranking === 1 ? <Medal className={compact ? "size-4" : "size-5"} aria-hidden /> : c.ranking}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={cn("block font-semibold text-primaryText", compact && "text-sm")}>
                    {c.nome}
                  </span>
                  {!compact && (
                    <>
                      <span className="block text-xs text-secondaryText">
                        {c.cargoAtual} · {c.fonteLabel}
                      </span>
                      <span className="mt-1 line-clamp-2 text-xs text-secondaryText">{c.resumo}</span>
                    </>
                  )}
                  {compact && (
                    <span className="block truncate text-[10px] text-secondaryText">{c.cargoAtual}</span>
                  )}
                </span>
                <span className="flex shrink-0 flex-col items-end gap-0.5">
                  <span className={cn("font-bold text-accent", compact ? "text-lg" : "text-2xl")}>
                    {c.aderenciaGeral}%
                  </span>
                  <span
                    className={cn(
                      "rounded-full border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide",
                      pot.className,
                    )}
                  >
                    {pot.label}
                  </span>
                </span>
                <ChevronRight className="size-3.5 shrink-0 text-secondaryText" aria-hidden />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
