import { useCallback, useState } from "react";
import type { EtapaDadosComplementaresForm } from "../types";

const INITIAL: EtapaDadosComplementaresForm = {
  gestor_interno_id: "",
  gestor_interno_nome: "",
  proposta_crm: "",
  tipo_vaga_id: "",
  tipo_contratacao_id: "",
  unidade_id: "",
  maquina: "",
  numero_de_vagas: 1,
  recrutador_id: "",
  recrutador_nome: "",
  emails_adicionais: [],
  observacoes_internas: "",
};

export type UseEtapaDadosComplementaresFormReturn = ReturnType<typeof useEtapaDadosComplementaresForm>;

export function useEtapaDadosComplementaresForm() {
  const [form, setForm] = useState<EtapaDadosComplementaresForm>(INITIAL);

  const setField = useCallback(
    <K extends keyof EtapaDadosComplementaresForm>(key: K, value: EtapaDadosComplementaresForm[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const setGestor = useCallback((id: string, nome: string) => {
    setForm((prev) => ({ ...prev, gestor_interno_id: id, gestor_interno_nome: nome }));
  }, []);

  const setRecrutador = useCallback((id: string, nome: string) => {
    setForm((prev) => ({ ...prev, recrutador_id: id, recrutador_nome: nome }));
  }, []);

  const addEmail = useCallback((email: string) => {
    const trimmed = email.trim();
    if (!trimmed) return;
    setForm((prev) =>
      prev.emails_adicionais.includes(trimmed)
        ? prev
        : { ...prev, emails_adicionais: [...prev.emails_adicionais, trimmed] },
    );
  }, []);

  const removeEmail = useCallback((email: string) => {
    setForm((prev) => ({
      ...prev,
      emails_adicionais: prev.emails_adicionais.filter((e) => e !== email),
    }));
  }, []);

  return {
    form,
    setField,
    setGestor,
    setRecrutador,
    addEmail,
    removeEmail,
  };
}
