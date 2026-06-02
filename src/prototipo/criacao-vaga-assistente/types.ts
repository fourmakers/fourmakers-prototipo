export type ModoEntradaVaga = "formulario" | "prompt";

export interface EntradaFormularioVaga {
  cliente: string;
  gestor: string;
  tituloVaga: string;
  modeloTrabalho: string;
  contextoBreve: string;
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
  tipo: "hard" | "soft";
  relevante: boolean;
  nivel: string;
}

export interface PreviewMercadoVaga {
  mediaAderenciaPrevista: number;
  talentosBancoAcima80: number;
  talentosQualificadosSimilares: number;
  vagasSimilaresReferencia: string;
}

export interface VagaOtimizadaResultado {
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
