// ============================================================
// Campaign Module — Types & Mock Data
// ============================================================

export type CampaignStatus = 'rascunho' | 'nova' | 'ativa' | 'concluida' | 'cancelada' | 'arquivada';
export type CampaignFormat = 'perguntas-aleatorias' | 'itens-demograficos';

export type QuestionType =
  | 'unica-escolha' | 'multipla-escolha' | 'texto-curto' | 'texto-longo' | 'numerica' | 'data' | 'upload'
  | 'resposta-curta' | 'paragrafo' | 'caixa-selecao' | 'lista-suspensa' | 'upload-arquivo'
  | 'escala-linear' | 'classificacao' | 'grade-multipla' | 'grade-caixa' | 'horario';

export interface CampaignQuestion {
  id: string;
  text: string;
  type: QuestionType;
  required: boolean;
  options?: string[]; // for unica-escolha / multipla-escolha
}

export type CampaignType =
  | 'atualizacao-cadastral'
  | 'censo-demografico'
  | 'pesquisa-estrategica'
  | 'mapeamento-tecnico'
  | 'diversidade-inclusao'
  | 'data-comemorativa';

export const CAMPAIGN_TYPE_OPTIONS: { value: CampaignType; label: string }[] = [
  { value: 'atualizacao-cadastral', label: 'Atualização cadastral' },
  { value: 'censo-demografico', label: 'Censo demográfico' },
  { value: 'pesquisa-estrategica', label: 'Pesquisa estratégica' },
  { value: 'mapeamento-tecnico', label: 'Mapeamento técnico' },
  { value: 'diversidade-inclusao', label: 'Diversidade & Inclusão' },
  { value: 'data-comemorativa', label: 'Data Comemorativa' },
];

export type RecurrenceType = 'none' | 'mensal' | 'trimestral' | 'semestral' | 'anual';

export const RECURRENCE_OPTIONS: { value: RecurrenceType; label: string }[] = [
  { value: 'none', label: 'Não recorrente' },
  { value: 'mensal', label: 'Mensal' },
  { value: 'trimestral', label: 'Trimestral' },
  { value: 'semestral', label: 'Semestral' },
  { value: 'anual', label: 'Anual' },
];

export interface Campaign {
  id: string;
  title: string;
  description: string;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  publicoAlvo: string;
  solicitante: string;
  solicitanteCargo?: string;
  solicitanteUnidade?: string;
  area: string;
  tipoCampanha: CampaignType | string;
  formato: CampaignFormat;
  localDistribuicao: string[];
  questions: CampaignQuestion[];
  itensDemograficos: string[];
  createdAt: string;
  criadoPor: string;
  ativadoPor?: string;
  dataAtivacao?: string;
  previousStatus?: CampaignStatus; // status before archiving (concluida | cancelada)
  // Recurrence
  recurrence?: RecurrenceType;
  // Reminders
  reminderDays?: number[];
  // Results
  totalImpactados: number;
  totalRespostas: number;
  respondentes: CampaignRespondent[];
  // Stepper progress
  stepsCompleted?: number[];
}

export interface CampaignRespondent {
  nome: string;
  area: string;
  localTrabalho: string;
  cargo?: string;
  genero?: string;
  modalidade?: string;
  tempoEmpresa?: string;
  senioridade?: string;
  dataResposta: string;
}

export const STATUS_CONFIG: Record<CampaignStatus, { label: string; color: string; bg: string }> = {
  rascunho: { label: 'Rascunho', color: 'text-muted-foreground', bg: 'bg-muted/30' },
  nova: { label: 'Nova', color: 'text-info', bg: 'bg-info/10' },
  ativa: { label: 'Ativa', color: 'text-success', bg: 'bg-success/10' },
  concluida: { label: 'Concluída', color: 'text-primary', bg: 'bg-primary/10' },
  cancelada: { label: 'Cancelada', color: 'text-destructive', bg: 'bg-destructive/10' },
  arquivada: { label: 'Arquivada', color: 'text-muted-foreground', bg: 'bg-muted/20' },
};

export const KANBAN_COLUMNS: { status: CampaignStatus; label: string }[] = [
  { status: 'rascunho', label: 'Rascunhos' },
  { status: 'nova', label: 'Novas' },
  { status: 'ativa', label: 'Ativas' },
  { status: 'concluida', label: 'Concluídas' },
  { status: 'cancelada', label: 'Canceladas' },
  { status: 'arquivada', label: 'Arquivadas' },
];

