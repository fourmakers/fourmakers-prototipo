import type { HeatmapInsight } from "./types";
import { heatmapAssetUrl } from "./heatmapAssets";

const HEATMAP_CRIAR_VAGA = heatmapAssetUrl("recrutamento-criar-vaga-ia.png");

export const DEFAULT_RECRUITMENT_HEATMAPS: HeatmapInsight[] = [
  {
    id: "criar-vaga-form",
    titulo: "Formulário completo — Criar vaga",
    pagina: "Criar vaga (perfil completo)",
    imagemUrl: HEATMAP_CRIAR_VAGA,
    metricas: [
      { label: "Views", valor: "91" },
      { label: "Sessões", valor: "63" },
      { label: "Tempo médio", valor: "5min 53s" },
      { label: "Bounce rate", valor: "42,9%", destaque: "warning" },
      { label: "Exit rate", valor: "9,89%", destaque: "positive" },
      { label: "Scroll rate", valor: "84,5%", destaque: "positive" },
    ],
    observacao:
      "Calor intenso em Hard/Soft Skills, campo Custo (R$) e Identificação. Usuários percorrem o formulário extenso (2.553px) com foco em skills obrigatórias e investimento da vaga.",
  },
  {
    id: "criar-com-ia",
    titulo: "Geração por IA",
    pagina: "Criar vaga — Gerar com IA",
    imagemUrl: HEATMAP_CRIAR_VAGA,
    metricas: [
      { label: "Cliques", valor: "27" },
      { label: "% dos cliques", valor: "2,87%" },
      { label: "Área «Descreva o perfil»", valor: "Cluster de calor" },
      { label: "Hard/Soft Skills", valor: "Hotspots nos ícones +" },
    ],
    observacao:
      "Cluster visível no textarea «Descreva o perfil» e no botão «Gerar com IA». Ícones de skills e campos LinkedIn/Desafios também concentram interação — fluxo híbrido IA + curadoria manual.",
  },
  {
    id: "salvar-vaga",
    titulo: "Conclusão — Salvar vaga",
    pagina: "Rodapé do formulário de criação",
    imagemUrl: HEATMAP_CRIAR_VAGA,
    metricas: [
      { label: "Cliques em Salvar", valor: "77" },
      { label: "% dos cliques", valor: "8,17%", destaque: "positive" },
      { label: "Campos LinkedIn/Desafios", valor: "Edição manual frequente" },
    ],
    observacao:
      "Hotspot no canto inferior direito (Salvar). Campos de texto para LinkedIn e Desafios mostram cliques dispersos — recrutadores editam conteúdo gerado pela IA antes de publicar.",
  },
];
