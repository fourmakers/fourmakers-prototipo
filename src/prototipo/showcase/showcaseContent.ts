import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BrainCircuit,
  ClipboardList,
  KanbanSquare,
  Library,
  Sparkles,
  Users,
} from "lucide-react";

/** Assets servidos de `public/showcase/` — respeita `base` do Vite (GitHub Pages em subpasta). */
export function showcaseAsset(path: string): string {
  return `${import.meta.env.BASE_URL}showcase/${path}`;
}

export interface ShowcaseFeature {
  /** Slug — também é o nome do ficheiro de vídeo e do poster */
  id: string;
  /** Posição na narrativa do estande */
  step: number;
  /** Etapa da jornada (chip acima do título) */
  journey: string;
  title: string;
  /** Texto auxiliar sob o título */
  summary: string;
  /** Frase grande de atenção para quem passa no estande */
  impact: string;
  /** Benefício âncora (uma linha, linguagem de negócio) */
  anchorMetric: string;
  tags: string[];
  /** O que o cliente recebe */
  delivers: string[];
  /** Benefícios esperados / ROI narrativo */
  benefits: string[];
  icon: LucideIcon;
  /** Gradiente da borda e do halo do card */
  gradient: string;
}

export const SHOWCASE_UMBRELLA =
  "Do briefing ao fill: menos tempo de ciclo, mais aderência e decisões com dados — com IA aplicada de ponta a ponta na atração e seleção.";

export const SHOWCASE_TOTEM_PHRASES = [
  "Match com evidência.",
  "Do prompt à shortlist.",
  "Funil sob medida. Decisão com dados.",
  "Menos ciclo. Mais aderência.",
  "IA que fala a língua do RH.",
  "People Analytics na operação — não só no relatório.",
];

const GRADIENT_IA = "linear-gradient(135deg, #4CBFFF 0%, #736DFF 50%, #9A1BFF 100%)";
const GRADIENT_MATCH = "linear-gradient(135deg, #9A1BFF 0%, #7D59FF 50%, #3BFE95 100%)";
const GRADIENT_OPS = "linear-gradient(135deg, #736DFF 0%, #9A1BFF 60%, #6A8CCA 100%)";
const GRADIENT_CATALOG = "linear-gradient(135deg, #6A8CCA 0%, #4CBFFF 55%, #3BFE95 100%)";
const GRADIENT_PROCESS = "linear-gradient(135deg, #9A1BFF 0%, #6A8CCA 50%, #4CBFFF 100%)";
const GRADIENT_BUILDER = "linear-gradient(135deg, #3BFE95 0%, #4CBFFF 55%, #9A1BFF 100%)";
const GRADIENT_BOARD = "linear-gradient(135deg, #4CBFFF 0%, #9A1BFF 45%, #3BFE95 100%)";

