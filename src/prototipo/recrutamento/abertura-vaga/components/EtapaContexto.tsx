import type { UseEtapaContextoFormReturn } from "../hooks/useEtapaContextoForm";
import { OrigemVagaField } from "./OrigemVaga";
import { MotivoSaidaField } from "./MotivoSaida";
import { ColaboradorSubstituidoField } from "./ColaboradorSubstituido";

interface EtapaContextoProps {
  form: UseEtapaContextoFormReturn;
}

export function EtapaContexto({ form }: EtapaContextoProps) {
  const {
    origem_vaga,
    motivo_saida,
    colaborador_substituido,
    mostraMotivo,
    mostraColaborador,
    handleOrigemChange,
    handleMotivoChange,
    handleColaboradorChange,
  } = form;

  return (
    <div className="flex flex-col gap-6">
      <OrigemVagaField value={origem_vaga} onChange={handleOrigemChange} />

      <MotivoSaidaField
        visible={mostraMotivo}
        value={motivo_saida}
        onChange={handleMotivoChange}
      />

      <ColaboradorSubstituidoField
        visible={mostraColaborador}
        value={colaborador_substituido}
        onChange={handleColaboradorChange}
      />
    </div>
  );
}
