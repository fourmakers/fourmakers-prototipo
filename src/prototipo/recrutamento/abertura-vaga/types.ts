export type OrigemVaga =
  | "substituicao"
  | "nova_posicao"
  | "cobertura_temporaria"
  | "reativacao";

export type MotivoSaida =
  | "demissao_voluntaria"
  | "desligamento"
  | "movimentacao_positiva"
  | "aposentadoria"
  | "desalinhamento_cultural";

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

export type ModeloTrabalho = "presencial" | "hibrido" | "remoto";

export type NivelExperiencia = "junior" | "pleno" | "senior" | "especialista";

export type TipoEmprego = "clt" | "pj" | "temporario";

export type Permanencia = "determinado" | "indeterminado";

export type PrioridadeRecrutamento = "baixa" | "media" | "alta" | "critica";

export interface EtapaPerfilForm {
  nome_perfil: string;
  modelo_trabalho: ModeloTrabalho | null;
  dias_hibridos: number;
  nivel_experiencia: NivelExperiencia | null;
  tipo_emprego: TipoEmprego | null;
  permanencia: Permanencia | null;
  hard_skills: string[];
  atribuicoes: string;
  custo_mensal: string;
}

export interface EtapaUrgenciaForm {
  prioridade: PrioridadeRecrutamento | null;
  prazo_contratacao: string;
  quantidade_posicoes: number;
  observacoes_recrutador: string;
}

export interface AberturaVagaFormCompleto {
  contexto: EtapaContextoForm;
  perfil: EtapaPerfilForm;
  urgencia: EtapaUrgenciaForm;
}
