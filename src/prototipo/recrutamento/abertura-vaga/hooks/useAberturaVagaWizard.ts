import { useCallback, useState } from "react";

export const ABERTURA_VAGA_ETAPAS = [
  { id: 1, label: "Motivos de abertura" },
  { id: 2, label: "Dados complementares" },
  { id: 3, label: "Resumo da vaga" },
] as const;

export type AberturaVagaEtapaId = (typeof ABERTURA_VAGA_ETAPAS)[number]["id"];

export function useAberturaVagaWizard() {
  const [etapaAtual, setEtapaAtual] = useState<AberturaVagaEtapaId>(1);

  const avancar = useCallback(() => {
    setEtapaAtual((e) => (e < 3 ? ((e + 1) as AberturaVagaEtapaId) : e));
  }, []);

  const voltar = useCallback(() => {
    setEtapaAtual((e) => (e > 1 ? ((e - 1) as AberturaVagaEtapaId) : e));
  }, []);

  const irPara = useCallback((etapa: AberturaVagaEtapaId) => {
    setEtapaAtual(etapa);
  }, []);

  return {
    etapaAtual,
    avancar,
    voltar,
    irPara,
    podeVoltar: etapaAtual > 1,
    ehUltimaEtapa: etapaAtual === 3,
  };
}
