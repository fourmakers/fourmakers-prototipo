import { useCallback, useMemo, useState } from "react";
import type { EtapaPerfilForm, ModeloTrabalho, NivelExperiencia, Permanencia, TipoEmprego } from "../types";

const INITIAL: EtapaPerfilForm = {
  nome_perfil: "",
  modelo_trabalho: null,
  dias_hibridos: 3,
  nivel_experiencia: null,
  tipo_emprego: null,
  permanencia: null,
  hard_skills: [],
  atribuicoes: "",
  custo_mensal: "",
};

export type UseEtapaPerfilFormReturn = ReturnType<typeof useEtapaPerfilForm>;

export function useEtapaPerfilForm() {
  const [form, setForm] = useState<EtapaPerfilForm>(INITIAL);

  const setField = useCallback(<K extends keyof EtapaPerfilForm>(key: K, value: EtapaPerfilForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleSkill = useCallback((skill: string) => {
    setForm((prev) => {
      const has = prev.hard_skills.includes(skill);
      return {
        ...prev,
        hard_skills: has
          ? prev.hard_skills.filter((s) => s !== skill)
          : [...prev.hard_skills, skill],
      };
    });
  }, []);

  const handleModeloChange = useCallback((modelo: ModeloTrabalho) => {
    setForm((prev) => ({ ...prev, modelo_trabalho: modelo }));
  }, []);

  const podeAvancar = useMemo(() => {
    const skillsOk = form.hard_skills.length >= 1;
    const hibridoOk = form.modelo_trabalho !== "hibrido" || (form.dias_hibridos >= 1 && form.dias_hibridos <= 4);
    return (
      form.nome_perfil.trim().length >= 3 &&
      form.modelo_trabalho !== null &&
      form.nivel_experiencia !== null &&
      form.tipo_emprego !== null &&
      form.permanencia !== null &&
      form.atribuicoes.trim().length >= 20 &&
      skillsOk &&
      hibridoOk
    );
  }, [form]);

  return {
    form,
    setField,
    toggleSkill,
    handleModeloChange,
    podeAvancar,
    setNivel: (v: NivelExperiencia) => setField("nivel_experiencia", v),
    setTipoEmprego: (v: TipoEmprego) => setField("tipo_emprego", v),
    setPermanencia: (v: Permanencia) => setField("permanencia", v),
  };
}
