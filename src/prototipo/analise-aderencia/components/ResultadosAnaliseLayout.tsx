import { useEffect, useRef, useState } from "react";
import { BarChart3, Users } from "lucide-react";
import type { CandidatoAnalise, PanoramaVaga, ResultadoAnaliseAderencia, VagaAnalise } from "../types";
import { PanoramaVagaSection } from "./PanoramaVagaSection";
import { RankingCandidatos } from "./RankingCandidatos";
import { RankingPocketFloat } from "./RankingPocketFloat";
import { CandidatoDetalhePanel } from "./CandidatoDetalhePanel";

interface ResultadosAnaliseLayoutProps {
  vaga: VagaAnalise;
  resultado: ResultadoAnaliseAderencia;
  candidatoSelecionado: CandidatoAnalise | undefined;
  candidatoSelecionadoId: string | null;
  onSelectCandidato: (id: string) => void;
}

export function ResultadosAnaliseLayout({
  vaga,
  resultado,
  candidatoSelecionado,
  candidatoSelecionadoId,
  onSelectCandidato,
}: ResultadosAnaliseLayoutProps) {
  const rankingRef = useRef<HTMLDivElement>(null);
  const [pocketVisible, setPocketVisible] = useState(false);

  const mediaAderencia = Math.round(
    resultado.candidatos.reduce((s, c) => s + c.aderenciaGeral, 0) / resultado.candidatos.length,
  );

  useEffect(() => {
    const el = rankingRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setPocketVisible(!entry.isIntersecting),
      { root: null, rootMargin: "-8px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid gap-6 overflow-visible lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start">
        <div className="space-y-4 min-w-0">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="analise-glass analise-glow-card rounded-2xl p-4">
              <div className="flex items-center gap-2 text-accent">
                <Users className="size-4" aria-hidden />
                <span className="text-[10px] font-bold uppercase tracking-wider">Triagem</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-primaryText">{resultado.candidatos.length}</p>
              <p className="text-xs text-secondaryText">candidatos analisados</p>
            </div>
            <div className="analise-glass analise-glow-card rounded-2xl p-4">
              <div className="flex items-center gap-2 text-accent">
                <BarChart3 className="size-4" aria-hidden />
                <span className="text-[10px] font-bold uppercase tracking-wider">Média</span>
              </div>
              <p className="mt-2 text-2xl font-bold analise-brand-gradient-text">{mediaAderencia}%</p>
              <p className="text-xs text-secondaryText">aderência geral do lote</p>
            </div>
          </div>

          <PanoramaVagaSection vaga={vaga} panorama={resultado.panorama} />
        </div>

        <div ref={rankingRef} className="min-w-0 overflow-visible px-0.5 lg:sticky lg:top-6">
          <RankingCandidatos
            candidatos={resultado.candidatos}
            selecionadoId={candidatoSelecionadoId}
            onSelect={onSelectCandidato}
            compact
          />
        </div>
      </div>

      <RankingPocketFloat
        candidatos={resultado.candidatos}
        selecionadoId={candidatoSelecionadoId}
        onSelect={onSelectCandidato}
        visible={pocketVisible}
      />

      {candidatoSelecionado && (
        <div id="parecer-candidato" className="scroll-mt-6">
          <CandidatoDetalhePanel candidato={candidatoSelecionado} />
        </div>
      )}
    </div>
  );
}