/** Ordem = fluxo de demonstração no estande (do “uau” imediato ao fechamento executivo). */
export const SHOWCASE_FEATURES: ShowcaseFeature[] = [
  {
    id: "perfil-vaga-ia",
    step: 1,
    journey: "Atração · Time-to-post",
    title: "Criação de Perfil de Atuação e Vaga com IA",
    summary:
      "Do prompt de negócio ao perfil publicado: a IA estrutura o perfil profissional, lê sinais de mercado, sugere remuneração e contexto, adequa os textos por canal e permite criar a vaga na sequência — com confirmação clara de tudo o que foi gerado.",
    impact: "Briefing em linguagem natural. Perfil e vaga prontos para atrair o talento certo.",
    anchorMetric: "Redução do time-to-post",
    tags: [
      "Perfil de Atuação",
      "Job Description com IA",
      "Análise de Mercado",
      "SEO de Vagas",
      "Canais de Publicação",
      "Employer Branding",
      "Nexus IA",
    ],
    delivers: [
      "Criação inteligente de perfil a partir de prompt e detalhes de negócio",
      "Panorama de mercado do perfil: contexto, momento e faixa de remuneração",
      "Sugestão e enriquecimento de detalhes com IA, sob revisão do recrutador",
      "Adequação SEO dos textos por canal de publicação",
      "Integração com canais — conteúdo pronto para LinkedIn e demais portais",
      "Fluxo perfil → vaga opcional, com confirmação e próximos passos",
      "Pré-visualização completa antes de gravar na gestão",
    ],
    benefits: [
      "Redução drástica do tempo entre a demanda do gestor e a publicação",
      "Padronização de qualidade entre recrutadores e áreas de negócio",
      "Descrições mais atrativas e alinhadas à realidade do mercado",
      "Menos idas e vindas entre RH, gestor solicitante e comunicação",
      "Escala da operação sem perder consistência de marca empregadora",
    ],
    icon: Sparkles,
    gradient: GRADIENT_IA,
  },
  {
    id: "candidatos-aderencia",
    step: 2,
    journey: "Seleção · Quality of hire",
    title: "Gestão de Candidatos · Match e Aderência Inteligente",
    summary:
      "Acompanhamento do candidato no funil da vaga com geração de mapa de aderência por IA, ranking de aderentes, análise de mercado e leitura de trilha profissional — para montar shortlist com critério e velocidade.",
    impact: "Menos feeling. Mais match. Shortlist com evidência.",
    anchorMetric: "Shortlist com qualidade comprovável",
    tags: [
      "Mapa de Aderência",
      "Match com IA",
      "Shortlist",
      "Ranking de Candidatos",
      "Trilha Profissional",
      "People Screening",
      "Quality of Hire",
    ],
    delivers: [
      "Acompanhamento do candidato no funil / kanban da vaga",
      "Mapa de aderência inteligente (perfil × vaga) gerado por IA",
      "Ranking de aderentes para acelerar a shortlist",
      "Análise de mercado aplicada ao contexto do perfil e da vaga",
      "Leitura de trilha profissional possível, para apoiar a decisão",
      "Detalhe em drawer com visual rico — radar de critérios e insights",
      "Pocket de ranking e ações no próprio fluxo operacional",
    ],
    benefits: [
      "Redução do tempo de triagem e screening",
      "Melhora da qualidade do match — aderência técnica e de contexto",
      "Menos viés subjetivo na pré-seleção",
      "Argumentação clara e auditável para o gestor solicitante",
      "Menor taxa de falso positivo chegando à entrevista",
    ],
    icon: BrainCircuit,
    gradient: GRADIENT_MATCH,
  },
  {
    id: "gestao-vagas",
    step: 3,
    journey: "Operação · Previsibilidade de fill",
    title: "Gestão Inteligente de Vagas",
    summary:
      "Operação completa das vagas em lista e kanban: status, priorização, acompanhamento do funil por posição e ações rápidas — do rascunho ao preenchimento, com visão clara para todo o time de recrutamento.",
    impact: "Cada vaga sob controle: status, prioridade e progresso no mesmo olhar.",
    anchorMetric: "Previsibilidade de preenchimento",
    tags: [
      "Kanban de Vagas",
      "Pipeline de Recrutamento",
      "Priorização",
      "Fill Rate",
      "Operação de TA",
      "Visibilidade de Status",
    ],
    delivers: [
      "Visão em lista e em kanban das vagas da organização",
      "Acompanhamento por status e ordenação operacional",
      "Ações rápidas — duplicar, notificar e avançar etapas",
      "Integração com perfis, candidatos e banco de talentos",
      "Continuidade direta com a criação assistida por IA",
    ],
    benefits: [
      "Maior previsibilidade de preenchimento das posições",
      "Priorização alinhada à demanda de negócio e à capacidade do time",
      "Menos perdas de follow-up e vagas esquecidas no meio do funil",
      "Operação mais enxuta, com menos suporte ad hoc",
    ],
    icon: KanbanSquare,
    gradient: GRADIENT_OPS,
  },
  {
    id: "gestao-perfis",
    step: 4,
    journey: "Governança · Reuso",
    title: "Gestão de Perfis de Atuação",
    summary:
      "Biblioteca viva dos perfis criados pela organização: consulta, reuso, origem das vagas e rastreabilidade do que foi gerado com apoio de IA — a base para abrir novas posições com agilidade.",
    impact: "Seu catálogo de perfis vira ativo estratégico de atração.",
    anchorMetric: "Reuso e padronização de requisitos",
    tags: [
      "Catálogo de Perfis",
      "Reuso de Perfil",
      "Padronização",
      "Governança de Vagas",
      "Talent Acquisition",
      "Perfil × Vaga",
    ],
    delivers: [
      "Lista e detalhe de todos os perfis da organização",
      "Reuso do perfil para novas vagas, sem reescrever do zero",
      "Rastreio dos perfis que originaram vagas e o status de cada uma",
      "Continuidade com a jornada de criação inteligente",
    ],
    benefits: [
      "Menos retrabalho na abertura de posições recorrentes",
      "Padronização de requisitos entre unidades e clientes",
      "Aceleração do kick-off de novas demandas",
      "Base consolidada para auditoria e governança de TA",
    ],
    icon: Library,
    gradient: GRADIENT_CATALOG,
  },
  {
    id: "entrevistas",
    step: 5,
    journey: "Avaliação · Equidade",
    title: "Builder e Parametrização de Entrevistas",
    summary:
      "Estruture roteiros de entrevista alinhados ao perfil e à etapa do funil: perguntas, critérios e experiência consistente entre recrutadores — com parametrização reutilizável por toda a organização.",
    impact: "Entrevista padronizada. Avaliação comparável. Decisão mais justa.",
    anchorMetric: "Avaliação estruturada e justa",
    tags: [
      "Roteiro de Entrevista",
      "Avaliação Estruturada",
      "Competências",
      "Consistência de Processo",
      "Candidate Experience",
      "Entrevista por Competências",
    ],
    delivers: [
      "Parametrização de entrevistas por contexto de recrutamento",
      "Builder de roteiros alinhado às etapas do funil",
      "Padronização entre times, unidades e clientes",
      "Base para avaliação objetiva e auditável",
    ],
    benefits: [
      "Consistência na experiência do candidato",
      "Comparabilidade entre avaliações de diferentes entrevistadores",
      "Redução de ruído e retrabalho no feedback pós-entrevista",
      "Fortalecimento de compliance e equidade no processo seletivo",
      "Menor dependência do conhecimento tácito do recrutador",
    ],
    icon: ClipboardList,
    gradient: GRADIENT_PROCESS,
  },
  {
    id: "kanban-builder",
    step: 6,
    journey: "Processo · Adaptabilidade",
    title: "Kanban Builder · Funil sob Medida",
    summary:
      "Monte e personalize o fluxo do kanban da operação de recrutamento: colunas, regras, notificações e dados do card alinhados ao processo da sua empresa — sem engessar o time em um funil genérico.",
    impact: "Seu processo. Seu funil. Configurado em minutos.",
    anchorMetric: "Processo adaptável sem customização de TI",
    tags: [
      "Kanban Builder",
      "Workflow de Recrutamento",
      "Customização de Funil",
      "Operação Adaptável",
      "Governança de Processo",
      "Low-code RH",
    ],
    delivers: [
      "Builder visual do kanban de recrutamento",
      "Configuração de etapas, regras e dados apresentados no card",
      "Notificações e coleta de dados por movimentação de coluna",
      "Alinhamento entre gestão de vagas/candidatos e o fluxo parametrizado",
    ],
    benefits: [
      "Adoção rápida por times com processos distintos",
      "Menos customizações de TI para mudanças de fluxo",
      "Governança do processo com autonomia do RH",
      "Escalabilidade multiunidade e multicliente",
      "Continuidade operacional com menos fricção de mudança",
    ],
    icon: KanbanSquare,
    gradient: GRADIENT_BUILDER,
  },
  {
    id: "painel-executivo",
    step: 7,
    journey: "Liderança · People Analytics",
    title: "Painel Executivo de Atração e Seleção",
    summary:
      "Visão consolidada de demanda, funil, desempenho do time, qualidade e projeção — a partir da planilha operacional ou de dados estruturados, com leitura executiva assistida por IA.",
    impact: "Do relatório ao board: KPIs de recrutamento que a liderança entende em segundos.",
    anchorMetric: "Decisão de liderança com People Analytics",
    tags: [
      "People Analytics",
      "Painel Executivo",
      "Funil de Seleção",
      "SLA de Recrutamento",
      "Insights com IA",
      "Time-to-Hire",
      "Fill Rate",
    ],
    delivers: [
      "Dashboard executivo com Resumo, Demanda, Funil, Time, Qualidade e Projeção",
      "Upload de planilha ou CSV com estruturação automática dos indicadores",
      "Cards de KPI com status, meta, variação e detalhe em drawer",
      "Gráficos e gauges de tendência, distribuição e gargalos do funil",
      "Insights IA (Nexus) com leitura acionável do período",
      "Projeção do próximo trimestre com indicadores e metas",
      "Personalização de ordem e aparência dos cards por usuário",
    ],
    benefits: [
      "Redução do tempo de preparação de reportes para comitês e diretoria",
      "Visibilidade única dos gargalos de SLA e das etapas críticas do funil",
      "Decisões de capacity e priorização de vagas baseadas em evidência",
      "Menos planilhas manuais e menos retrabalho de consolidação",
      "Narrativa executiva pronta para stakeholders de negócio e People",
    ],
    icon: BarChart3,
    gradient: GRADIENT_BOARD,
  },
];

