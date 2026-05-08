// ============================================================
// FOURMAKERS — Mock Data for Mapa Demográfico
// ============================================================

export type FilterPessoas = 'colaboradores' | 'banco-talentos';
export type StatusFilter = 'todos' | 'ativos' | 'inativos';

export const LOCAL_TRABALHO_OPTIONS = [
  { value: 'uni-i-alphaville', label: 'UNI I - Alphaville SP' },
  { value: 'uni-ii-paulista', label: 'UNI II - Paulista SP' },
  { value: 'curitiba', label: 'Curitiba PR' },
  { value: 'rio-de-janeiro', label: 'Rio de Janeiro RJ' },
  { value: 'florida', label: 'Florida USA' },
  { value: 'lisboa', label: 'Lisboa EU' },
];

export const EMPRESAS_OPTIONS = [
  { value: 'techcorp', label: 'TechCorp Brasil' },
  { value: 'inovadata', label: 'InovaData SA' },
  { value: 'digitalx', label: 'DigitalX Ventures' },
  { value: 'futurelab', label: 'FutureLab Tech' },
  { value: 'nexusit', label: 'NexusIT Solutions' },
  { value: 'cloudrise', label: 'CloudRise Inc.' },
  { value: 'alphadev', label: 'AlphaDev Systems' },
  { value: 'metabrand', label: 'MetaBrand Group' },
];

export const DEMOGRAPHIC_ITEMS = [
  'Idade',
  'Tempo de Casa',
  'Gênero',
  'Cor ou Etnia',
  'Visto',
  'Cidadania',
  'Escolaridade',
  'Orientação Sexual',
  'PCD',
  'Hardskills',
  'Softskills',
  'Metodologias',
  'Formações',
  'Idiomas',
  'Local de Trabalho',
  'Cargos',
  'Clientes',
  'Modalidade de trabalho',
  'Certificações',
  'Estado',
  'Cidade',
];

export interface CardConfig {
  id: number;
  name: string;
  items: string[];
  sharing: 'privado' | 'publico' | 'especifico';
}

export interface DemographicRow {
  label: string;
  count: number;
  percent: number;
  children?: DemographicRow[];
  expandable?: boolean;
}

export interface DemographicGroup {
  category: string;
  totalCount: number;
  rows: DemographicRow[];
  expandable?: boolean;
}

export interface Employee {
  id: number;
  nome: string;
  idade: number;
  tempoCasa: string;
  genero: string;
  localTrabalho: string;
  status: 'Ativo' | 'Inativo';
  cargo: string;
  corEtnia: string;
  faixaIdade: string;
  visto: string;
  cidadania: string;
  escolaridade: string;
  orientacaoSexual: string;
  pcd: string;
  hardskills: { skill: string; nivel: string }[];
  softskills: { softskill: string; nivel: string }[];
  metodologias: { metodologia: string; nivel: string }[];
  formacao: string;
  idiomas: { idioma: string; nivel: string }[];
  cliente: string;
  modalidadeTrabalho: string;
  certificacoes: string[];
  empresa: string;
  estado: string;
  cidade: string;
}

