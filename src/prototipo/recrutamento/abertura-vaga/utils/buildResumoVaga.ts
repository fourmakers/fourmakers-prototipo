import type { AberturaVagaFormCompleto, VagaResumoModel } from "../types";
import { MOTIVOS_EXIGEM_COLABORADOR } from "../types";
import {
  DESCRICAO_VAGA_MOCK,
  TIPOS_CONTRATACAO_MOCK,
  TIPOS_VAGA_MOCK,
  UNIDADES_MOCK,
} from "../mocks/dadosComplementaresCatalogos";

const LABEL_ORIGEM = {
  substituicao: "Substituição",
  nova_posicao: "Nova posição",
  cobertura_temporaria: "Cobertura temporária",
  reativacao: "Reativação",
} as const;

function lookupDescricao(
  list: readonly { id: string; descricao: string }[],
  id: string,
): string {
  return list.find((x) => x.id === id)?.descricao ?? "";
}

function formatDatePtBr(iso: string): string {
  if (!iso) return "Não informado";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

/** Monta resumo no formato do modal "Dados sobre a vaga" (kanban) — protótipo com mocks */
export function buildResumoVaga(dados: AberturaVagaFormCompleto): VagaResumoModel {
  const { contexto, dadosComplementares: d } = dados;
  const hoje = new Date().toISOString().slice(0, 10);

  const tipoVaga = lookupDescricao(TIPOS_VAGA_MOCK, d.tipo_vaga_id);
  const tipoContratacao = lookupDescricao(TIPOS_CONTRATACAO_MOCK, d.tipo_contratacao_id);
  const unidade = lookupDescricao(UNIDADES_MOCK, d.unidade_id);

  const motivoSubstituicao =
    contexto.origem_vaga === "substituicao" && contexto.motivo_saida
      ? ` · Motivo: ${contexto.motivo_saida.replace(/_/g, " ")}`
      : "";

  const observacoes =
    d.observacoes_internas.trim() ||
    (contexto.colaborador_substituido
      ? `Substituição de ${contexto.colaborador_substituido.nome} (${contexto.colaborador_substituido.cargo}).`
      : "Não informado");

  return {
    left: [
      { label: "Código", value: "692" },
      { label: "Cliente", value: unidade ? `${unidade}` : "ONESYS" },
      {
        label: "Gestor",
        value: d.gestor_interno_nome || "Não informado",
      },
      { label: "Abertura em", value: formatDatePtBr(hoje) },
      { label: "Contratação em", value: "Não informado" },
      { label: "Proposta", value: d.proposta_crm.trim() || "Não informado" },
      {
        label: "Tipo de vaga",
        value: tipoVaga || (contexto.origem_vaga ? LABEL_ORIGEM[contexto.origem_vaga] : "Não informado"),
      },
    ],
    right: [
      { label: "Tipo de contratação", value: tipoContratacao || "Não informado" },
      { label: "Custo", value: "R$ 100,00" },
      { label: "Modelo de trabalho", value: "Híbrido" },
      { label: "Unidade", value: unidade || "Não informado" },
      ...(d.maquina ? [{ label: "Máquina", value: d.maquina }] : []),
      ...(d.recrutador_nome
        ? [{ label: "Recrutador", value: d.recrutador_nome }]
        : []),
      ...(d.numero_de_vagas > 1
        ? [{ label: "Qtd. vagas", value: String(d.numero_de_vagas) }]
        : []),
    ],
    observacoesInternas: observacoes + motivoSubstituicao,
    descricao: DESCRICAO_VAGA_MOCK,
  };
}

export function tituloVagaPrototipo(dados: AberturaVagaFormCompleto): string {
  const subst = dados.contexto.colaborador_substituido;
  if (subst) return `692 — ${subst.cargo}`;
  return "692 — Analista de Recrutamento e Seleção";
}

export function subtituloMotivoContexto(dados: AberturaVagaFormCompleto): string | null {
  if (dados.contexto.origem_vaga !== "substituicao") return null;
  const { motivo_saida, colaborador_substituido } = dados.contexto;
  if (motivo_saida && MOTIVOS_EXIGEM_COLABORADOR.includes(motivo_saida) && colaborador_substituido) {
    return `O motivo da vaga é Substituição (${colaborador_substituido.nome}).`;
  }
  return "O motivo da vaga é Substituição.";
}
