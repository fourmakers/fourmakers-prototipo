/** Catálogos mock — paridade simplificada com Perfil de atuação (fourmakers-v2) */

export const HARD_SKILLS_SUGERIDAS = [
  "React",
  "TypeScript",
  "Node.js",
  "SQL",
  "Comunicação",
  "Gestão de projetos",
  "Excel avançado",
  "Power BI",
] as const;

export const MODELOS_TRABALHO = [
  { value: "presencial" as const, title: "Presencial", subtitle: "Atuação no escritório do cliente" },
  { value: "hibrido" as const, title: "Híbrido", subtitle: "Dias presenciais + remoto" },
  { value: "remoto" as const, title: "Remoto", subtitle: "100% remoto" },
];

export const NIVEIS_EXPERIENCIA = [
  { value: "junior" as const, label: "Júnior" },
  { value: "pleno" as const, label: "Pleno" },
  { value: "senior" as const, label: "Sênior" },
  { value: "especialista" as const, label: "Especialista" },
];

export const TIPOS_EMPREGO = [
  { value: "clt" as const, label: "CLT" },
  { value: "pj" as const, label: "PJ" },
  { value: "temporario" as const, label: "Temporário" },
];

export const PERMANENCIAS = [
  { value: "determinado" as const, label: "Prazo determinado" },
  { value: "indeterminado" as const, label: "Indeterminado" },
];

export const PRIORIDADES = [
  { value: "baixa" as const, label: "Baixa", subtitle: "Prazo flexível" },
  { value: "media" as const, label: "Média", subtitle: "Prazo padrão do funil" },
  { value: "alta" as const, label: "Alta", subtitle: "Priorizar no dashboard" },
  { value: "critica" as const, label: "Crítica", subtitle: "Substituição urgente" },
];