// ── Demographic data ──────────────────────────────────────────
export const DEMOGRAPHIC_DATA: Record<string, DemographicGroup> = {
  Idade: {
    category: 'Idade',
    totalCount: 146,
    rows: [
      { label: 'Sem resposta', count: 114, percent: 78.08 },
      { label: '25 anos ou mais', count: 32, percent: 21.92 },
      { label: 'De 25 até 35', count: 18, percent: 12.33 },
      { label: 'De 35 até 45', count: 9, percent: 6.16 },
      { label: 'De 45 até 55', count: 4, percent: 2.74 },
      { label: 'Acima de 55', count: 1, percent: 0.68 },
    ],
  },
  'Tempo de Casa': {
    category: 'Tempo de Casa',
    totalCount: 146,
    rows: [
      { label: 'Até 1 ano', count: 7, percent: 4.79 },
      { label: 'De 1 a 2 anos', count: 23, percent: 15.75 },
      { label: 'De 2 a 5 anos', count: 52, percent: 35.62 },
      { label: 'De 5 a 10 anos', count: 38, percent: 26.03 },
      { label: 'De 10 a 15 anos', count: 18, percent: 12.33 },
      { label: 'De 15 a 20 anos', count: 8, percent: 5.48 },
    ],
  },
  Gênero: {
    category: 'Gênero',
    totalCount: 146,
    rows: [
      { label: 'Sem resposta', count: 116, percent: 79.45 },
      { label: 'Homem Cisgênero', count: 18, percent: 12.33 },
      { label: 'Mulher Cisgênero', count: 8, percent: 5.48 },
      { label: 'Transgênero', count: 2, percent: 1.37 },
      { label: 'Não Binária', count: 1, percent: 0.68 },
      { label: 'Outro', count: 1, percent: 0.68 },
    ],
  },
  'Cor ou Etnia': {
    category: 'Cor ou Etnia',
    totalCount: 146,
    rows: [
      { label: 'Sem resposta', count: 116, percent: 79.45 },
      { label: 'Branca', count: 16, percent: 10.96 },
      { label: 'Parda', count: 8, percent: 5.48 },
      { label: 'Preta', count: 4, percent: 2.74 },
      { label: 'Amarela', count: 2, percent: 1.37 },
    ],
  },
  Visto: {
    category: 'Visto',
    totalCount: 146,
    rows: [
      { label: 'Sem visto', count: 98, percent: 67.12 },
      { label: 'Visto de Trabalho', count: 32, percent: 21.92 },
      { label: 'Visto Permanente', count: 16, percent: 10.96 },
    ],
  },
  Cidadania: {
    category: 'Cidadania',
    totalCount: 146,
    rows: [
      { label: 'Brasil', count: 128, percent: 87.67 },
      { label: 'Portugal', count: 8, percent: 5.48 },
      { label: 'EUA', count: 6, percent: 4.11 },
      { label: 'Outros', count: 4, percent: 2.74 },
    ],
  },
  Escolaridade: {
    category: 'Escolaridade',
    totalCount: 146,
    rows: [
      { label: 'Pós-Graduação', count: 58, percent: 39.73 },
      { label: 'Graduação', count: 72, percent: 49.32 },
      { label: 'Ensino Médio', count: 12, percent: 8.22 },
      { label: 'Técnico', count: 4, percent: 2.74 },
    ],
  },
  'Orientação Sexual': {
    category: 'Orientação Sexual',
    totalCount: 146,
    rows: [
      { label: 'Sem resposta', count: 130, percent: 89.04 },
      { label: 'Heterossexual', count: 12, percent: 8.22 },
      { label: 'Homossexual', count: 3, percent: 2.05 },
      { label: 'Bissexual', count: 1, percent: 0.68 },
    ],
  },
  PCD: {
    category: 'PCD',
    totalCount: 146,
    rows: [
      { label: 'Deficiência Física', count: 3, percent: 2.05 },
      { label: 'Deficiência Auditiva', count: 2, percent: 1.37 },
      { label: 'Deficiência Visual', count: 2, percent: 1.37 },
      { label: 'Deficiência Mental', count: 1, percent: 0.68 },
      { label: 'Deficiência Múltipla', count: 1, percent: 0.68 },
      { label: 'Pessoas com Autismo', count: 1, percent: 0.68 },
      { label: 'Não declarado', count: 136, percent: 93.15 },
    ],
  },
  Hardskills: {
    category: 'Hardskills',
    totalCount: 146,
    expandable: true,
    rows: [
      {
        label: 'JAVA', count: 25, percent: 88.33, expandable: true,
        children: [
          { label: 'Especialista', count: 5, percent: 20.0 },
          { label: 'Sênior', count: 8, percent: 32.0 },
          { label: 'Pleno', count: 7, percent: 28.0 },
          { label: 'Junior', count: 4, percent: 16.0 },
          { label: 'Trainee', count: 1, percent: 4.0 },
          { label: 'A definir', count: 0, percent: 0.0 },
        ],
      },
      {
        label: '.NET', count: 18, percent: 63.0, expandable: true,
        children: [
          { label: 'Especialista', count: 3, percent: 16.67 },
          { label: 'Sênior', count: 6, percent: 33.33 },
          { label: 'Pleno', count: 5, percent: 27.78 },
          { label: 'Junior', count: 3, percent: 16.67 },
          { label: 'Trainee', count: 1, percent: 5.56 },
          { label: 'A definir', count: 0, percent: 0.0 },
        ],
      },
      {
        label: 'REACT NATIVE', count: 14, percent: 49.0, expandable: true,
        children: [
          { label: 'Especialista', count: 2, percent: 14.29 },
          { label: 'Sênior', count: 4, percent: 28.57 },
          { label: 'Pleno', count: 4, percent: 28.57 },
          { label: 'Junior', count: 2, percent: 14.29 },
          { label: 'Trainee', count: 1, percent: 7.14 },
          { label: 'A definir', count: 1, percent: 7.14 },
        ],
      },
      {
        label: 'FIGMA', count: 11, percent: 38.0, expandable: true,
        children: [
          { label: 'Especialista', count: 1, percent: 9.09 },
          { label: 'Sênior', count: 3, percent: 27.27 },
          { label: 'Pleno', count: 3, percent: 27.27 },
          { label: 'Junior', count: 2, percent: 18.18 },
          { label: 'Trainee', count: 1, percent: 9.09 },
          { label: 'A definir', count: 1, percent: 9.09 },
        ],
      },
      {
        label: 'C#', count: 9, percent: 31.0, expandable: true,
        children: [
          { label: 'Especialista', count: 1, percent: 11.11 },
          { label: 'Sênior', count: 2, percent: 22.22 },
          { label: 'Pleno', count: 3, percent: 33.33 },
          { label: 'Junior', count: 2, percent: 22.22 },
          { label: 'Trainee', count: 1, percent: 11.11 },
          { label: 'A definir', count: 0, percent: 0.0 },
        ],
      },
      {
        label: 'JAVASCRIPT', count: 22, percent: 77.0, expandable: true,
        children: [
          { label: 'Especialista', count: 3, percent: 13.64 },
          { label: 'Sênior', count: 6, percent: 27.27 },
          { label: 'Pleno', count: 6, percent: 27.27 },
          { label: 'Junior', count: 4, percent: 18.18 },
          { label: 'Trainee', count: 2, percent: 9.09 },
          { label: 'A definir', count: 1, percent: 4.55 },
        ],
      },
      {
        label: 'POSTGRESQL', count: 7, percent: 24.0, expandable: true,
        children: [
          { label: 'Especialista', count: 1, percent: 14.29 },
          { label: 'Sênior', count: 2, percent: 28.57 },
          { label: 'Pleno', count: 2, percent: 28.57 },
          { label: 'Junior', count: 1, percent: 14.29 },
          { label: 'Trainee', count: 1, percent: 14.29 },
          { label: 'A definir', count: 0, percent: 0.0 },
        ],
      },
      {
        label: 'HTML', count: 16, percent: 56.0, expandable: true,
        children: [
          { label: 'Especialista', count: 2, percent: 12.50 },
          { label: 'Sênior', count: 4, percent: 25.00 },
          { label: 'Pleno', count: 5, percent: 31.25 },
          { label: 'Junior', count: 3, percent: 18.75 },
          { label: 'Trainee', count: 1, percent: 6.25 },
          { label: 'A definir', count: 1, percent: 6.25 },
        ],
      },
    ],
  },
  Softskills: {
    category: 'Softskills',
    totalCount: 146,
    expandable: true,
    rows: [
      { label: 'Comunicação', count: 98, percent: 67.12, expandable: true, children: [
        { label: 'Avançado', count: 30, percent: 30.61 },
        { label: 'Intermediário', count: 38, percent: 38.78 },
        { label: 'Iniciante', count: 22, percent: 22.45 },
        { label: 'A definir', count: 8, percent: 8.16 },
      ]},
      { label: 'Liderança', count: 54, percent: 36.99, expandable: true, children: [
        { label: 'Avançado', count: 16, percent: 29.63 },
        { label: 'Intermediário', count: 20, percent: 37.04 },
        { label: 'Iniciante', count: 12, percent: 22.22 },
        { label: 'A definir', count: 6, percent: 11.11 },
      ]},
      { label: 'Trabalho em Equipe', count: 112, percent: 76.71, expandable: true, children: [
        { label: 'Avançado', count: 35, percent: 31.25 },
        { label: 'Intermediário', count: 42, percent: 37.50 },
        { label: 'Iniciante', count: 25, percent: 22.32 },
        { label: 'A definir', count: 10, percent: 8.93 },
      ]},
      { label: 'Resolução de Problemas', count: 87, percent: 59.59, expandable: true, children: [
        { label: 'Avançado', count: 26, percent: 29.89 },
        { label: 'Intermediário', count: 32, percent: 36.78 },
        { label: 'Iniciante', count: 20, percent: 22.99 },
        { label: 'A definir', count: 9, percent: 10.34 },
      ]},
      { label: 'Adaptabilidade', count: 73, percent: 50.0, expandable: true, children: [
        { label: 'Avançado', count: 22, percent: 30.14 },
        { label: 'Intermediário', count: 27, percent: 36.99 },
        { label: 'Iniciante', count: 17, percent: 23.29 },
        { label: 'A definir', count: 7, percent: 9.59 },
      ]},
    ],
  },
  Metodologias: {
    category: 'Metodologias',
    totalCount: 146,
    expandable: true,
    rows: [
      {
        label: 'Scrum', count: 89, percent: 60.96, expandable: true,
        children: [
          { label: 'Especialista', count: 12, percent: 13.48 },
          { label: 'Sênior', count: 22, percent: 24.72 },
          { label: 'Pleno', count: 25, percent: 28.09 },
          { label: 'Junior', count: 16, percent: 17.98 },
          { label: 'Trainee', count: 8, percent: 8.99 },
          { label: 'A definir', count: 6, percent: 6.74 },
        ],
      },
      {
        label: 'Kanban', count: 62, percent: 42.47, expandable: true,
        children: [
          { label: 'Especialista', count: 8, percent: 12.90 },
          { label: 'Sênior', count: 15, percent: 24.19 },
          { label: 'Pleno', count: 18, percent: 29.03 },
          { label: 'Junior', count: 12, percent: 19.35 },
          { label: 'Trainee', count: 5, percent: 8.06 },
          { label: 'A definir', count: 4, percent: 6.45 },
        ],
      },
      {
        label: 'SAFe', count: 28, percent: 19.18, expandable: true,
        children: [
          { label: 'Especialista', count: 4, percent: 14.29 },
          { label: 'Sênior', count: 7, percent: 25.00 },
          { label: 'Pleno', count: 8, percent: 28.57 },
          { label: 'Junior', count: 5, percent: 17.86 },
          { label: 'Trainee', count: 2, percent: 7.14 },
          { label: 'A definir', count: 2, percent: 7.14 },
        ],
      },
      {
        label: 'OKR', count: 45, percent: 30.82, expandable: true,
        children: [
          { label: 'Especialista', count: 6, percent: 13.33 },
          { label: 'Sênior', count: 11, percent: 24.44 },
          { label: 'Pleno', count: 13, percent: 28.89 },
          { label: 'Junior', count: 8, percent: 17.78 },
          { label: 'Trainee', count: 4, percent: 8.89 },
          { label: 'A definir', count: 3, percent: 6.67 },
        ],
      },
    ],
  },
  Formações: {
    category: 'Formações',
    totalCount: 146,
    rows: [
      { label: 'Ciência da Computação', count: 48, percent: 32.88 },
      { label: 'Engenharia de Software', count: 36, percent: 24.66 },
      { label: 'Sistemas de Informação', count: 28, percent: 19.18 },
      { label: 'Análise e Desenvolvimento', count: 22, percent: 15.07 },
      { label: 'Outros', count: 12, percent: 8.22 },
    ],
  },
  Idiomas: {
    category: 'Idiomas',
    totalCount: 146,
    expandable: true,
    rows: [
      { label: 'Português', count: 146, percent: 100.0, expandable: true, children: [
        { label: 'Nativo', count: 130, percent: 89.04 },
        { label: 'Fluente', count: 10, percent: 6.85 },
        { label: 'Avançado', count: 4, percent: 2.74 },
        { label: 'Intermediário', count: 2, percent: 1.37 },
        { label: 'Iniciante', count: 0, percent: 0.0 },
        { label: 'Não definido', count: 0, percent: 0.0 },
      ]},
      { label: 'Inglês', count: 98, percent: 67.12, expandable: true, children: [
        { label: 'Nativo', count: 6, percent: 6.12 },
        { label: 'Fluente', count: 22, percent: 22.45 },
        { label: 'Avançado', count: 30, percent: 30.61 },
        { label: 'Intermediário', count: 25, percent: 25.51 },
        { label: 'Iniciante', count: 12, percent: 12.24 },
        { label: 'Não definido', count: 3, percent: 3.06 },
      ]},
      { label: 'Espanhol', count: 42, percent: 28.77, expandable: true, children: [
        { label: 'Nativo', count: 2, percent: 4.76 },
        { label: 'Fluente', count: 8, percent: 19.05 },
        { label: 'Avançado', count: 12, percent: 28.57 },
        { label: 'Intermediário', count: 10, percent: 23.81 },
        { label: 'Iniciante', count: 7, percent: 16.67 },
        { label: 'Não definido', count: 3, percent: 7.14 },
      ]},
      { label: 'Francês', count: 12, percent: 8.22, expandable: true, children: [
        { label: 'Nativo', count: 0, percent: 0.0 },
        { label: 'Fluente', count: 2, percent: 16.67 },
        { label: 'Avançado', count: 3, percent: 25.0 },
        { label: 'Intermediário', count: 4, percent: 33.33 },
        { label: 'Iniciante', count: 2, percent: 16.67 },
        { label: 'Não definido', count: 1, percent: 8.33 },
      ]},
      { label: 'Alemão', count: 6, percent: 4.11, expandable: true, children: [
        { label: 'Nativo', count: 0, percent: 0.0 },
        { label: 'Fluente', count: 1, percent: 16.67 },
        { label: 'Avançado', count: 1, percent: 16.67 },
        { label: 'Intermediário', count: 2, percent: 33.33 },
        { label: 'Iniciante', count: 1, percent: 16.67 },
        { label: 'Não definido', count: 1, percent: 16.67 },
      ]},
    ],
  },
  'Local de Trabalho': {
    category: 'Local de Trabalho',
    totalCount: 146,
    rows: [
      { label: 'UNI I - Alphaville SP', count: 62, percent: 42.47 },
      { label: 'UNI II - Paulista SP', count: 38, percent: 26.03 },
      { label: 'Curitiba PR', count: 22, percent: 15.07 },
      { label: 'Rio de Janeiro RJ', count: 14, percent: 9.59 },
      { label: 'Florida USA', count: 6, percent: 4.11 },
      { label: 'Lisboa EU', count: 4, percent: 2.74 },
    ],
  },
  Cargos: {
    category: 'Cargos',
    totalCount: 146,
    rows: [
      { label: 'Desenvolvedor Backend', count: 42, percent: 28.77 },
      { label: 'Desenvolvedor Frontend', count: 28, percent: 19.18 },
      { label: 'Tech Lead', count: 18, percent: 12.33 },
      { label: 'Product Manager', count: 14, percent: 9.59 },
      { label: 'UX Designer', count: 12, percent: 8.22 },
      { label: 'DevOps Engineer', count: 16, percent: 10.96 },
      { label: 'QA Engineer', count: 16, percent: 10.96 },
    ],
  },
  Clientes: {
    category: 'Clientes',
    totalCount: 146,
    rows: [
      { label: 'Cliente A - Financeiro', count: 38, percent: 26.03 },
      { label: 'Cliente B - Varejo', count: 28, percent: 19.18 },
      { label: 'Cliente C - Saúde', count: 22, percent: 15.07 },
      { label: 'Cliente D - Governo', count: 18, percent: 12.33 },
      { label: 'Interno', count: 40, percent: 27.40 },
    ],
  },
  'Modalidade de trabalho': {
    category: 'Modalidade de trabalho',
    totalCount: 146,
    rows: [
      { label: 'Remoto', count: 68, percent: 46.58 },
      { label: 'Híbrido', count: 54, percent: 36.99 },
      { label: 'Presencial', count: 24, percent: 16.44 },
    ],
  },
  Certificações: {
    category: 'Certificações',
    totalCount: 146,
    rows: [
      { label: 'AWS Certified', count: 24, percent: 16.44 },
      { label: 'Google Cloud', count: 18, percent: 12.33 },
      { label: 'Azure', count: 16, percent: 10.96 },
      { label: 'Kubernetes', count: 12, percent: 8.22 },
      { label: 'ITIL', count: 8, percent: 5.48 },
    ],
  },
  Estado: {
    category: 'Estado',
    totalCount: 146,
    rows: [
      { label: 'São Paulo', count: 62, percent: 42.47 },
      { label: 'Paraná', count: 22, percent: 15.07 },
      { label: 'Rio de Janeiro', count: 18, percent: 12.33 },
      { label: 'Minas Gerais', count: 16, percent: 10.96 },
      { label: 'Bahia', count: 10, percent: 6.85 },
      { label: 'Santa Catarina', count: 8, percent: 5.48 },
      { label: 'Distrito Federal', count: 6, percent: 4.11 },
      { label: 'Outros', count: 4, percent: 2.74 },
    ],
  },
  Cidade: {
    category: 'Cidade',
    totalCount: 146,
    rows: [
      { label: 'São Paulo', count: 5, percent: 3.42 },
      { label: 'Osasco', count: 5, percent: 3.42 },
      { label: 'Barueri', count: 5, percent: 3.42 },
      { label: 'Sorocaba', count: 5, percent: 3.42 },
      { label: 'Rio de Janeiro', count: 5, percent: 3.42 },
      { label: 'Campinas', count: 5, percent: 3.42 },
      { label: 'Santos', count: 5, percent: 3.42 },
      { label: 'Curitiba', count: 5, percent: 3.42 },
      { label: 'Porto Alegre', count: 5, percent: 3.42 },
      { label: 'Brasília', count: 5, percent: 3.42 },
      { label: 'Salvador', count: 5, percent: 3.42 },
      { label: 'Recife', count: 5, percent: 3.42 },
      { label: 'Fortaleza', count: 5, percent: 3.42 },
      { label: 'Belo Horizonte', count: 5, percent: 3.42 },
      { label: 'Goiânia', count: 5, percent: 3.42 },
      { label: 'Nova York', count: 5, percent: 3.42 },
      { label: 'Los Angeles', count: 5, percent: 3.42 },
      { label: 'Miami', count: 5, percent: 3.42 },
      { label: 'Orlando', count: 5, percent: 3.42 },
      { label: 'Chicago', count: 5, percent: 3.42 },
      { label: 'Houston', count: 5, percent: 3.42 },
      { label: 'Boston', count: 5, percent: 3.42 },
      { label: 'San Francisco', count: 5, percent: 3.42 },
      { label: 'Dallas', count: 5, percent: 3.42 },
      { label: 'Lisboa', count: 5, percent: 3.42 },
      { label: 'Porto', count: 5, percent: 3.42 },
      { label: 'Coimbra', count: 4, percent: 2.74 },
      { label: 'Braga', count: 4, percent: 2.74 },
      { label: 'Faro', count: 4, percent: 2.74 },
      { label: 'Cascais', count: 4, percent: 2.74 },
    ],
  },
};

