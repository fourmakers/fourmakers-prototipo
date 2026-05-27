import { useCallback, useMemo, useState } from "react";
import type { EtapaUrgenciaForm, PrioridadeRecrutamento } from "../types";

const INITIAL: EtapaUrgenciaForm = {
  prioridade: null,
  prazo_contratacao: "",
  quantidade_posicoes: 1,
  observacoes_recrutador: "",
};

export type UseEtapaUrgenciaFormReturn = ReturnType<typeof useEtapaUrgenciaForm>;

export function useEtapaUrgenciaForm() {
  const [form, setForm] = useState<EtapaUrgenciaForm>(INITIAL);

  const setPrioridade = useCallback((prioridade: PrioridadeRecrutamento) => {
    setForm((prev) => ({ ...prev, prioridade }));
  }, []);

  const setField = useCallback(<K extends keyof EtapaUrgenciaForm>(key: K, value: EtapaUrgenciaForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const podeAvancar = useMemo(() => {
    return (
      form.prioridade !== null &&
      form.prazo_contratacao.length > 0 &&
      form.quantidade_posicoes >= 1 &&
      form.quantidade_posicoes <= 99
    );
  }, [form]);

  return { form, setPrioridade, setField, podeAvancar };
}
