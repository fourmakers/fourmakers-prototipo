import { useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ColaboradorRef } from "../types";
import { useColaboradoresAtivos } from "../hooks/useColaboradoresAtivos";
import { AdmissaoInfo } from "./AdmissaoInfo";
import { BannerExperiencia } from "./BannerExperiencia";
import { ColaboradorListaTemplate } from "./ColaboradorListaTemplate";

function iniciais(nome: string): string {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

interface ColaboradorSubstituidoFieldProps {
  value: ColaboradorRef | null;
  onChange: (colab: ColaboradorRef | null) => void;
}

export function ColaboradorSubstituidoField({ value, onChange }: ColaboradorSubstituidoFieldProps) {
  const [query, setQuery] = useState("");
  const { colaboradores } = useColaboradoresAtivos(query);

  const handleTrocar = () => {
    onChange(null);
    setQuery("");
  };

  const handleSelect = (colab: ColaboradorRef) => {
    onChange(colab);
    setQuery("");
  };

  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs font-semibold text-primaryText">
          Quem está sendo substituído? <span className="font-normal text-error">*</span>
        </p>
        <p className="mt-1 text-xs leading-relaxed text-secondaryText">
          Selecione o colaborador ativo que ocupava essa posição. A data de admissão será usada
          para identificar se está no período de experiência.
        </p>
      </div>

      {!value ? (
        <div className="space-y-3">
          <div className="relative">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome ou cargo..."
              className={cn(
                "h-11 w-full rounded-md border-[1.5px] border-borderDefault bg-secondaryBackground",
                "py-0 pl-4 pr-11 text-[13px] text-primaryText outline-none transition-colors",
                "placeholder:text-secondaryText focus:border-accent",
              )}
              aria-label="Buscar colaborador substituído"
            />
            {query.length > 0 ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondaryText hover:text-primaryText"
                aria-label="Limpar busca"
              >
                <X className="size-4" aria-hidden />
              </button>
            ) : (
              <Search
                className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-secondaryText"
                aria-hidden
              />
            )}
          </div>

          <ColaboradorListaTemplate
            colaboradores={colaboradores}
            selectedId={null}
            onSelect={handleSelect}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 rounded-md border-[1.5px] border-accent bg-accentSoft p-3.5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-[13px] font-bold text-inverseText">
              {iniciais(value.nome)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-primaryText">{value.nome}</span>
              <span className="block text-xs text-secondaryText">
                {value.cargo} · {value.area}
              </span>
            </span>
            <button
              type="button"
              onClick={handleTrocar}
              className="shrink-0 text-[11px] font-medium text-accent hover:underline"
            >
              Trocar
            </button>
          </div>
          <AdmissaoInfo colaborador={value} />
          <BannerExperiencia colaborador={value} />
        </div>
      )}
    </div>
  );
}