export const LOCAL_DISTRIBUICAO_OPTIONS = [
  { value: 'email', label: 'E-mail' },
  { value: 'teams', label: 'Teams' },
  { value: 'windows', label: 'Janela Windows' },
  { value: 'comunicacao', label: 'Módulo Comunicação' },
  { value: 'fourmakers', label: 'Fourmakers' },
];

export const ITENS_DEMOGRAFICOS_OPTIONS = [
  'Idade', 'Tempo de Casa', 'Gênero', 'Cor ou Etnia', 'Orientação Sexual', 'PCD',
  'Visto', 'Cidadania',
  'Escolaridade', 'Formações', 'Certificações',
  'Hardskills', 'Softskills', 'Metodologias', 'Idiomas',
  'Local de Trabalho', 'Cargos', 'Clientes', 'Modalidade de trabalho',
  'Estado', 'Cidade',
];

export const ITENS_DEMOGRAFICOS_GROUPS = [
  { title: 'Dados Pessoais', items: ['Idade', 'Tempo de Casa', 'Gênero', 'Cor ou Etnia', 'Orientação Sexual', 'PCD'] },
  { title: 'Documentação', items: ['Visto', 'Cidadania'] },
  { title: 'Formação', items: ['Escolaridade', 'Formações', 'Certificações'] },
  { title: 'Competências', items: ['Hardskills', 'Softskills', 'Metodologias', 'Idiomas'] },
  { title: 'Empresa', items: ['Local de Trabalho', 'Cargos', 'Clientes', 'Modalidade de trabalho'] },
  { title: 'Localização', items: ['Estado', 'Cidade'] },
];

export const DEMOGRAPHIC_RESPONSE_OPTIONS: Record<string, string[]> = {
  'Idade': ['Sem resposta', '25 anos ou mais', 'De 25 até 35 anos', 'De 35 até 45 anos', 'De 45 até 55 anos'],
  'Tempo de Casa': ['Até 1 ano', 'De 1 a 2 anos', 'De 2 a 5 anos', 'De 5 a 10 anos', 'De 10 a 15 anos', 'De 15 a 20 anos', 'De 20 a 25 anos'],
  'Gênero': ['Sem resposta', 'Homem Cisgênero', 'Mulher Cisgênero', 'Transgênero', 'Não Binária'],
  'Cor ou Etnia': ['Sem resposta', 'Amarela', 'Preta', 'Parda', 'Branca'],
  'Visto': ['Sem resposta', 'África do Sul', 'Andorra', 'Estados Unidos'],
};

export const AREA_OPTIONS = ['Tecnologia', 'RH', 'Financeiro', 'Comercial', 'Operações'];
export const PUBLICO_ALVO_OPTIONS = ['Todos os Colaboradores', 'Gestores', 'Estagiários', 'CLT', 'PJ'];
export const TIPO_CAMPANHA_OPTIONS = ['Pesquisa', 'Atualização Cadastral', 'Censo', 'Compliance'];
export const SOLICITANTE_OPTIONS = ['RH Corporativo', 'Diretoria', 'Gestão de Pessoas', 'Compliance'];

// Mock solicitantes for autocomplete
export const MOCK_SOLICITANTES = [
  { nome: 'Ana Paula Oliveira', cargo: 'Gerente de RH', unidade: 'UNI I - Alphaville SP' },
  { nome: 'Carlos Eduardo Santos', cargo: 'Diretor de Pessoas', unidade: 'UNI II - Paulista SP' },
  { nome: 'Mariana Costa Silva', cargo: 'Coordenadora de D&I', unidade: 'Curitiba PR' },
  { nome: 'Roberto Almeida Jr.', cargo: 'Analista de Compliance', unidade: 'Rio de Janeiro RJ' },
  { nome: 'Juliana Pereira Lima', cargo: 'Head de People Analytics', unidade: 'UNI I - Alphaville SP' },
  { nome: 'Fernando Barbosa', cargo: 'Gerente de Operações', unidade: 'Florida USA' },
  { nome: 'Patricia Rocha Mendes', cargo: 'Diretora de Gestão', unidade: 'Lisboa EU' },
  { nome: 'Lucas Martins Ferreira', cargo: 'Especialista de RH', unidade: 'UNI II - Paulista SP' },
];

