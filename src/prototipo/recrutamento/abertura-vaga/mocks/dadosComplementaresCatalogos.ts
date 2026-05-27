/** Mock — paridade com catálogos do MovimentacaoVagaModal (fourmakers-v2) */

export const EMAIL_ONEPAGE_PADRAO = "talentacquisition@foursys.com.br";

export const COLABORADORES_INTERNO_MOCK = [
  { id: "g1", nome: "João Marcos", email: "joao.marcos@foursys.com.br" },
  { id: "g2", nome: "Ana Paula Ribeiro", email: "ana.ribeiro@foursys.com.br" },
  { id: "g3", nome: "Carlos Mendes", email: "carlos.mendes@foursys.com.br" },
  { id: "g4", nome: "Fernanda Lima", email: "fernanda.lima@foursys.com.br" },
] as const;

export const TIPOS_VAGA_MOCK = [
  { id: "tv1", descricao: "Nova posição" },
  { id: "tv2", descricao: "Substituição" },
  { id: "tv3", descricao: "Aumento de quadro" },
] as const;

export const TIPOS_CONTRATACAO_MOCK = [
  { id: "tc1", descricao: "CLT" },
  { id: "tc2", descricao: "PJ" },
  { id: "tc3", descricao: "Temporário" },
] as const;

export const UNIDADES_MOCK = [
  { id: "u1", descricao: "ONESYS" },
  { id: "u2", descricao: "Foursys — SP" },
  { id: "u3", descricao: "Foursys — Remoto BR" },
] as const;

export const MAQUINAS_MOCK = ["Foursys", "Cliente"] as const;

export const DESCRICAO_VAGA_MOCK = `Na Foursys, somos apaixonados por inovação, design e transformação digital. Somos uma empresa global, certificada GPTW, que acredita no poder da tecnologia para transformar negócios e vidas.

Temos um compromisso com a diversidade e inclusão: PCD, gênero, religião, origem ou qualquer outro aspecto não são barreiras para fazer parte do nosso time.

Que tal se juntar a nós e se tornar um(a) #FourTalent? Então se liga nessa oportunidade incrível:`;
