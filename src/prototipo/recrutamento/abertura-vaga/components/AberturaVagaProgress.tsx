import { Check, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { ABERTURA_VAGA_ETAPAS, type AberturaVagaEtapaId } from "../hooks/useAberturaVagaWizard";

interface AberturaVagaProgressProps {
  etapaAtual: AberturaVagaEtapaId;
}

export function AberturaVagaProgress({ etapaAtual }: AberturaVagaProgressProps) {
  return (
    <nav
      className="mb-14 flex w-full items-start justify-between gap-1 sm:gap-2"
      aria-label="Etapas do formulário"
    >
      {ABERTURA_VAGA_ETAPAS.map((step, index) => {
        const done = step.id < etapaAtual;
        const active = step.id === etapaAtual;
        const isFirst = index === 0;
        const isLast = index === ABERTURA_VAGA_ETAPAS.length - 1;

        return (
          <div
            key={step.id}
            className="flex min-w-0 flex-1 flex-col items-center"
            style={{ flexBasis: 0 }}
          >
            <div className="flex w-full items-center">
              <div
                className={cn(
                  "h-px min-w-2 flex-1",
                  isFirst ? "invisible" : step.id <= etapaAtual ? "bg-accent" : "bg-borderDefault",
                )}
                aria-hidden
              />
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-colors",
                  done && "bg-accent text-inverseText",
                  active &&
                    "bg-accent text-inverseText shadow-[0_0_0_4px_var(--color-accent-soft)]",
                  !done &&
                    !active &&
                    "border-[1.5px] border-borderDefault bg-secondaryBackground text-secondaryText",
                )}
                aria-current={active ? "step" : undefined}
              >
                {done ? (
                  <Check className="size-3.5" aria-hidden />
                ) : step.id === 1 && active ? (
                  <Flag className="size-3.5" aria-hidden />
                ) : (
                  step.id
                )}
              </div>
              <div
                className={cn(
                  "h-px min-w-2 flex-1",
                  isLast ? "invisible" : step.id < etapaAtual ? "bg-accent" : "bg-borderDefault",
                )}
                aria-hidden
              />
            </div>
            <span
              className={cn(
                "mt-2 w-full px-0.5 text-center text-[11px] font-medium leading-snug",
                (active || done) && "font-semibold text-primaryText",
                !active && !done && "text-secondaryText",
              )}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </nav>
  );
}
