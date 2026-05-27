import type { MotivoSaida } from "../types";
import { RevealField } from "./RevealField";
import { OptionCard } from "./OptionCard";

const OPCOES: {
  value: MotivoSaida;
  title: string;
  subtitle: string;
}[] = [
  {
    value: "demissao_voluntaria",
    title: "Pedido de demissão",
    subtitle: "A pessoa pediu para sair",
  },
  {
    value: "desligamento",
    title: "Desligamento pela empresa",
    subtitle: "A empresa encerrou o contrato",
  },
  {
    value: "movimentacao_positiva",
    title: "Movimentação interna ou externa positiva",
    subtitle: "Promoção, transferência ou oportunidade maior",
  },
  {
    value: "aposentadoria",
    title: "Aposentadoria",
    subtitle: "Encerramento natural da carreira",
  },
];

interface MotivoSaidaFieldProps {
  visible: boolean;
  value: MotivoSaida | null;
  onChange: (valor: MotivoSaida) => void;
}

export function MotivoSaidaField({ visible, value, onChange }: MotivoSaidaFieldProps) {
  return (
    <RevealField visible={visible}>
      <div className="my-1 h-px bg-borderSoft" />
      <fieldset className="mt-5 space-y-2 border-0 p-0">
        <legend className="text-xs font-semibold text-primaryText">
          Por que a pessoa anterior saiu? <span className="font-normal text-error">*</span>
        </legend>
        <p className="text-xs leading-relaxed text-secondaryText">
          Isso ajuda o recrutador a entender o contexto antes de buscar candidatos.
        </p>
        <div className="flex flex-col gap-2" role="radiogroup" aria-label="Motivo de saída">
          {OPCOES.map((opt) => (
            <OptionCard
              key={opt.value}
              name="motivo_saida"
              value={opt.value}
              title={opt.title}
              subtitle={opt.subtitle}
              selected={value === opt.value}
              onSelect={() => onChange(opt.value)}
            />
          ))}
        </div>
      </fieldset>
    </RevealField>
  );
}