// Mock audience data with area and tempo fields
export const MOCK_AUDIENCE = [
  { nome: 'Ana Souza', localTrabalho: 'UNI I - Alphaville SP', cargo: 'Desenvolvedora Backend', genero: 'Mulher Cisgênero', modalidade: 'Remoto', area: 'Tecnologia', tempoEmpresa: 'De 2 a 5 anos' },
  { nome: 'Carlos Lima', localTrabalho: 'UNI II - Paulista SP', cargo: 'Tech Lead', genero: 'Homem Cisgênero', modalidade: 'Híbrido', area: 'Tecnologia', tempoEmpresa: 'De 5 a 10 anos' },
  { nome: 'Fernanda Rocha', localTrabalho: 'Curitiba PR', cargo: 'UX Designer', genero: 'Mulher Cisgênero', modalidade: 'Presencial', area: 'Produto', tempoEmpresa: 'Até 1 ano' },
  { nome: 'Ricardo Alves', localTrabalho: 'Rio de Janeiro RJ', cargo: 'DevOps Engineer', genero: 'Homem Cisgênero', modalidade: 'Remoto', area: 'Tecnologia', tempoEmpresa: 'De 1 a 2 anos' },
  { nome: 'Juliana Costa', localTrabalho: 'UNI I - Alphaville SP', cargo: 'Product Manager', genero: 'Mulher Cisgênero', modalidade: 'Híbrido', area: 'Produto', tempoEmpresa: 'De 2 a 5 anos' },
  { nome: 'Marcos Pereira', localTrabalho: 'Florida USA', cargo: 'Desenvolvedor Frontend', genero: 'Homem Cisgênero', modalidade: 'Remoto', area: 'Tecnologia', tempoEmpresa: 'De 5 a 10 anos' },
  { nome: 'Patrícia Nunes', localTrabalho: 'Lisboa EU', cargo: 'QA Engineer', genero: 'Mulher Cisgênero', modalidade: 'Presencial', area: 'Operações', tempoEmpresa: 'Até 1 ano' },
  { nome: 'Felipe Santos', localTrabalho: 'UNI I - Alphaville SP', cargo: 'Desenvolvedor Backend', genero: 'Homem Cisgênero', modalidade: 'Híbrido', area: 'Tecnologia', tempoEmpresa: 'De 2 a 5 anos' },
];

// ── Question Library ──────────────────────────────────────
export type QuestionCategory = 'diversidade' | 'clima' | 'competencias' | 'cultura' | 'engajamento';

export const QUESTION_CATEGORIES: { value: QuestionCategory; label: string }[] = [
  { value: 'diversidade', label: 'Diversidade' },
  { value: 'clima', label: 'Clima organizacional' },
  { value: 'competencias', label: 'Competências técnicas' },
  { value: 'cultura', label: 'Cultura organizacional' },
  { value: 'engajamento', label: 'Engajamento' },
];

export interface LibraryQuestion {
  id: string;
  text: string;
  type: QuestionType;
  category: QuestionCategory;
  options?: string[];
}

