import { Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { VagaResumoModel } from "../types";

interface ResumoVagaViewProps {
  model: VagaResumoModel;
}

export function ResumoVagaView({ model }: ResumoVagaViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surfaceSubtle">
          <Info className="size-5 text-primaryText" aria-hidden />
        </div>
        <h3 className="text-lg font-bold text-primaryText">Dados sobre a vaga</h3>
      </div>

      <div className="grid w-full grid-cols-1 gap-x-10 gap-y-3 text-sm md:grid-cols-2">
        <div className="space-y-3">
          {model.left.map((item) => (
            <div key={item.label}>
              <span className="text-secondaryText">{item.label}:</span>{" "}
              <span className="text-primaryText">{item.value}</span>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {model.right.map((item) => (
            <div key={item.label}>
              <span className="text-secondaryText">{item.label}:</span>{" "}
              <span className="text-primaryText">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <section className="space-y-2" aria-label="Observações internas">
        <h4 className="text-sm font-semibold text-primaryText">Observações internas</h4>
        <div className="whitespace-pre-wrap break-words rounded-xl bg-surfaceSubtle p-4 text-sm leading-relaxed text-primaryText">
          {model.observacoesInternas}
        </div>
      </section>

      <Separator />

      <section className="space-y-2" aria-label="Descrição da vaga">
        <h4 className="text-sm font-semibold text-primaryText">Descrição da vaga</h4>
        <div className="whitespace-pre-wrap break-words rounded-xl bg-surfaceSubtle p-4 text-sm leading-relaxed text-primaryText">
          {model.descricao}
        </div>
      </section>
    </div>
  );
}
