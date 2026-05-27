import { useCallback, useState } from "react";
import type { ColaboradorRef, MotivoSaida, OrigemVaga } from "../types";
import { MOTIVOS_EXIGEM_COLABORADOR } from "../types";

export type SubsecaoMotivos = "origem" | "motivo" | "colaborador";

export type UseEtapaContextoFormReturn = ReturnType<typeof useEtapaContextoForm>;

function derivarSubsecao(
  origem: OrigemVaga | null,
  motivo: MotivoSaida | null,
  colaborador: ColaboradorRef | null,
): SubsecaoMotivos {
  if (!origem || origem !== "substituicao") return "origem";
  if (!motivo) return "motivo";
  if (MOTIVOS_EXIGEM_COLABORADOR.includes(motivo) && !colaborador) return "colaborador";
  if (MOTIVOS_EXIGEM_COLABORADOR.includes(motivo) && colaborador) return "colaborador";
  return "motivo";
}

export function useEtapaContextoForm(onConcluirMotivos?: () => void) {
  const [origem_vaga, setOrigemVaga] = useState<OrigemVaga | null>(null);
  const [motivo_saida, setMotivoSaida] = useState<MotivoSaida | null>(null);
  const [colaborador_substituido, setColaborador] = useState<ColaboradorRef | null>(null);
  const [subsecao, setSubsecao] = useState<SubsecaoMotivos>("origem");

  const handleOrigemChange = useCallback(
    (valor: OrigemVaga) => {
      setOrigemVaga(valor);
      setMotivoSaida(null);
      setColaborador(null);
      if (valor === "substituicao") {
        setSubsecao("motivo");
      } else {
        onConcluirMotivos?.();
      }
    },
    [onConcluirMotivos],
  );

  const handleMotivoChange = useCallback(
    (valor: MotivoSaida) => {
      setMotivoSaida(valor);
      setColaborador(null);
      if (MOTIVOS_EXIGEM_COLABORADOR.includes(valor)) {
        setSubsecao("colaborador");
      } else {
        onConcluirMotivos?.();
      }
    },
    [onConcluirMotivos],
  );

  const handleColaboradorChange = useCallback(
    (colab: ColaboradorRef | null) => {
      setColaborador(colab);
      if (colab) {
        onConcluirMotivos?.();
      }
    },
    [onConcluirMotivos],
  );

  const voltarSubsecao = useCallback(() => {
    if (subsecao === "colaborador") {
      setColaborador(null);
      setSubsecao("motivo");
      return;
    }
    if (subsecao === "motivo") {
      setMotivoSaida(null);
      setOrigemVaga(null);
      setSubsecao("origem");
    }
  }, [subsecao]);

  const syncSubsecaoFromEstado = useCallback(() => {
    setSubsecao(derivarSubsecao(origem_vaga, motivo_saida, colaborador_substituido));
  }, [origem_vaga, motivo_saida, colaborador_substituido]);

  return {
    origem_vaga,
    motivo_saida,
    colaborador_substituido,
    subsecao,
    handleOrigemChange,
    handleMotivoChange,
    handleColaboradorChange,
    voltarSubsecao,
    syncSubsecaoFromEstado,
    podeVoltarSubsecao: subsecao !== "origem",
  };
}
