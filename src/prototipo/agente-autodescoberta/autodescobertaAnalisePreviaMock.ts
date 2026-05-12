/** Mock alinhado ao contrato `AnaliseIaDto` (PERFIL_DE_ATUACAO — passo 2). */

export type ConfiancaIa = "high" | "medium" | "low";

export type CategoriaSegmento = "decision" | "routine" | "deliverable" | "communication";

export interface SegmentoTextoMock {
  texto: string;
  categoria: CategoriaSegmento;
}

export interface ItemDetectadoMock {
  id: string;
  texto: string;
  categoria: CategoriaSegmento;
}

export interface ComposicaoMock {
  humano: number;
  agentes: number;
  hibrido: number;
}

export interface AgenteCatalogoMock {
  id: string;
  nome: string;
  categoria: string;
  descricao: string;
  status: "available" | "pilot" | "unavailable";
}

export const MOCK_ANALISE_PREVIA = {
  confianca: "high" as ConfiancaIa,
  segmentos: [
    { texto: "Facilitação de workshops e priorização de backlog", categoria: "deliverable" as const },
    { texto: ", alinhamento com stakeholders e documentação funcional", categoria: "communication" as const },
    { texto: ", e decisões de escopo em conjunto com o time.", categoria: "decision" as const },
  ] satisfies SegmentoTextoMock[],
  decisoes: [
    { id: "d1", texto: "Priorizar iniciativas com base em valor e risco", categoria: "decision" as const },
    { id: "d2", texto: "Negociar escopo com áreas de negócio", categoria: "decision" as const },
  ] satisfies ItemDetectadoMock[],
  rotinas: [
    { id: "r1", texto: "Refinamento de histórias e critérios de aceite", categoria: "routine" as const },
    { id: "r2", texto: "Acompanhamento de métricas de produto", categoria: "routine" as const },
  ] satisfies ItemDetectadoMock[],
  entregaveis: [
    { id: "e1", texto: "Roadmap trimestral e visão de produto", categoria: "deliverable" as const },
    { id: "e2", texto: "Especificações e fluxos para o time técnico", categoria: "deliverable" as const },
  ] satisfies ItemDetectadoMock[],
  composicaoSugerida: { humano: 58, agentes: 27, hibrido: 15 } satisfies ComposicaoMock,
};

export const MOCK_AGENTES_CATALOGO: AgenteCatalogoMock[] = [
  {
    id: "ag1",
    nome: "Claude — síntese e refinamento",
    categoria: "Documentação",
    descricao: "Transforma notas em histórias, critérios de aceite e resumos de discovery.",
    status: "available",
  },
  {
    id: "ag2",
    nome: "GPT Codex — apoio a código",
    categoria: "Engenharia",
    descricao: "Gera boilerplate, testes iniciais e refactors guiados em TypeScript/React.",
    status: "available",
  },
  {
    id: "ag3",
    nome: "Agente Figma + LLM",
    categoria: "Design",
    descricao: "Variações de layout e consistência com design system a partir de briefings.",
    status: "pilot",
  },
  {
    id: "ag4",
    nome: "Transcrição e atas (indisponível)",
    categoria: "Operações",
    descricao: "Resumo de reuniões — catálogo em manutenção para o seu cliente (mock).",
    status: "unavailable",
  },
];
