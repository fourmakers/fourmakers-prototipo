export type OrigemVaga =
  | "substituicao"
  | "nova_posicao"
  | "cobertura_temporaria"
  | "reativacao";

export type MotivoSaida =
  | "demissao_voluntaria"
  | "desligamento"
  | "movimentacao_positiva"
  | "aposentadoria";

export interface ColaboradorRef {
  id: string;
  nome: string;
  cargo: string;
  area: string;
  data_admissao: string;
}

export interface EtapaContextoForm {
  origem_vaga: OrigemVaga | null;
  motivo_saida: MotivoSaida | null;
  colaborador_substituido: ColaboradorRef | null;
}

export const MOTIVOS_EXIGEM_COLABORADOR: MotivoSaida[] = [
  "demissao_voluntaria",
  "desligamento",
];

/** Paridade com InserirInformacoesComplementares (MovimentacaoVagaModal — fourmakers-v2) */
export interface EtapaDadosComplementaresForm {
  gestor_interno_id: string;
  gestor_interno_nome: string;
  proposta_crm: string;
  tipo_vaga_id: string;
  tipo_contratacao_id: string;
  unidade_id: string;
  maquina: string;
  numero_de_vagas: number;
  recrutador_id: string;
  recrutador_nome: string;
  emails_adicionais: string[];
  observacoes_internas: string;
}

export interface VagaResumoItem {
  label: string;
  value: string;
}

export interface VagaResumoModel {
  left: VagaResumoItem[];
  right: VagaResumoItem[];
  observacoesInternas: string;
  descricao: string;
}

export interface AberturaVagaFormCompleto {
  contexto: EtapaContextoForm;
  dadosComplementares: EtapaDadosComplementaresForm;
}