// ── Mock Employees (146 records) ──────────────────────────────
const NAMES = [
  'Ana Souza','Carlos Lima','Fernanda Rocha','Ricardo Alves','Juliana Costa',
  'Marcos Pereira','Patrícia Nunes','Felipe Santos','Camila Ferreira','Eduardo Dias',
  'Larissa Oliveira','Thiago Martins','Débora Carvalho','Bruno Gomes','Natalia Ribeiro',
  'Rafael Torres','Isabela Monteiro','Lucas Araujo','Aline Mendes','Gabriel Castro',
  'Juliane Freitas','Roberto Campos','Simone Batista','Henrique Pires','Carla Moreira',
  'Vinícius Lopes','Amanda Teixeira','Diego Farias','Priscila Barbosa','Gustavo Cunha',
  'Renata Vieira','Maurício Borges','Tatiana Fonseca','Alexandre Cardoso','Elisa Pinto',
  'Fábio Azevedo','Mariana Braga','Ítalo Correia','Beatriz Nascimento','Sérgio Moura',
  'Daniela Silveira','Rodrigo Andrade','Viviane Sousa','Leandro Melo','Cíntia Queiroz',
  'Paulo Ramos','Estela Cavalcanti','Wilson Fernandes','Vera Bastos','Allan Xavier',
  'Sandra Medeiros','Igor Souza','Mônica Vasconcelos','Caio Rezende','Luana Guimarães',
  'Pedro Henrique','Bianca Leal','Otávio Duarte','Letícia Barros','Mateus Nogueira',
  'Raquel Pimentel','André Machado','Jéssica Tavares','Marcelo Ramos','Vanessa Cruz',
  'Luciano Paiva','Cristiane Rocha','Tiago Menezes','Adriana Luz','Hugo Ferreira',
  'Eliane Figueiredo','Ronaldo Bezerra','Karina Lemos','Samuel Dantas','Cecília Gomes',
  'Danilo Teixeira','Rosana Almeida','Guilherme Moreira','Antônia Brito','João Paulo',
  'Marina Corrêa','Cláudio Monteiro','Sabrina Reis','Emerson Oliveira','Luísa Martins',
  'Sandro Vieira','Teresa Prado','Nelson Andrade','Glória Santana','Reginaldo Costa',
  'Talita Barros','Willian Cardoso','Bruna Lopes','Mário Fonseca','Rita Azevedo',
  'Augusto Mendes','Débora Pinto','Flávio Nunes','Silvana Pereira','Osvaldo Batista',
  'Lílian Castro','Rogério Torres','Denise Araújo','Edson Ribeiro','Norma Freitas',
  'Adriano Souza','Cássia Campos','Davi Cunha','Marta Silveira','Celso Queiroz',
  'Ângela Medeiros','Rubens Xavier','Elisângela Lima','Jefferson Santos','Sueli Borges',
  'Márcio Dias','Tereza Melo','Alisson Pires','Luciana Cavalcanti','Josué Ferreira',
  'Neusa Ramos','Ivan Bastos','Soraia Duarte','Edivaldo Nogueira','Miriam Tavares',
  'Joaquim Machado','Raimunda Leal','Valdir Paiva','Gisele Luz','Adilson Bezerra',
  'Elma Figueiredo','Cleber Dantas','Socorro Brito','Ademir Teixeira','Iracema Moreira',
  'Laércio Almeida','Carmem Corrêa','Everaldo Reis','Aparecida Prado','Jorge Santana',
  'Eunice Vieira','Valter Nascimento','Helena Gonçalves','Orlando Silva','Zilda Carvalho','Renato Monteiro',
];

