/**
 * Simula respostas do agente no hub de protótipos.
 * Em produção a IA vive no backend; aqui só replicamos UX e sequência de 9 etapas.
 */

const MSG_INICIAL = `Olá! Eu sou o agente do Fourmakers. Aqui a gente tira as pessoas da invisibilidade — revela quem você é além do cargo que ocupa hoje. Essa conversa não é sobre performance; é sobre quem você já é.

Antes de começar, me conta uma coisa: quando você não está trabalhando, o que você faz que te faz perder a noção do tempo?`;

const RESPOSTAS_POS_USUARIO: Record<
  number,
  { raw: string; delayMs?: number }
> = {
  1: {
    raw: `Que delícia saber disso! Obrigado por compartilhar.

Me conta brevemente o que você faz hoje profissionalmente. Pode ser do jeito que descreveria para um amigo.`,
  },
  2: {
    raw: `Entendi. Obrigado pela sinceridade.

Me conta mais sobre o seu dia a dia real: quais problemas você resolve, que decisões toma, com quem trabalha e o que você entrega de concreto.`,
  },
  3: {
    raw: `Faz sentido tudo que você descreveu — dá para ver como você se movimenta no trabalho. Agora quero te convidar a escolher valores que representam quem você é, não só o que faz.

[SHOW_VALUES]`,
  },
  4: {
    raw: `Obrigado por trazer esses valores com tanta clareza — combina muito com o que você já me contou.

Me conta de um momento no trabalho em que você estava tão absorvida no que fazia que perdeu a noção do tempo. O que estava fazendo?`,
  },
  5: {
    raw: `Obrigado por abrir esse momento comigo.

Agora me conta o oposto: uma situação em que você se sentiu completamente fora do lugar — não por falta de competência, mas porque algo ali simplesmente não era você. O que estava acontecendo?`,
  },
  6: {
    raw: `Isso ajuda a enxergar o contraste.

Se você pudesse redesenhar seu trabalho do zero — mantendo só o que te dá energia e descartando o resto — o que ficaria?`,
  },
  7: {
    raw: `Belo redesenho.

Olhando para seus valores e para tudo que você me contou — onde você sente o maior gap entre quem você é e o que você faz todo dia?`,
  },
  8: {
    raw: `Você é alguém que une propósito e cuidado: busca impacto sem abrir mão de ser verdadeira com quem é. O que você descreveu mostra alguém que floresce quando pode criar com autonomia e ver resultado no olho das pessoas — e que sofre quando o ambiente não reconhece isso.

Esse perfil brilha em times que valorizam escuta, experimentação segura e espaço para liderar sem hierarquia rígida. Você tende a prosperar onde propósito e rotina caminham juntos.

Quando olhamos para o que você faz hoje e para o que te move, aparece um espaço gentil para aproximar função e identidade — sem pressa, com curiosidade.

Isso representa quem você é?

[TECNICAS: Facilitação de workshops, Priorização de backlog, Métricas de produto, Documentação funcional, Colaboração multidisciplinar]
[COMPORTAMENTAIS: Escuta ativa, Pensamento sistêmico, Comunicação empática, Influência sem autoridade, Aprendizado contínuo]
[CARGOS: Product Owner, Analista de Negócios, People Partner de Produto, Consultor de Inovação, Gestor de Projetos Ágeis]`,
  },
};

export function getMensagemInicialMock(): string {
  return MSG_INICIAL;
}

/**
 * @param indiceResposta — número do turno do utilizador após a mensagem inicial (1 = primeira resposta livre, 4 = após confirmação de valores).
 */
export function getRespostaAssistenteMock(indiceResposta: number): string {
  const r = RESPOSTAS_POS_USUARIO[indiceResposta];
  return r?.raw ?? "";
}
