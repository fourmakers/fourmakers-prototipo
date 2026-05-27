import { useCallback, useMemo, useState } from "react";
import type { ColaboradorRef, MotivoSaida, OrigemVaga } from "../types";
import { MOTIVOS_EXIGEM_COLABORADOR } from "../types";

export type UseEtapaContextoFormReturn = ReturnType<typeof useEtapaContextoForm>;

export function useEtapaContextoForm() {
  const [origem_vaga, setOrigemVaga] = useState<OrigemVaga | null>(null);
  const [motivo_saida, setMotivoSaida] = useState<MotivoSaida | null>(null);
  const [colaborador_substituido, setColaborador] = useState<ColaboradorRef | null>(null);

  const mostraMotivo = origem_vaga === "substituicao";
  const mostraColaborador =
    mostraMotivo &&
    motivo_saida !== null &&
    MOTIVOS_EXIGEM_COLABORADOR.includes(motivo_saida);

  const handleOrigemChange = useCallback((valor: OrigemVaga) => {
    setOrigemVaga(valor);
    setMotivoSaida(null);
    setColaborador(null);
  }, []);

  const handleMotivoChange = useCallback((valor: MotivoSaida) => {
    setMotivoSaida(valor);
    setColaborador(null);
  }, []);

  const handleColaboradorChange = useCallback((colab: ColaboradorRef | null) => {
    setColaborador(colab);
  }, []);

  const podeAvancar = useMemo(() => {
    if (!origem_vaga) return false;
    if (origem_vaga !== "substituicao") return true;
    if (!motivo_saida) return false;
    const precisaColab = MOTIVOS_EXIGEM_COLABORADOR.includes(motivo_saida);
    if (!precisaColab) return true;
    return colaborador_substituido !== null;
  }, [origem_vaga, motivo_saida, colaborador_substituido]);

  return {
    origem_vaga,
    motivo_saida,
    colaborador_substituido,
    mostraMotivo,
    mostraColaborador,
    podeAvancar,
    handleOrigemChange,
    handleMotivoChange,
    handleColaboradorChange,
  };
}