// Helper to distribute indices into buckets of specific sizes
function distribute(total: number, buckets: number[]): number[][] {
  const result: number[][] = buckets.map(() => []);
  const indices = Array.from({ length: total }, (_, i) => i);
  let pos = 0;
  for (let b = 0; b < buckets.length; b++) {
    for (let j = 0; j < buckets[b] && pos < total; j++) {
      result[b].push(indices[pos++]);
    }
  }
  return result;
}

// Helper: assign a multi-value field (like softskills) where each employee can have multiple values
function assignMulti(total: number, labels: string[], counts: number[]): string[][] {
  const result: string[][] = Array.from({ length: total }, () => []);
  for (let l = 0; l < labels.length; l++) {
    // Spread evenly across employees starting from different offsets
    const step = Math.max(1, Math.floor(total / counts[l]));
    let assigned = 0;
    const offset = l * 7; // Different offset per label to avoid overlap patterns
    for (let i = 0; i < total && assigned < counts[l]; i++) {
      const idx = (i * step + offset) % total;
      // Avoid giving same label twice (shouldn't happen with step >= 1)
      if (!result[idx].includes(labels[l])) {
        result[idx].push(labels[l]);
        assigned++;
      } else {
        // Try next index
        for (let k = 1; k < total && assigned < counts[l]; k++) {
          const altIdx = (idx + k) % total;
          if (!result[altIdx].includes(labels[l])) {
            result[altIdx].push(labels[l]);
            assigned++;
            break;
          }
        }
      }
    }
  }
  return result;
}

