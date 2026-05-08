/** Contratos alinhados a `docs/DASHBOARD_COMERCIAL_DOCUMENTACAO_TECNICA.md` (protótipo, mocks locais). */

export type NivelStakeholder =
  | "cLevel"
  | "decisor"
  | "influenciador"
  | "operacional"
  | "semClassificacao";

export interface KpiContagem {
  quantidade: number;
  percentual: number;
}

export interface KpiOrcamento {
  valorMapeadoReais: number;
  percentualCobertura: number;
}

export interface SemaforoResumo {
  ate30Dias: number;
  de31a60Dias: number;
  de61a90Dias: number;
  acima90Dias: number;
}

export interface QualidadeBaseResumo {
  totalStakeholders: number;
  totalClientes: number;
  semOrcamento2026: KpiContagem;
  semDesafio2026: KpiContagem;
  cLevelDecisorSemVisita60Dias: { quantidade: number };
  orcamentoTotal2026: KpiOrcamento;
  semaforo: SemaforoResumo;
}

export interface NivelBreakdownDto {
  cLevel: number;
  decisor: number;
  influenciador: number;
  operacional: number;
  semClassificacao: number;
}

export interface StakeholderPorClienteDto {
  clienteId: number;
  nomeCliente: string;
  totalStakeholders: number;
  porNivel: NivelBreakdownDto;
  orcamentoMapeadoReais: number;
  percentualCobertura: number;
  stakeholdersComOrcamento: number;
  semDesafio: number;
  percentualSemDesafio: number;
}

export interface StakeholderDetalheDto {
  id: number;
  nomeColaborador: string;
  codigoInternoColaborador: string;
  empresa: string;
  cargo: string;
  nivel: NivelStakeholder;
  diasSemVisita: number | null;
  orcamento2026: number | null;
  desafio2026: string | null;
  dataCriacao: string;
}

export type KpiPainelId = "total" | "orc" | "visita" | "budget" | "desafio";

export type SemaforoPainelId = "green" | "yellow" | "red" | "critical";
