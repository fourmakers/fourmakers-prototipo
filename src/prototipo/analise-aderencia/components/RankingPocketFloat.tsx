import { useState } from "react";
import { ChevronDown, Medal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CandidatoAnalise } from "../types";

interface RankingPocketFloatProps {
  candidatos: CandidatoAnalise[];
  selecionadoId: string | null;
  onSelect: (id: string) => void;
  visible: boolean;
}

export function RankingPocketFloat({
  candidatos,
  selecionadoId,
  onSelect,
  visible,
}: RankingPocketFloatProps) {
  const [expanded, setExpanded] = useState(true);
  const ordenados = [...candidatos].sort((a, b) => a.ranking - b.ranking);

  return (
    <div
      role="navigation"
      aria-label="Ranking rápido de aderência"
      className={cn(
        "fixed bottom-6 right-6 z-40 w-[min(100vw-2rem,280px)] transition-all duration-300",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <div className="overflow-hidden rounded-2xl border border-borderSoft bg-secondaryBackground/95 shadow-[0_12px_40px_rgba(15,23,42,0.18)] backdrop-blur-md analise-glow-card">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 border-b border-borderSoft px-3 py-2 text-left transition-colors hover:bg-surfaceSubtle/80"
          aria-expanded={expanded}
          aria-controls="ranking-pocket-list"
          onClick={() => setExpanded((e) => !e)}
        >
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-accent">Ranking</p>
            <p className="text-[11px] text-secondaryText">
              {expanded ? "Toque para ver o parecer" : `${ordenados.length} candidatos`}
            </p>
          </div>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-secondaryText transition-transform duration-200",
              expanded && "rotate-180",
            )}
            aria-hidden
          />
        </button>
        <ul
          id="ranking-pocket-list"
          className={cn(
            "max-h-[min(50vh,320px)] overflow-y-auto p-2 transition-all duration-200",
            expanded ? "visible opacity-100" : "hidden",
          )}
        >
          {ordenados.map((c) => {
            const selected = selecionadoId === c.id;
            const primeiroNome = c.nome.split(" ")[0];
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(c.id);
                    document
                      .getElementById("parecer-candidato")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left transition-colors",
                    selected ? "bg-accentSoft text-primaryText" : "hover:bg-surfaceSubtle",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                      c.ranking === 1 ? "analise-brand-gradient text-white" : "bg-surfaceSubtle",
                    )}
                  >
                    {c.ranking === 1 ? <Medal className="size-3.5" aria-hidden /> : c.ranking}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-xs font-semibold">{primeiroNome}</span>
                  <span className="shrink-0 text-sm font-bold text-accent">{c.aderenciaGeral}%</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