const T = 146;

// ── Single-value distributions ──
const faixaIdadeDist = distribute(T, [114, 18, 9, 4, 1]); // Sem resposta, De 25 até 35, De 35 até 45, De 45 até 55, Acima de 55
const faixaIdadeLabels = ['Sem resposta', 'De 25 até 35', 'De 35 até 45', 'De 45 até 55', 'Acima de 55'];
// Note: "25 anos ou mais" = indices in De 25 até 35 + De 35 até 45 + De 45 até 55 + Acima de 55 = 32

const tempoCasaDist = distribute(T, [7, 23, 52, 38, 18, 8]);
const tempoCasaLabels = ['Até 1 ano', 'De 1 a 2 anos', 'De 2 a 5 anos', 'De 5 a 10 anos', 'De 10 a 15 anos', 'De 15 a 20 anos'];

const generoDist = distribute(T, [116, 18, 8, 2, 1, 1]);
const generoLabels = ['Sem resposta', 'Homem Cisgênero', 'Mulher Cisgênero', 'Transgênero', 'Não Binária', 'Outro'];

const etniaDist = distribute(T, [116, 16, 8, 4, 2]);
const etniaLabels = ['Sem resposta', 'Branca', 'Parda', 'Preta', 'Amarela'];

const vistoDist = distribute(T, [98, 32, 16]);
const vistoLabels = ['Sem visto', 'Visto de Trabalho', 'Visto Permanente'];

const cidadaniaDist = distribute(T, [128, 8, 6, 4]);
const cidadaniaLabels = ['Brasil', 'Portugal', 'EUA', 'Outros'];

const escolaridadeDist = distribute(T, [58, 72, 12, 4]);
const escolaridadeLabels = ['Pós-Graduação', 'Graduação', 'Ensino Médio', 'Técnico'];

const orientacaoDist = distribute(T, [130, 12, 3, 1]);
const orientacaoLabels = ['Sem resposta', 'Heterossexual', 'Homossexual', 'Bissexual'];

const pcdDist = distribute(T, [3, 2, 2, 1, 1, 1, 136]);
const pcdLabels = ['Deficiência Física', 'Deficiência Auditiva', 'Deficiência Visual', 'Deficiência Mental', 'Deficiência Múltipla', 'Pessoas com Autismo', 'Não declarado'];

const localDist = distribute(T, [62, 38, 22, 14, 6, 4]);
const localLabels = ['UNI I - Alphaville SP', 'UNI II - Paulista SP', 'Curitiba PR', 'Rio de Janeiro RJ', 'Florida USA', 'Lisboa EU'];

const empresaDist = distribute(T, [23, 21, 20, 19, 18, 17, 15, 13]);
const empresaLabels = ['TechCorp Brasil', 'InovaData SA', 'DigitalX Ventures', 'FutureLab Tech', 'NexusIT Solutions', 'CloudRise Inc.', 'AlphaDev Systems', 'MetaBrand Group'];

const cargoDist = distribute(T, [42, 28, 18, 14, 12, 16, 16]);
const cargoLabels = ['Desenvolvedor Backend', 'Desenvolvedor Frontend', 'Tech Lead', 'Product Manager', 'UX Designer', 'DevOps Engineer', 'QA Engineer'];

const clienteDist = distribute(T, [38, 28, 22, 18, 40]);
const clienteLabels = ['Cliente A - Financeiro', 'Cliente B - Varejo', 'Cliente C - Saúde', 'Cliente D - Governo', 'Interno'];

const modalidadeDist = distribute(T, [68, 54, 24]);
const modalidadeLabels = ['Remoto', 'Híbrido', 'Presencial'];

const formacaoDist = distribute(T, [48, 36, 28, 22, 12]);
const formacaoLabels = ['Ciência da Computação', 'Engenharia de Software', 'Sistemas de Informação', 'Análise e Desenvolvimento', 'Outros'];

const estadoDist = distribute(T, [62, 22, 18, 16, 10, 8, 6, 4]);
const estadoLabels = ['São Paulo', 'Paraná', 'Rio de Janeiro', 'Minas Gerais', 'Bahia', 'Santa Catarina', 'Distrito Federal', 'Outros'];

const cidadeDist = distribute(T, [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,4,4,4,4]);
const cidadeLabels = ['São Paulo','Osasco','Barueri','Sorocaba','Rio de Janeiro','Campinas','Santos','Curitiba','Porto Alegre','Brasília','Salvador','Recife','Fortaleza','Belo Horizonte','Goiânia','Nova York','Los Angeles','Miami','Orlando','Chicago','Houston','Boston','San Francisco','Dallas','Lisboa','Porto','Coimbra','Braga','Faro','Cascais'];

// ── Multi-value distributions ──
const SOFTSKILL_LEVELS = ['Avançado', 'Intermediário', 'Iniciante', 'A definir'];

type SsEntry = { softskill: string; nivel: string };
function buildSoftskills(): SsEntry[][] {
  const result: SsEntry[][] = Array.from({ length: T }, () => []);
  const specs: { ss: string; total: number; dist: number[] }[] = [
    { ss: 'Comunicação', total: 98, dist: [30, 38, 22, 8] },
    { ss: 'Liderança', total: 54, dist: [16, 20, 12, 6] },
    { ss: 'Trabalho em Equipe', total: 112, dist: [35, 42, 25, 10] },
    { ss: 'Resolução de Problemas', total: 87, dist: [26, 32, 20, 9] },
    { ss: 'Adaptabilidade', total: 73, dist: [22, 27, 17, 7] },
  ];
  let globalOffset = 0;
  for (const spec of specs) {
    const levels: string[] = [];
    for (let li = 0; li < spec.dist.length; li++) {
      for (let n = 0; n < spec.dist[li]; n++) levels.push(SOFTSKILL_LEVELS[li]);
    }
    for (let i = 0; i < spec.total; i++) {
      const idx = (globalOffset + i * 3) % T;
      const tryAssign = (target: number) => {
        if (!result[target].some(s => s.softskill === spec.ss)) {
          result[target].push({ softskill: spec.ss, nivel: levels[i] });
          return true;
        }
        return false;
      };
      if (!tryAssign(idx)) {
        for (let k = 1; k < T; k++) {
          if (tryAssign((idx + k) % T)) break;
        }
      }
    }
    globalOffset += 17;
  }
  return result;
}
const softskillsData = buildSoftskills();

