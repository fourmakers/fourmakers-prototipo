import type { UseEtapaContextoFormReturn } from "../hooks/useEtapaContextoForm";
import { OrigemVagaField } from "./OrigemVaga";
import { MotivoSaidaField } from "./MotivoSaida";
import { ColaboradorSubstituidoField } from "./ColaboradorSubstituido";

interface EtapaContextoProps {
  form: UseEtapaContextoFormReturn;
}

export function EtapaContexto({ form }: EtapaContextoProps) {
  const {
    subsecao,
    origem_vaga,
    motivo_saida,
    colaborador_substituido,
    handleOrigemChange,
    handleMotivoChange,
    handleColaboradorChange,
  } = form;

  return (
    <div className="min-h-[280px]">
      {subsecao === "origem" && (
        <OrigemVagaField value={origem_vaga} onChange={handleOrigemChange} />
      )}
      {subsecao === "motivo" && (
        <MotivoSaidaField value={motivo_saida} onChange={handleMotivoChange} />
      )}
      {subsecao === "colaborador" && (
        <ColaboradorSubstituidoField
          value={colaborador_substituido}
          onChange={handleColaboradorChange}
        />
      )}
    </div>
  );
}