export const QUESTION_LIBRARY: LibraryQuestion[] = [
  // Diversidade
  { id: 'lib-1', text: 'Como você se identifica em termos de gênero?', type: 'unica-escolha', category: 'diversidade', options: ['Homem Cisgênero', 'Mulher Cisgênero', 'Transgênero', 'Não Binário', 'Prefiro não responder'] },
  { id: 'lib-2', text: 'Qual sua cor ou etnia?', type: 'unica-escolha', category: 'diversidade', options: ['Branca', 'Preta', 'Parda', 'Amarela', 'Indígena', 'Prefiro não responder'] },
  { id: 'lib-3', text: 'Você é pessoa com deficiência (PcD)?', type: 'unica-escolha', category: 'diversidade', options: ['Sim', 'Não', 'Prefiro não responder'] },
  { id: 'lib-4', text: 'Você sente que a empresa promove um ambiente inclusivo?', type: 'unica-escolha', category: 'diversidade', options: ['Totalmente', 'Parcialmente', 'Não', 'Não sei opinar'] },
  // Clima
  { id: 'lib-5', text: 'Como você avalia o ambiente de trabalho?', type: 'unica-escolha', category: 'clima', options: ['Excelente', 'Bom', 'Regular', 'Ruim', 'Péssimo'] },
  { id: 'lib-6', text: 'Você se sente valorizado(a) na empresa?', type: 'unica-escolha', category: 'clima', options: ['Sim, totalmente', 'Sim, parcialmente', 'Não'] },
  { id: 'lib-7', text: 'Como é seu relacionamento com seu gestor direto?', type: 'unica-escolha', category: 'clima', options: ['Ótimo', 'Bom', 'Regular', 'Ruim'] },
  { id: 'lib-8', text: 'O que poderia melhorar no ambiente de trabalho?', type: 'texto-longo', category: 'clima' },
  // Competências
  { id: 'lib-9', text: 'Quais linguagens de programação você domina?', type: 'multipla-escolha', category: 'competencias', options: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'Go', 'Rust', 'Ruby'] },
  { id: 'lib-10', text: 'Qual seu nível de proficiência em cloud?', type: 'unica-escolha', category: 'competencias', options: ['Iniciante', 'Intermediário', 'Avançado', 'Especialista'] },
  { id: 'lib-11', text: 'Possui certificações técnicas ativas?', type: 'unica-escolha', category: 'competencias', options: ['Sim', 'Não'] },
  { id: 'lib-12', text: 'Quais ferramentas de design você utiliza?', type: 'multipla-escolha', category: 'competencias', options: ['Figma', 'Adobe XD', 'Sketch', 'InVision', 'Canva'] },
  // Cultura
  { id: 'lib-13', text: 'Os valores da empresa estão alinhados com os seus?', type: 'unica-escolha', category: 'cultura', options: ['Totalmente', 'Parcialmente', 'Não', 'Não conheço os valores'] },
  { id: 'lib-14', text: 'Você se sente parte de um propósito maior?', type: 'unica-escolha', category: 'cultura', options: ['Sim', 'Parcialmente', 'Não'] },
  { id: 'lib-15', text: 'Como você descreveria a cultura da empresa em uma frase?', type: 'texto-curto', category: 'cultura' },
  // Engajamento
  { id: 'lib-16', text: 'Você recomendaria a empresa como um bom lugar para trabalhar?', type: 'unica-escolha', category: 'engajamento', options: ['Sim, com certeza', 'Talvez', 'Não'] },
  { id: 'lib-17', text: 'Qual seu nível de motivação atual (1-10)?', type: 'numerica', category: 'engajamento' },
  { id: 'lib-18', text: 'O que mais te motiva a trabalhar aqui?', type: 'texto-longo', category: 'engajamento' },
  { id: 'lib-19', text: 'Você pretende continuar na empresa nos próximos 12 meses?', type: 'unica-escolha', category: 'engajamento', options: ['Sim', 'Provavelmente sim', 'Incerto', 'Provavelmente não', 'Não'] },
];

// ── Smart filter suggestions by campaign type ──────────────
export const SMART_FILTER_SUGGESTIONS: Record<string, { label: string; filters: string[] }> = {
  'diversidade-inclusao': {
    label: 'Diversidade & Inclusão',
    filters: ['genero', 'localTrabalho'],
  },
  'mapeamento-tecnico': {
    label: 'Mapeamento técnico',
    filters: ['cargo', 'localTrabalho', 'modalidade'],
  },
  'censo-demografico': {
    label: 'Censo demográfico',
    filters: ['localTrabalho', 'genero', 'cargo', 'modalidade'],
  },
  'pesquisa-estrategica': {
    label: 'Pesquisa estratégica',
    filters: ['localTrabalho', 'modalidade'],
  },
  'atualizacao-cadastral': {
    label: 'Atualização cadastral',
    filters: ['localTrabalho', 'modalidade'],
  },
};

// ── Historical mock data for response rate prediction ──────
export const HISTORICAL_RESPONSE_RATES: Record<string, number> = {
  'atualizacao-cadastral': 0.72,
  'censo-demografico': 0.68,
  'pesquisa-estrategica': 0.55,
  'mapeamento-tecnico': 0.62,
  'diversidade-inclusao': 0.58,
};

