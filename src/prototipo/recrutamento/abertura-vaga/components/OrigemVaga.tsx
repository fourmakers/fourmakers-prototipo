import type { OrigemVaga } from "../types";
import { OptionCard } from "./OptionCard";

const OPCOES: { value: OrigemVaga; title: string; subtitle: string }[] = [
  {
    value: "substituicao",
    title: "Substituição",
    subtitle: "Alguém saiu e precisa ser reposto",
  },
  {
    value: "nova_posicao",
    title: "Nova posição",
    subtitle: "Cargo que não existia antes",
  },
  {
    value: "cobertura_temporaria",
    title: "Cobertura temporária",
    subtitle: "Licença, projeto ou período específico",
  },
  {
    value: "reativacao",
    title: "Reativação",
    subtitle: "Vaga pausada que volta ao funil",
  },
];

interface OrigemVagaFieldProps {
  value: OrigemVaga | null;
  onChange: (valor: OrigemVaga) => void;
}

export function OrigemVagaField({ value, onChange }: OrigemVagaFieldProps) {
  return (
    <fieldset className="space-y-2 border-0 p-0">
      <legend className="text-xs font-semibold text-primaryText">
        Por que essa vaga está sendo aberta? <span className="font-normal text-error">*</span>
      </legend>
      <p className="text-xs leading-relaxed text-secondaryText">
        Escolha o motivo que melhor descreve a origem desta requisição.
      </p>
      <div
        className="grid grid-cols-1 gap-2 sm:grid-cols-2"
        role="radiogroup"
        aria-label="Origem da vaga"
      >
        {OPCOES.map((opt) => (
          <OptionCard
            key={opt.value}
            name="origem_vaga"
            value={opt.value}
            title={opt.title}
            subtitle={opt.subtitle}
            selected={value === opt.value}
            onSelect={() => onChange(opt.value)}
          />
        ))}
      </div>
    </fieldset>
  );
}
