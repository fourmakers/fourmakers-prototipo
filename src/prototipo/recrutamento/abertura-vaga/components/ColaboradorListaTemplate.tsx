import { cn } from "@/lib/utils";
import type { ColaboradorRef } from "../types";

function iniciais(nome: string): string {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

interface ColaboradorListaTemplateProps {
  colaboradores: ColaboradorRef[];
  selectedId: string | null;
  onSelect: (colab: ColaboradorRef) => void;
  className?: string;
}

export function ColaboradorListaTemplate({
  colaboradores,
  selectedId,
  onSelect,
  className,
}: ColaboradorListaTemplateProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border-[1.5px] border-borderDefault bg-secondaryBackground shadow-[var(--elevation-soft)]",
        className,
      )}
    >
      <p className="border-b border-borderSoft bg-surfaceSubtle px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-secondaryText">
        Colaboradores ativos — selecione um exemplo
      </p>
      <ul role="listbox" aria-label="Lista de colaboradores para substituição" className="max-h-56 overflow-y-auto">
        {colaboradores.length === 0 ? (
          <li className="px-4 py-6 text-center text-[13px] text-secondaryText" role="presentation">
            Nenhum colaborador encontrado para esta busca.
          </li>
        ) : (
          colaboradores.map((c) => {
            const selected = selectedId === c.id;
            return (
              <li key={c.id} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => onSelect(c)}
                  className={cn(
                    "flex w-full items-center gap-3 border-b border-borderSoft px-4 py-2.5 text-left transition-colors last:border-b-0",
                    "hover:bg-accentSoft focus-visible:bg-accentSoft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1",
                    selected && "bg-accentSoft",
                  )}
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-borderSoft text-[11px] font-bold text-accent">
                    {iniciais(c.nome)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-medium text-primaryText">{c.nome}</span>
                    <span className="block text-[11px] text-secondaryText">
                      {c.cargo} · {c.area}
                    </span>
                  </span>
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
