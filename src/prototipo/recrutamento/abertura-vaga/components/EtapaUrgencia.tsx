import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { UseEtapaUrgenciaFormReturn } from "../hooks/useEtapaUrgenciaForm";
import { PRIORIDADES } from "../mocks/perfilCatalogos";
import { FormSection } from "./FormSection";
import { OptionCard } from "./OptionCard";

interface EtapaUrgenciaProps {
  form: UseEtapaUrgenciaFormReturn;
}

export function EtapaUrgencia({ form }: EtapaUrgenciaProps) {
  const { form: data, setPrioridade, setField } = form;

  return (
    <div className="space-y-4">
      <p className="text-xs leading-relaxed text-secondaryText">
        Defina prioridade e prazo para o funil. Em produção, estes dados alimentam SLA e ordenação na
        gestão de vagas.
      </p>

      <FormSection title="Prioridade no funil" description="Impacta destaque para o recrutador responsável.">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Prioridade">
          {PRIORIDADES.map((p) => (
            <OptionCard
              key={p.value}
              name="prioridade"
              value={p.value}
              title={p.label}
              subtitle={p.subtitle}
              subtitleClassName={p.value === "critica" ? "text-warning" : undefined}
              selected={data.prioridade === p.value}
              onSelect={() => setPrioridade(p.value)}
            />
          ))}
        </div>
      </FormSection>

      <FormSection title="Prazo e volume">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="prazo-contratacao" className="text-xs">
              Prazo desejado para contratação <span className="text-error">*</span>
            </Label>
            <Input
              id="prazo-contratacao"
              type="date"
              value={data.prazo_contratacao}
              onChange={(e) => setField("prazo_contratacao", e.target.value)}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="qtd-posicoes" className="text-xs">
              Quantidade de posições <span className="text-error">*</span>
            </Label>
            <Input
              id="qtd-posicoes"
              type="number"
              min={1}
              max={99}
              value={data.quantidade_posicoes}
              onChange={(e) => setField("quantidade_posicoes", Number(e.target.value) || 1)}
              className="h-11"
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Observações para o recrutador">
        <Textarea
          value={data.observacoes_recrutador}
          onChange={(e) => setField("observacoes_recrutador", e.target.value)}
          placeholder="Ex.: aprovação do gestor em até 48h, entrevista técnica obrigatória..."
          rows={3}
          className="resize-y text-sm"
        />
      </FormSection>
    </div>
  );
}