type MetEntry = { metodologia: string; nivel: string };
const SENIORITY_LEVELS = ['Especialista', 'Sênior', 'Pleno', 'Junior', 'Trainee', 'A definir'];

function buildMetodologias(): MetEntry[][] {
  const result: MetEntry[][] = Array.from({ length: T }, () => []);
  const specs: { met: string; total: number; dist: number[] }[] = [
    { met: 'Scrum', total: 89, dist: [12, 22, 25, 16, 8, 6] },
    { met: 'Kanban', total: 62, dist: [8, 15, 18, 12, 5, 4] },
    { met: 'SAFe', total: 28, dist: [4, 7, 8, 5, 2, 2] },
    { met: 'OKR', total: 45, dist: [6, 11, 13, 8, 4, 3] },
  ];
  let globalOffset = 0;
  for (const spec of specs) {
    const levels: string[] = [];
    for (let li = 0; li < spec.dist.length; li++) {
      for (let n = 0; n < spec.dist[li]; n++) levels.push(SENIORITY_LEVELS[li]);
    }
    for (let i = 0; i < spec.total; i++) {
      const idx = (globalOffset + i * 3) % T;
      const tryAssign = (target: number) => {
        if (!result[target].some(m => m.metodologia === spec.met)) {
          result[target].push({ metodologia: spec.met, nivel: levels[i] });
          return true;
        }
        return false;
      };
      if (!tryAssign(idx)) {
        for (let k = 1; k < T; k++) {
          if (tryAssign((idx + k) % T)) break;
        }
      }
    }
    globalOffset += 17;
  }
  return result;
}
const metodologiasData = buildMetodologias();

const IDIOMA_LEVELS = ['Nativo', 'Fluente', 'Avançado', 'Intermediário', 'Iniciante', 'Não definido'];

type IdEntry = { idioma: string; nivel: string };
function buildIdiomas(): IdEntry[][] {
  const result: IdEntry[][] = Array.from({ length: T }, () => []);
  const specs: { idioma: string; total: number; dist: number[] }[] = [
    { idioma: 'Português', total: 146, dist: [130, 10, 4, 2, 0, 0] },
    { idioma: 'Inglês', total: 98, dist: [6, 22, 30, 25, 12, 3] },
    { idioma: 'Espanhol', total: 42, dist: [2, 8, 12, 10, 7, 3] },
    { idioma: 'Francês', total: 12, dist: [0, 2, 3, 4, 2, 1] },
    { idioma: 'Alemão', total: 6, dist: [0, 1, 1, 2, 1, 1] },
  ];
  let globalOffset = 0;
  for (const spec of specs) {
    const levels: string[] = [];
    for (let li = 0; li < spec.dist.length; li++) {
      for (let n = 0; n < spec.dist[li]; n++) levels.push(IDIOMA_LEVELS[li]);
    }
    for (let i = 0; i < spec.total; i++) {
      const idx = (globalOffset + i * 3) % T;
      const tryAssign = (target: number) => {
        if (!result[target].some(d => d.idioma === spec.idioma)) {
          result[target].push({ idioma: spec.idioma, nivel: levels[i] });
          return true;
        }
        return false;
      };
      if (!tryAssign(idx)) {
        for (let k = 1; k < T; k++) {
          if (tryAssign((idx + k) % T)) break;
        }
      }
    }
    globalOffset += 17;
  }
  return result;
}
const idiomasData = buildIdiomas();

const certificacoesData = assignMulti(T,
  ['AWS Certified', 'Google Cloud', 'Azure', 'Kubernetes', 'ITIL'],
  [24, 18, 16, 12, 8]
);

// ── Hardskills with levels ──
type HsEntry = { skill: string; nivel: string };

function buildHardskills(): HsEntry[][] {
  const result: HsEntry[][] = Array.from({ length: T }, () => []);
  
  const allSkills: { skill: string; total: number; dist: number[] }[] = [
    { skill: 'JAVA', total: 25, dist: [5, 8, 7, 4, 1, 0] },
    { skill: '.NET', total: 18, dist: [3, 6, 5, 3, 1, 0] },
    { skill: 'REACT NATIVE', total: 14, dist: [2, 4, 4, 2, 1, 1] },
    { skill: 'FIGMA', total: 11, dist: [1, 3, 3, 2, 1, 1] },
    { skill: 'C#', total: 9, dist: [1, 2, 3, 2, 1, 0] },
    { skill: 'JAVASCRIPT', total: 22, dist: [3, 6, 6, 4, 2, 1] },
    { skill: 'POSTGRESQL', total: 7, dist: [1, 2, 2, 1, 1, 0] },
    { skill: 'HTML', total: 16, dist: [2, 4, 5, 3, 1, 1] },
  ];

  let globalOffset = 0;
  for (const spec of allSkills) {
    const levels: string[] = [];
    for (let li = 0; li < spec.dist.length; li++) {
      for (let n = 0; n < spec.dist[li]; n++) levels.push(SENIORITY_LEVELS[li]);
    }
    for (let i = 0; i < spec.total; i++) {
      const idx = (globalOffset + i * 3) % T;
      const tryAssign = (target: number) => {
        if (!result[target].some(h => h.skill === spec.skill)) {
          result[target].push({ skill: spec.skill, nivel: levels[i] });
          return true;
        }
        return false;
      };
      if (!tryAssign(idx)) {
        for (let k = 1; k < T; k++) {
          if (tryAssign((idx + k) % T)) break;
        }
      }
    }
    globalOffset += 17;
  }

  return result;
}
const hardskillsData = buildHardskills();

// ── Build lookup: index -> label for single-value fields ──
function buildLookup(dist: number[][], labels: string[]): Map<number, string> {
  const map = new Map<number, string>();
  for (let b = 0; b < dist.length; b++) {
    for (const idx of dist[b]) {
      map.set(idx, labels[b]);
    }
  }
  return map;
}

const faixaIdadeLookup = buildLookup(faixaIdadeDist, faixaIdadeLabels);
const tempoCasaLookup = buildLookup(tempoCasaDist, tempoCasaLabels);
const generoLookup = buildLookup(generoDist, generoLabels);
const etniaLookup = buildLookup(etniaDist, etniaLabels);
const vistoLookup = buildLookup(vistoDist, vistoLabels);
const cidadaniaLookup = buildLookup(cidadaniaDist, cidadaniaLabels);
const escolaridadeLookup = buildLookup(escolaridadeDist, escolaridadeLabels);
const orientacaoLookup = buildLookup(orientacaoDist, orientacaoLabels);
const pcdLookup = buildLookup(pcdDist, pcdLabels);
const localLookup = buildLookup(localDist, localLabels);
const cargoLookup = buildLookup(cargoDist, cargoLabels);
const clienteLookup = buildLookup(clienteDist, clienteLabels);
const modalidadeLookup = buildLookup(modalidadeDist, modalidadeLabels);
const formacaoLookup = buildLookup(formacaoDist, formacaoLabels);
const empresaLookup = buildLookup(empresaDist, empresaLabels);
const estadoLookup = buildLookup(estadoDist, estadoLabels);
const cidadeLookup = buildLookup(cidadeDist, cidadeLabels);

