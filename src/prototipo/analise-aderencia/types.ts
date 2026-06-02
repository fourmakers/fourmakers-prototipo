export type FonteCandidato = "arquivo" | "lote" | "zip" | "linkedin";

export interface VagaAnalise {
  id: string;
  codigo: string;
  titulo: string;
  cliente: string;
  desafios: string[];
  objetivos: string[];
}

export interface CriterioAderencia {
  id: string;
  nome: string;
  nota: number;
  maxNota: number;
  desafioVaga: string;
  comoCumpre: string;
  gap?: string;
  pdi?: string;
  complementoIa?: string;
}

export interface CandidatoAnalise {
  id: string;
  nome: string;
  cargoAtual: string;
  fonte: FonteCandidato;
  fonteLabel: string;
  aderenciaGeral: number;
  ranking: number;
  resumo: string;
  potencial: "alto" | "medio" | "em_desenvolvimento";
  criterios: CriterioAderencia[];
  trajetoria: { fase: string; descricao: string }[];
}

export interface PanoramaVaga {
  contextoMercado: string;
  contextoCliente: string;
  insightsTriagem: string[];
  momentoMercado: string;
}

export interface ResultadoAnaliseAderencia {
  vagaId: string;
  geradoEm: string;
  panorama: PanoramaVaga;
  candidatos: CandidatoAnalise[];
}

export type RadarAlertaSeveridade = "info" | "warning" | "error";

export interface RadarProfissional {
  candidatoId: string;
  perfil: {
    headline: string;
    skills: string[];
    localizacao: string;
    timezone: string;
    modalidades: string[];
    linkedinUrl?: string;
    verificadoPlataforma: boolean;
  };
  kpis: { label: string; valor: number; suffix?: string }[];
  scorePlataforma: number;
  rankingGlobal: number;
  rankingTotal: number;
  merits: { id: string; titulo: string; descricao: string; tipo: "medal" | "leadership" | "punctual" | "referral" }[];
  tempoMedioCasaMeses: number;
  historicoEmpresas: { empresa: string; cargo: string; meses: number }[];
  inscricoes: {
    codigo: string;
    titulo: string;
    cliente: string;
    status: string;
    score?: number;
    data: string;
  }[];
  relacoesOrg: {
    nome: string;
    cargo: string;
    grau: 1 | 2 | 3;
    fonte: string;
    contexto: string;
  }[];
  agendas: { tipo: string; titulo: string; data: string; status: string }[];
  vagasMatch: { codigo: string; titulo: string; cliente: string; match: number }[];
  avaliacoes: { dimensao: string; media: number; amostra: number }[];
  alertas: { severidade: RadarAlertaSeveridade; titulo: string; descricao: string }[];
  naoRecomendacoes: string[];
  gamificacao: {
    nivel: string;
    xp: number;
    xpProximoNivel: number;
    badges: string[];
    bloqueios: { motivo: string; detalhe?: string }[];
  };
}
