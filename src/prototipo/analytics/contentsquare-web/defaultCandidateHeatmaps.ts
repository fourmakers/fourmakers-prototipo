import type { HeatmapInsight } from "./types";
import { heatmapAssetUrl } from "./heatmapAssets";

export const DEFAULT_CANDIDATE_HEATMAPS: HeatmapInsight[] = [
  {
    id: "inscricao-form",
    titulo: "Formulário de inscrição",
    pagina: "Dados para vaga — Etapa 2/3",
    imagemUrl: heatmapAssetUrl("candidato-inscricao-vaga.png"),
    metricas: [
      { label: "Views", valor: "387" },
      { label: "Sessões", valor: "235" },
      { label: "Tempo médio", valor: "3min 27s" },
      { label: "Bounce rate", valor: "37,1%", destaque: "warning" },
      { label: "Exit rate", valor: "27,4%", destaque: "warning" },
      { label: "Scroll rate", valor: "97,6%", destaque: "positive" },
    ],
    observacao:
      "CPF, CEP, pretensão salarial e competências concentram calor. Radio buttons de skills («Sim, já possuo…») e botão «Realizar inscrição» são os hotspots de maior intensidade.",
  },
  {
    id: "upload-cv",
    titulo: "Atualização de perfil via CV",
    pagina: "Etapa 3 — Atualize seu perfil",
    imagemUrl: heatmapAssetUrl("candidato-atualizar-cv.png"),
    metricas: [
      { label: "Cliques no upload PDF", valor: "82" },
      { label: "% dos cliques", valor: "12,02%", destaque: "positive" },
      { label: "Choose File", valor: "Hotspot principal" },
      { label: "Mensagem sucesso", valor: "Inscrição realizada!" },
    ],
    observacao:
      "«Choose File» é o ponto mais quente da tela. «Acessar plataforma» e a mensagem de sucesso também concentram cliques — upload de CV é diferencial percebido pelos candidatos.",
  },
  {
    id: "checkbox-termos",
    titulo: "Confirmação de competências",
    pagina: "Etapa 2 — Atualize suas competências",
    imagemUrl: heatmapAssetUrl("candidato-inscricao-vaga.png"),
    metricas: [
      { label: "Cliques", valor: "104" },
      { label: "% dos cliques", valor: "5,52%" },
      { label: "Radio «Sim, já possuo»", valor: "Hotspots vermelhos" },
    ],
    observacao:
      "Alto volume de cliques nos radio buttons de confirmação de skills — candidatos validam competências sugeridas antes de concluir a inscrição.",
  },
];