function ageFromFaixa(faixa: string, seed: number): number {
  switch (faixa) {
    case 'De 25 até 35': return 25 + (seed % 10);
    case 'De 35 até 45': return 35 + (seed % 10);
    case 'De 45 até 55': return 45 + (seed % 10);
    case 'Acima de 55': return 56 + (seed % 10);
    default: return 22 + (seed % 20); // Sem resposta
  }
}

export const MOCK_EMPLOYEES: Employee[] = Array.from({ length: T }, (_, i) => {
  const faixaIdade = faixaIdadeLookup.get(i) || 'Sem resposta';
  const cargo = cargoLookup.get(i) || 'QA Engineer';
  const local = localLookup.get(i) || 'UNI I - Alphaville SP';
  const genero = generoLookup.get(i) || 'Sem resposta';

  return {
    id: i + 1,
    nome: NAMES[i],
    idade: ageFromFaixa(faixaIdade, i * 7),
    tempoCasa: tempoCasaLookup.get(i) || 'De 2 a 5 anos',
    genero,
    localTrabalho: local,
    status: (i % 10 < 8 ? 'Ativo' : 'Inativo') as 'Ativo' | 'Inativo',
    cargo,
    corEtnia: etniaLookup.get(i) || 'Sem resposta',
    faixaIdade,
    visto: vistoLookup.get(i) || 'Sem visto',
    cidadania: cidadaniaLookup.get(i) || 'Brasil',
    escolaridade: escolaridadeLookup.get(i) || 'Graduação',
    orientacaoSexual: orientacaoLookup.get(i) || 'Sem resposta',
    pcd: pcdLookup.get(i) || 'Não declarado',
    hardskills: hardskillsData[i],
    softskills: softskillsData[i],
    metodologias: metodologiasData[i],
    formacao: formacaoLookup.get(i) || 'Outros',
    idiomas: idiomasData[i],
    cliente: clienteLookup.get(i) || 'Interno',
    modalidadeTrabalho: modalidadeLookup.get(i) || 'Remoto',
    certificacoes: certificacoesData[i],
    empresa: empresaLookup.get(i) || 'TechCorp Brasil',
    estado: estadoLookup.get(i) || 'São Paulo',
    cidade: cidadeLookup.get(i) || 'São Paulo',
  };
});

// ── Filter function ───────────────────────────────────────────
export function filterEmployeesByDemographic(category: string, rowLabel: string, baseEmployees: Employee[] = MOCK_EMPLOYEES): Employee[] {
  return baseEmployees.filter((emp) => {
    switch (category) {
      case 'Idade':
        if (rowLabel === '25 anos ou mais') {
          return emp.faixaIdade !== 'Sem resposta';
        }
        return emp.faixaIdade === rowLabel;

      case 'Tempo de Casa':
        return emp.tempoCasa === rowLabel;

      case 'Gênero':
        return emp.genero === rowLabel;

      case 'Cor ou Etnia':
        return emp.corEtnia === rowLabel;

      case 'Visto':
        return emp.visto === rowLabel;

      case 'Cidadania':
        return emp.cidadania === rowLabel;

      case 'Escolaridade':
        return emp.escolaridade === rowLabel;

      case 'Orientação Sexual':
        return emp.orientacaoSexual === rowLabel;

      case 'PCD':
        return emp.pcd === rowLabel;

      case 'Hardskills': {
        // rowLabel can be "JAVA" or "JAVA - Sênior"
        const parts = rowLabel.split(' - ');
        if (parts.length === 2) {
          const [skill, nivel] = parts;
          return emp.hardskills.some(h => h.skill === skill && h.nivel === nivel);
        }
        return emp.hardskills.some(h => h.skill === rowLabel);
      }

      case 'Softskills': {
        const ssParts = rowLabel.split(' - ');
        if (ssParts.length === 2) {
          const [ss, nivel] = ssParts;
          return emp.softskills.some(s => s.softskill === ss && s.nivel === nivel);
        }
        return emp.softskills.some(s => s.softskill === rowLabel);
      }

      case 'Metodologias': {
        const parts = rowLabel.split(' - ');
        if (parts.length === 2) {
          const [met, nivel] = parts;
          return emp.metodologias.some(m => m.metodologia === met && m.nivel === nivel);
        }
        return emp.metodologias.some(m => m.metodologia === rowLabel);
      }

      case 'Formações':
        return emp.formacao === rowLabel;

      case 'Idiomas': {
        const idParts = rowLabel.split(' - ');
        if (idParts.length === 2) {
          const [idioma, nivel] = idParts;
          return emp.idiomas.some(d => d.idioma === idioma && d.nivel === nivel);
        }
        return emp.idiomas.some(d => d.idioma === rowLabel);
      }

      case 'Local de Trabalho':
        return emp.localTrabalho === rowLabel;

      case 'Cargos':
        return emp.cargo === rowLabel;

      case 'Clientes':
        return emp.cliente === rowLabel;

      case 'Modalidade de trabalho':
        return emp.modalidadeTrabalho === rowLabel;

      case 'Certificações':
        return emp.certificacoes.includes(rowLabel);

      case 'Estado':
        return emp.estado === rowLabel;

      case 'Cidade':
        return emp.cidade === rowLabel;

      default:
        return true;
    }
  });
}

// ── Filter employees by bar filters ───────────────────────────
export function filterEmployees(
  employees: Employee[],
  _filterPessoas: FilterPessoas,
  filterStatus: StatusFilter,
  filterLocais: string[],
  _filterEmpresas: string[]
): Employee[] {
  let result = employees;

  if (filterStatus === 'ativos') {
    result = result.filter((e) => e.status === 'Ativo');
  } else if (filterStatus === 'inativos') {
    result = result.filter((e) => e.status === 'Inativo');
  }

  if (filterLocais.length > 0) {
    const selectedLabels = filterLocais.map((v) => {
      const opt = LOCAL_TRABALHO_OPTIONS.find((o) => o.value === v);
      return opt ? opt.label : v;
    });
    result = result.filter((e) => selectedLabels.includes(e.localTrabalho));
  }

  if (_filterEmpresas.length > 0) {
    const selectedEmpresaLabels = _filterEmpresas.map((v) => {
      const opt = EMPRESAS_OPTIONS.find((o) => o.value === v);
      return opt ? opt.label : v;
    });
    result = result.filter((e) => selectedEmpresaLabels.includes(e.empresa));
  }

  return result;
}