const today = new Date();
const fmt = (d: Date) => d.toISOString().split('T')[0];

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    title: 'Censo Diversidade 2025',
    description: 'Campanha para mapear diversidade na empresa',
    status: 'ativa',
    startDate: fmt(new Date(today.getFullYear(), today.getMonth() - 1, 1)),
    endDate: fmt(new Date(today.getFullYear(), today.getMonth() + 1, 15)),
    publicoAlvo: 'Todos os Colaboradores',
    solicitante: 'Ana Paula Oliveira',
    solicitanteCargo: 'Gerente de RH',
    solicitanteUnidade: 'UNI I - Alphaville SP',
    area: 'RH',
    tipoCampanha: 'censo-demografico',
    formato: 'itens-demograficos',
    localDistribuicao: ['email', 'teams'],
    questions: [],
    itensDemograficos: ['Gênero', 'Idade'],
    createdAt: fmt(new Date(today.getFullYear(), today.getMonth() - 1, 1)),
    criadoPor: 'Gestor Principal',
    ativadoPor: 'Gestor Principal',
    dataAtivacao: fmt(new Date(today.getFullYear(), today.getMonth() - 1, 1)),
    totalImpactados: 146,
    totalRespostas: 98,
    recurrence: 'anual',
    respondentes: [
      { nome: 'Ana Silva', area: 'Tecnologia', localTrabalho: 'UNI I - Alphaville SP', cargo: 'Desenvolvedora', genero: 'Mulher Cisgênero', modalidade: 'Remoto', tempoEmpresa: 'De 2 a 5 anos', senioridade: 'Pleno', dataResposta: '2025-02-10' },
      { nome: 'Carlos Santos', area: 'RH', localTrabalho: 'Curitiba PR', cargo: 'Analista', genero: 'Homem Cisgênero', modalidade: 'Híbrido', tempoEmpresa: 'De 1 a 2 anos', senioridade: 'Junior', dataResposta: '2025-02-12' },
      { nome: 'Mariana Costa', area: 'Financeiro', localTrabalho: 'UNI II - Paulista SP', cargo: 'Gerente', genero: 'Mulher Cisgênero', modalidade: 'Presencial', tempoEmpresa: 'De 5 a 10 anos', senioridade: 'Senior', dataResposta: '2025-02-14' },
      { nome: 'Roberto Almeida', area: 'Comercial', localTrabalho: 'Rio de Janeiro RJ', cargo: 'Diretor', genero: 'Homem Cisgênero', modalidade: 'Remoto', tempoEmpresa: 'De 10 a 15 anos', senioridade: 'Diretor', dataResposta: '2025-02-15' },
      { nome: 'Juliana Pereira', area: 'Operações', localTrabalho: 'Florida USA', cargo: 'Coordenadora', genero: 'Mulher Cisgênero', modalidade: 'Híbrido', tempoEmpresa: 'De 2 a 5 anos', senioridade: 'Pleno', dataResposta: '2025-02-18' },
    ],
  },
  {
    id: '2',
    title: 'Pesquisa de Clima Organizacional',
    description: 'Pesquisa para avaliar clima organizacional',
    status: 'nova',
    startDate: fmt(new Date(today.getFullYear(), today.getMonth() + 1, 1)),
    endDate: fmt(new Date(today.getFullYear(), today.getMonth() + 2, 30)),
    publicoAlvo: 'Gestores',
    solicitante: 'Carlos Eduardo Santos',
    solicitanteCargo: 'Diretor de Pessoas',
    solicitanteUnidade: 'UNI II - Paulista SP',
    area: 'RH',
    tipoCampanha: 'pesquisa-estrategica',
    formato: 'perguntas-aleatorias',
    localDistribuicao: ['email'],
    questions: [
      { id: 'q1', text: 'Como você avalia o ambiente de trabalho?', type: 'unica-escolha', required: true, options: ['Excelente', 'Bom', 'Regular', 'Ruim'] },
      { id: 'q2', text: 'Você se sente valorizado na empresa?', type: 'unica-escolha', required: true, options: ['Sim', 'Não', 'Parcialmente'] },
    ],
    itensDemograficos: [],
    createdAt: fmt(today),
    criadoPor: 'Gestor Principal',
    totalImpactados: 32,
    totalRespostas: 0,
    respondentes: [],
  },
  {
    id: '3',
    title: 'Atualização de Dados Cadastrais',
    description: 'Atualização periódica de dados cadastrais',
    status: 'concluida',
    startDate: '2024-10-01',
    endDate: '2024-12-31',
    publicoAlvo: 'Todos os Colaboradores',
    solicitante: 'Juliana Pereira Lima',
    solicitanteCargo: 'Head de People Analytics',
    solicitanteUnidade: 'UNI I - Alphaville SP',
    area: 'RH',
    tipoCampanha: 'atualizacao-cadastral',
    formato: 'itens-demograficos',
    localDistribuicao: ['email', 'teams', 'fourmakers'],
    questions: [],
    itensDemograficos: ['Idade', 'Tempo de Casa'],
    createdAt: '2024-09-25',
    criadoPor: 'Gestor Principal',
    ativadoPor: 'Gestor Principal',
    dataAtivacao: '2024-10-01',
    totalImpactados: 146,
    totalRespostas: 140,
    recurrence: 'semestral',
    respondentes: [
      { nome: 'Fernando Lima', area: 'Tecnologia', localTrabalho: 'UNI I - Alphaville SP', cargo: 'Dev Senior', genero: 'Homem Cisgênero', modalidade: 'Remoto', tempoEmpresa: 'De 5 a 10 anos', senioridade: 'Senior', dataResposta: '2024-10-05' },
      { nome: 'Patricia Rocha', area: 'RH', localTrabalho: 'Curitiba PR', cargo: 'Analista', genero: 'Mulher Cisgênero', modalidade: 'Híbrido', tempoEmpresa: 'De 2 a 5 anos', senioridade: 'Pleno', dataResposta: '2024-10-08' },
      { nome: 'Lucas Martins', area: 'Financeiro', localTrabalho: 'Lisboa EU', cargo: 'Contador', genero: 'Homem Cisgênero', modalidade: 'Presencial', tempoEmpresa: 'Até 1 ano', senioridade: 'Junior', dataResposta: '2024-10-12' },
    ],
  },
  {
    id: '4',
    title: 'Compliance LGPD Q1',
    description: 'Verificação de conformidade LGPD',
    status: 'cancelada',
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    publicoAlvo: 'CLT',
    solicitante: 'Roberto Almeida Jr.',
    solicitanteCargo: 'Analista de Compliance',
    solicitanteUnidade: 'Rio de Janeiro RJ',
    area: 'Tecnologia',
    tipoCampanha: 'pesquisa-estrategica',
    formato: 'perguntas-aleatorias',
    localDistribuicao: ['email', 'windows'],
    questions: [{ id: 'q1', text: 'Você conhece a política de privacidade da empresa?', type: 'unica-escolha', required: true, options: ['Sim', 'Não'] }],
    itensDemograficos: [],
    createdAt: '2024-12-20',
    criadoPor: 'Gestor Principal',
    totalImpactados: 110,
    totalRespostas: 45,
    respondentes: [
      { nome: 'Diego Ferreira', area: 'Operações', localTrabalho: 'UNI I - Alphaville SP', cargo: 'Analista', genero: 'Homem Cisgênero', modalidade: 'Remoto', tempoEmpresa: 'De 1 a 2 anos', senioridade: 'Junior', dataResposta: '2025-01-10' },
    ],
  },
  {
    id: '5',
    title: 'Mapeamento de Hard Skills 2025',
    description: 'Mapeamento técnico de competências',
    status: 'ativa',
    startDate: fmt(new Date(today.getFullYear(), today.getMonth(), 1)),
    endDate: fmt(new Date(today.getFullYear(), today.getMonth() + 3, 0)),
    publicoAlvo: 'Todos os Colaboradores',
    solicitante: 'Mariana Costa Silva',
    solicitanteCargo: 'Coordenadora de D&I',
    solicitanteUnidade: 'Curitiba PR',
    area: 'Tecnologia',
    tipoCampanha: 'mapeamento-tecnico',
    formato: 'perguntas-aleatorias',
    localDistribuicao: ['email', 'fourmakers', 'comunicacao'],
    questions: [
      { id: 'q1', text: 'Quais linguagens de programação você domina?', type: 'texto-curto', required: true },
      { id: 'q2', text: 'Qual seu nível de proficiência em Cloud?', type: 'unica-escolha', required: true, options: ['Iniciante', 'Intermediário', 'Avançado', 'Especialista'] },
      { id: 'q3', text: 'Possui certificações ativas?', type: 'unica-escolha', required: false, options: ['Sim', 'Não'] },
    ],
    itensDemograficos: [],
    createdAt: fmt(new Date(today.getFullYear(), today.getMonth(), 1)),
    criadoPor: 'Gestor Principal',
    ativadoPor: 'Gestor Principal',
    dataAtivacao: fmt(new Date(today.getFullYear(), today.getMonth(), 1)),
    totalImpactados: 146,
    totalRespostas: 67,
    respondentes: [
      { nome: 'Beatriz Souza', area: 'Tecnologia', localTrabalho: 'UNI II - Paulista SP', cargo: 'Dev Frontend', genero: 'Mulher Cisgênero', modalidade: 'Remoto', tempoEmpresa: 'De 2 a 5 anos', senioridade: 'Pleno', dataResposta: '2025-02-05' },
      { nome: 'Thiago Oliveira', area: 'Tecnologia', localTrabalho: 'UNI I - Alphaville SP', cargo: 'Dev Backend', genero: 'Homem Cisgênero', modalidade: 'Híbrido', tempoEmpresa: 'De 1 a 2 anos', senioridade: 'Junior', dataResposta: '2025-02-07' },
    ],
  },
  {
    id: '6',
    title: 'Pesquisa Engajamento 2024',
    description: 'Pesquisa de engajamento do ano passado',
    status: 'arquivada',
    previousStatus: 'concluida',
    startDate: '2024-03-01',
    endDate: '2024-06-30',
    publicoAlvo: 'Todos os Colaboradores',
    solicitante: 'Ana Paula Oliveira',
    solicitanteCargo: 'Gerente de RH',
    solicitanteUnidade: 'UNI I - Alphaville SP',
    area: 'RH',
    tipoCampanha: 'pesquisa-estrategica',
    formato: 'perguntas-aleatorias',
    localDistribuicao: ['email'],
    questions: [{ id: 'q1', text: 'Como avalia seu engajamento?', type: 'unica-escolha', required: true, options: ['Alto', 'Médio', 'Baixo'] }],
    itensDemograficos: [],
    createdAt: '2024-02-15',
    criadoPor: 'Gestor Principal',
    ativadoPor: 'Gestor Principal',
    dataAtivacao: '2024-03-01',
    totalImpactados: 146,
    totalRespostas: 130,
    respondentes: [],
  },
  {
    id: '7',
    title: 'Compliance LGPD 2023',
    description: 'Verificação LGPD cancelada',
    status: 'arquivada',
    previousStatus: 'cancelada',
    startDate: '2023-06-01',
    endDate: '2023-09-30',
    publicoAlvo: 'CLT',
    solicitante: 'Roberto Almeida Jr.',
    solicitanteCargo: 'Analista de Compliance',
    solicitanteUnidade: 'Rio de Janeiro RJ',
    area: 'Tecnologia',
    tipoCampanha: 'pesquisa-estrategica',
    formato: 'perguntas-aleatorias',
    localDistribuicao: ['email'],
    questions: [],
    itensDemograficos: [],
    createdAt: '2023-05-20',
    criadoPor: 'Gestor Principal',
    totalImpactados: 90,
    totalRespostas: 20,
    respondentes: [],
  },
];

export const QUESTION_TYPE_OPTIONS: { value: QuestionType; label: string }[] = [
  { value: 'resposta-curta', label: 'Resposta curta' },
  { value: 'paragrafo', label: 'Parágrafo' },
  { value: 'multipla-escolha', label: 'Múltipla escolha' },
  { value: 'unica-escolha', label: 'Única escolha' },
  { value: 'caixa-selecao', label: 'Caixa de seleção' },
  { value: 'lista-suspensa', label: 'Lista Suspensa' },
  { value: 'upload-arquivo', label: 'Upload de arquivo' },
  { value: 'escala-linear', label: 'Escala Linear' },
  { value: 'classificacao', label: 'Classificação' },
  { value: 'grade-multipla', label: 'Grade de Múltiplas escolhas' },
  { value: 'grade-caixa', label: 'Grade de caixa de seleção' },
  { value: 'data', label: 'Data' },
  { value: 'horario', label: 'Horário' },
  { value: 'texto-curto', label: 'Texto curto' },
  { value: 'texto-longo', label: 'Texto longo' },
  { value: 'numerica', label: 'Numérica' },
  { value: 'upload', label: 'Upload' },
];