/** Bloco transversal de fechamento — plataforma, método e know-how. */
export const SHOWCASE_PLATFORM = {
  title: "Tecnologia com Know-how de Recrutamento",
  summary:
    "IA aplicada com método: skills especializadas em mercado, detalhes de perfil, canais, aderência e insights de painel; experiência de produto desenhada para o dia a dia de Talent Acquisition; e governança alinhada à operação de RH.",
  impact: "Modernidade com resultado: processo, dado e decisão no mesmo lugar.",
  tags: [
    "IA Generativa aplicada",
    "Nexus",
    "People Tech",
    "Talent Acquisition",
    "Eficiência Operacional",
    "Experiência do Recrutador",
    "Digitalização de RH",
  ],
  delivers: [
    "IA contextualizada ao domínio de atração e seleção — não genérica",
    "Jornada ponta a ponta: perfil → vaga → candidato → entrevista → painel",
    "Experiência moderna: drawers, kanbans, personalização e insights",
    "Plataforma em evolução contínua, com roadmap orientado ao cliente",
  ],
  benefits: [
    "Posicionamento de modernidade e inovação perante o mercado",
    "Eficiência operacional mensurável em tempo, qualidade e previsibilidade",
    "Redução de suporte e de processos manuais paralelos",
    "Melhores resultados de fill com menor custo de ciclo",
    "Confiança de que a tecnologia fala a língua do RH",
  ],
  icon: Users,
} as const;