// ── Build demographic data from filtered employees ────────────
function countField(employees: Employee[], getter: (e: Employee) => string, orderedLabels?: string[]): DemographicRow[] {
  const counts = new Map<string, number>();
  for (const e of employees) {
    const val = getter(e);
    counts.set(val, (counts.get(val) || 0) + 1);
  }
  const total = employees.length || 1;

  if (orderedLabels) {
    return orderedLabels
      .map((label) => ({
        label,
        count: counts.get(label) || 0,
        percent: parseFloat((((counts.get(label) || 0) / total) * 100).toFixed(2)),
      }))
      .filter((r) => r.count > 0);
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({
      label,
      count,
      percent: parseFloat(((count / total) * 100).toFixed(2)),
    }))
    .filter((r) => r.count > 0);
}

function countMultiWithLevels<T>(
  employees: Employee[],
  getter: (e: Employee) => T[],
  nameGetter: (item: T) => string,
  levelGetter: (item: T) => string,
  levelOrder: string[]
): DemographicRow[] {
  const skillMap = new Map<string, Map<string, number>>();
  for (const e of employees) {
    for (const item of getter(e)) {
      const name = nameGetter(item);
      const level = levelGetter(item);
      if (!skillMap.has(name)) skillMap.set(name, new Map());
      const levels = skillMap.get(name)!;
      levels.set(level, (levels.get(level) || 0) + 1);
    }
  }
  const total = employees.length || 1;

  return Array.from(skillMap.entries())
    .map(([name, levels]) => {
      const count = Array.from(levels.values()).reduce((a, b) => a + b, 0);
      const children: DemographicRow[] = levelOrder
        .map((l) => ({
          label: l,
          count: levels.get(l) || 0,
          percent: parseFloat((((levels.get(l) || 0) / (count || 1)) * 100).toFixed(2)),
        }))
        .filter((r) => r.count > 0);
      return {
        label: name,
        count,
        percent: parseFloat(((count / total) * 100).toFixed(2)),
        expandable: true,
        children,
      };
    })
    .sort((a, b) => b.count - a.count)
    .filter((r) => r.count > 0);
}

export function buildDemographicDataFromEmployees(employees: Employee[]): Record<string, DemographicGroup> {
  const total = employees.length;

  // Idade — special: "25 anos ou mais" is an aggregate
  const idadeRows = countField(employees, (e) => e.faixaIdade, ['Sem resposta', 'De 25 até 35', 'De 35 até 45', 'De 45 até 55', 'Acima de 55']);
  const maisQue25 = idadeRows.filter((r) => r.label !== 'Sem resposta').reduce((s, r) => s + r.count, 0);
  if (maisQue25 > 0) {
    idadeRows.splice(1, 0, {
      label: '25 anos ou mais',
      count: maisQue25,
      percent: parseFloat(((maisQue25 / (total || 1)) * 100).toFixed(2)),
    });
  }

  const result: Record<string, DemographicGroup> = {
    Idade: { category: 'Idade', totalCount: total, rows: idadeRows },
    'Tempo de Casa': { category: 'Tempo de Casa', totalCount: total, rows: countField(employees, (e) => e.tempoCasa, ['Até 1 ano', 'De 1 a 2 anos', 'De 2 a 5 anos', 'De 5 a 10 anos', 'De 10 a 15 anos', 'De 15 a 20 anos']) },
    Gênero: { category: 'Gênero', totalCount: total, rows: countField(employees, (e) => e.genero, ['Sem resposta', 'Homem Cisgênero', 'Mulher Cisgênero', 'Transgênero', 'Não Binária', 'Outro']) },
    'Cor ou Etnia': { category: 'Cor ou Etnia', totalCount: total, rows: countField(employees, (e) => e.corEtnia, ['Sem resposta', 'Branca', 'Parda', 'Preta', 'Amarela']) },
    Visto: { category: 'Visto', totalCount: total, rows: countField(employees, (e) => e.visto, ['Sem visto', 'Visto de Trabalho', 'Visto Permanente']) },
    Cidadania: { category: 'Cidadania', totalCount: total, rows: countField(employees, (e) => e.cidadania) },
    Escolaridade: { category: 'Escolaridade', totalCount: total, rows: countField(employees, (e) => e.escolaridade) },
    'Orientação Sexual': { category: 'Orientação Sexual', totalCount: total, rows: countField(employees, (e) => e.orientacaoSexual, ['Sem resposta', 'Heterossexual', 'Homossexual', 'Bissexual']) },
    PCD: { category: 'PCD', totalCount: total, rows: countField(employees, (e) => e.pcd, ['Deficiência Física', 'Deficiência Auditiva', 'Deficiência Visual', 'Deficiência Mental', 'Deficiência Múltipla', 'Pessoas com Autismo', 'Não declarado']) },
    Hardskills: {
      category: 'Hardskills', totalCount: total, expandable: true,
      rows: countMultiWithLevels(employees, (e) => e.hardskills, (h) => h.skill, (h) => h.nivel, SENIORITY_LEVELS),
    },
    Softskills: {
      category: 'Softskills', totalCount: total, expandable: true,
      rows: countMultiWithLevels(employees, (e) => e.softskills, (s) => s.softskill, (s) => s.nivel, SOFTSKILL_LEVELS),
    },
    Metodologias: {
      category: 'Metodologias', totalCount: total, expandable: true,
      rows: countMultiWithLevels(employees, (e) => e.metodologias, (m) => m.metodologia, (m) => m.nivel, SENIORITY_LEVELS),
    },
    Formações: { category: 'Formações', totalCount: total, rows: countField(employees, (e) => e.formacao) },
    Idiomas: {
      category: 'Idiomas', totalCount: total, expandable: true,
      rows: countMultiWithLevels(employees, (e) => e.idiomas, (d) => d.idioma, (d) => d.nivel, IDIOMA_LEVELS),
    },
    'Local de Trabalho': { category: 'Local de Trabalho', totalCount: total, rows: countField(employees, (e) => e.localTrabalho) },
    Cargos: { category: 'Cargos', totalCount: total, rows: countField(employees, (e) => e.cargo) },
    Clientes: { category: 'Clientes', totalCount: total, rows: countField(employees, (e) => e.cliente) },
    'Modalidade de trabalho': { category: 'Modalidade de trabalho', totalCount: total, rows: countField(employees, (e) => e.modalidadeTrabalho) },
    Certificações: {
      category: 'Certificações', totalCount: total,
      rows: (() => {
        const counts = new Map<string, number>();
        for (const e of employees) {
          for (const c of e.certificacoes) {
            counts.set(c, (counts.get(c) || 0) + 1);
          }
        }
        return Array.from(counts.entries())
          .sort((a, b) => b[1] - a[1])
          .map(([label, count]) => ({
            label,
            count,
            percent: parseFloat(((count / (total || 1)) * 100).toFixed(2)),
          }))
          .filter((r) => r.count > 0);
      })(),
    },
    Estado: { category: 'Estado', totalCount: total, rows: countField(employees, (e) => e.estado) },
    Cidade: { category: 'Cidade', totalCount: total, rows: countField(employees, (e) => e.cidade) },
  };

  return result;
}
