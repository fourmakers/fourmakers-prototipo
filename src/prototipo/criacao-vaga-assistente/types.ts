export type ModoEntradaVaga = "formulario" | "prompt";

export interface EntradaFormularioVaga {
  cliente: string;
  gestor: string;
  tituloVaga: string;
  modeloTrabalho: string;
  contextoBreve: string;
}

/** Contrato API — referências aninhadas */
export interface ItemPerfilRef {
  descricao: string;
  id: number;
}

export interface SkillRef {
  descricao: string;
  id: number;
}

export interface NivelRef {
  descricao: string;
  id: number;
}

export interface GestorExternoPerfilSkill {
  itemPerfil: ItemPerfilRef;
  skill: SkillRef;
  nivel: NivelRef;
  relevante: boolean;
}

/** Contrato API — perfil_extraido */
export interface PerfilExtraido {
  codGestorExterno: string | null;
  nomePerfil: string;
  custoPerfil: number;
  ratecardPerfil: number;
  informacoesRelevantes: string;
  permanenciaId: string | null;
  modeloTrabalhoId: string | null;
  modeloTrabalhoDescricao: string | null;
  profissionalLocalidadeId: string | null;
  cidade: string | null;
  estado: string | null;
  hibridoDias: number;
  cep: string | null;
  origem: string | null;
  gestorExternoPerfilSkills: GestorExternoPerfilSkill[];
}

export interface ValidacaoInformacoes {
  informacoesEncontradas: Record<string, boolean>;
  resumoInformacoes: Record<string, string | number | null>;
  informacoesFaltantes: string[];
  mensagemUsuario: string;
  completudePercentual: number;
}

export interface MetadadosConsulta {
  tempoProcessamento: number;
  numeroTokens: number;
  modeloUsado: string;
  provedor: string;
}

/** Resposta POST criar perfil/vaga com prompt — contrato alvo de integração */
export interface CriarPerfilVagaApiResponse {
  perfilExtraido: PerfilExtraido;
  skillsPropostas: { gestorExternoPerfilSkills: GestorExternoPerfilSkill[] };
  validacaoInformacoes: ValidacaoInformacoes;
  metadadosConsulta: MetadadosConsulta;
}

export interface CriterioMatchVaga {
  id: string;
  nome: string;
  peso: number;
  desafioVaga: string;
  evidenciaEsperada: string;
}

export interface SkillSugerida {
  nome: string;
  tipo: "hard" | "soft" | "competencia" | "softskill" | "dominio" | "metodologia" | "idioma";
  relevante: boolean;
  nivel: string;
  origem: "extraida" | "proposta";
}

export interface PreviewMercadoVaga {
  mediaAderenciaPrevista: number;
  talentosBancoAcima80: number;
  talentosQualificadosSimilares: number;
  vagasSimilaresReferencia: string;
}

export interface VagaOtimizadaResultado {
  /** Resposta bruta no formato da API — base para integração */
  api: CriarPerfilVagaApiResponse;
  /** Prompt original (modo prompt) — usado no preview para refinamento */
  promptOriginal?: string;
  tituloSugerido: string;
  scoreQualidade: number;
  previewMercado: PreviewMercadoVaga;
  contextoCliente: string;
  contextoGestor: string;
  momentoMercado: string;
  desafios: string[];
  objetivos: string[];
  insightsTriagem: string[];
  antiChurn: string[];
  hierarquiaMatch: { label: string; peso: number; descricao: string }[];
  criteriosAderencia: CriterioMatchVaga[];
  skillsSugeridas: SkillSugerida[];
  textoDesafioConsolidado: string;
  pdiOrganizacional?: string;
}
