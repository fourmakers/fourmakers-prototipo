import { useState, type ComponentType } from "react";
import { ChevronDown, Lightbulb, Target, TrendingUp, Users } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { PanoramaVaga, VagaAnalise } from "../types";

interface PanoramaVagaSectionProps {
  vaga: VagaAnalise;
  panorama: PanoramaVaga;
}

function SecaoExpansivel({
  titulo,
  icon: Icon,
  count,
  children,
  defaultOpen = false,
}: {
  titulo: string;
  icon: ComponentType<{ className?: string }>;
  count: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="rounded-2xl border border-borderSoft bg-secondaryBackground">
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left transition-colors hover:bg-surfaceSubtle/80">
        <span className="flex items-center gap-2 text-sm font-semibold text-primaryText">
          <Icon className="size-4 text-accent" aria-hidden />
          {titulo}
          <span className="rounded-full bg-accentSoft px-2 py-0.5 text-[10px] font-bold text-accent">
            {count}
          </span>
        </span>
        <ChevronDown
          className={cn("size-4 shrink-0 text-secondaryText transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="border-t border-borderSoft px-4 pb-4 pt-2">{children}</CollapsibleContent>
    </Collapsible>
  );
}

export function PanoramaVagaSection({ vaga, panorama }: PanoramaVagaSectionProps) {
  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-2xl analise-brand-gradient p-[1px]">
        <div className="rounded-2xl bg-secondaryBackground px-4 py-4">
          <h3 className="text-base font-bold text-primaryText">Panorama da vaga e mercado</h3>
          <p className="mt-0.5 text-xs text-secondaryText">
            {vaga.codigo} · {vaga.titulo} — {vaga.cliente}
          </p>
        </div>
      </div>

      <div className="analise-glass analise-glow-card space-y-4 rounded-2xl p-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 text-accent" aria-hidden />
          <h4 className="text-sm font-semibold text-primaryText">Momento e contexto</h4>
        </div>
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-accent">Momento de mercado</p>
          <p className="text-xs leading-relaxed text-secondaryText">{panorama.momentoMercado}</p>
        </div>
        <div className="border-t border-borderSoft pt-3">
          <p className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-accentSecondary">
            <Users className="size-3" aria-hidden />
            Contexto do cliente
          </p>
          <p className="text-xs leading-relaxed text-secondaryText">{panorama.contextoCliente}</p>
        </div>
        <div className="border-t border-borderSoft pt-3">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-secondaryText">
            Contexto de mercado
          </p>
          <p className="text-xs leading-relaxed text-secondaryText">{panorama.contextoMercado}</p>
        </div>
      </div>

      <SecaoExpansivel titulo="Desafios da posição" icon={Target} count={vaga.desafios.length} defaultOpen>
        <ul className="space-y-2">
          {vaga.desafios.map((d, i) => (
            <li
              key={d}
              className="flex gap-2 rounded-xl border border-borderSoft bg-surfaceSubtle/60 px-3 py-2 text-xs leading-relaxed text-primaryText"
            >
              <span className="font-bold text-accent">{i + 1}.</span>
              {d}
            </li>
          ))}
        </ul>
      </SecaoExpansivel>

      <SecaoExpansivel
        titulo="Insights para triagem"
        icon={Lightbulb}
        count={panorama.insightsTriagem.length}
        defaultOpen
      >
        <ul className="space-y-2">
          {panorama.insightsTriagem.map((ins) => (
            <li
              key={ins}
              className="flex gap-2 rounded-xl border-l-4 border-accent bg-accentSoft/40 px-3 py-2 text-xs leading-relaxed text-primaryText"
            >
              {ins}
            </li>
          ))}
        </ul>
      </SecaoExpansivel>
    </section>
  );
}
