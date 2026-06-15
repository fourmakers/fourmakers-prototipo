import type { PerfilExtraido, ValidacaoInformacoes } from "../types";

const CAMPOS_COMPLETUDE = [
  "nome_perfil",
  "custo_perfil",
  "ratecard_perfil",
  "informacoes_relevantes",
  "permanencia",
  "modelo_trabalho",
  "localidade",
  "cidade",
  "estado",
  "hibrido_dias",
  "cep",
] as const;

function campoPreenchido(perfil: PerfilExtraido, campo: (typeof CAMPOS_COMPLETUDE)[number]): boolean {
  switch (campo) {
    case "nome_perfil":
      return Boolean(perfil.nomePerfil?.trim());
    case "custo_perfil":
      return perfil.custoPerfil > 0;
    case "ratecard_perfil":
      return perfil.ratecardPerfil > 0;
    case "informacoes_relevantes":
      return Boolean(perfil.informacoesRelevantes?.trim());
    case "permanencia":
      return Boolean(perfil.permanenciaId);
    case "modelo_trabalho":
      return Boolean(perfil.modeloTrabalhoId || perfil.modeloTrabalhoDescricao);
    case "localidade":
      return Boolean(perfil.profissionalLocalidadeId);
    case "cidade":
      return Boolean(perfil.cidade?.trim());
    case "estado":
      return Boolean(perfil.estado?.trim());
    case "hibrido_dias":
      return perfil.hibridoDias > 0 || perfil.modeloTrabalhoDescricao?.toLowerCase() !== "híbrido";
    case "cep":
      return Boolean(perfil.cep?.trim());
    default:
      return false;
  }
}

export function recalcularValidacao(perfil: PerfilExtraido): ValidacaoInformacoes {
  const informacoesEncontradas = Object.fromEntries(
    CAMPOS_COMPLETUDE.map((c) => [c, campoPreenchido(perfil, c)]),
  ) as ValidacaoInformacoes["informacoesEncontradas"];

  const informacoesFaltantes = CAMPOS_COMPLETUDE.filter((c) => !informacoesEncontradas[c]);

  const preenchidos = CAMPOS_COMPLETUDE.length - informacoesFaltantes.length;
  const completudePercentual = Math.round((preenchidos / CAMPOS_COMPLETUDE.length) * 1000) / 10;

  const labels: Record<string, string> = {
    custo_perfil: "remuneração",
    ratecard_perfil: "ratecard",
    permanencia: "duração do contrato",
    localidade: "localidade",
    cidade: "cidade",
    estado: "estado",
    hibrido_dias: "dias híbridos",
    cep: "CEP",
  };

  const mensagemUsuario =
    informacoesFaltantes.length === 0
      ? "Perfil completo — pronto para publicação."
      : `Para melhorar sua vaga, inclua: ${informacoesFaltantes.map((c) => labels[c] ?? c.replace(/_/g, " ")).join(", ")}.`;

  return {
    informacoesEncontradas,
    resumoInformacoes: {
      nome_perfil: perfil.nomePerfil,
      custo_perfil: perfil.custoPerfil || null,
      ratecard_perfil: perfil.ratecardPerfil || null,
      informacoes_relevantes: perfil.informacoesRelevantes,
      permanencia: perfil.permanenciaId,
      modelo_trabalho: perfil.modeloTrabalhoDescricao,
      localidade: perfil.profissionalLocalidadeId,
      cidade: perfil.cidade,
      estado: perfil.estado,
      hibrido_dias: perfil.hibridoDias || null,
      cep: perfil.cep,
    },
    informacoesFaltantes: [...informacoesFaltantes],
    mensagemUsuario,
    completudePercentual,
  };
}
