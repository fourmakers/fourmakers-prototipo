import { useState } from "react";
import { Bot, Radar, Route, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CandidatoAnalise } from "../types";
import { CriterioRadarChart } from "./CriterioRadarChart";
import { RadarProfissionalDrawer } from "./RadarProfissionalDrawer";

interface CandidatoDetalhePanelProps {
  candidato: CandidatoAnalise;
}

export function CandidatoDetalhePanel({ candidato }: CandidatoDetalhePanelProps) {
  const [radarOpen, setRadarOpen] = useState(false);

  return (
    <section className="space-y-6 border-t border-borderSoft pt-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-primaryText">Parecer — {candidato.nome}</h3>
          <p className="text-sm text-secondaryText">{candidato.cargoAtual}</p>
        </div>
        <Button
          type="button"
          size="sm"
          className="shrink-0 border-0 analise-brand-gradient text-white shadow-[0_4px_20px_rgba(154,27,255,0.35)] hover:opacity-90"
          onClick={() => setRadarOpen(true)}
        >
          <Radar className="size-4" aria-hidden />
          Radar Profissional
        </Button>
      </div>

      <RadarProfissionalDrawer candidato={candidato} open={radarOpen} onOpenChange={setRadarOpen} />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-borderSoft bg-secondaryBackground p-4 analise-glow-card">
          <CriterioRadarChart
            criterios={candidato.criterios}
            candidatoNome={candidato.nome.split(" ")[0]}
            cargo={candidato.cargoAtual}
          />
        </div>

        <div className="overflow-x-auto rounded-2xl border border-borderSoft">
          <table className="w-full min-w-[320px] text-left text-sm">
            <thead>
              <tr className="border-b border-borderSoft bg-surfaceSubtle text-xs uppercase tracking-wide text-secondaryText">
                <th className="px-3 py-2 font-semibold">Critério</th>
                <th className="px-3 py-2 font-semibold">Nota</th>
                <th className="px-3 py-2 font-semibold">Desafio da vaga</th>
              </tr>
            </thead>
            <tbody>
              {candidato.criterios.map((cr) => (
                <tr key={cr.id} className="border-b border-borderSoft last:border-0">
                  <td className="px-3 py-2.5 font-medium text-primaryText">{cr.nome}</td>
                  <td className="px-3 py-2.5">
                    <Badge variant="outline" className="font-bold">
                      {cr.nota}/{cr.maxNota}
                    </Badge>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-secondaryText">{cr.desafioVaga}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-primaryText">
          <Target className="size-4 text-accent" aria-hidden />
          Como cumpre os desafios (e gaps)
        </h4>
        {candidato.criterios.map((cr) => (
          <div
            key={cr.id}
            className="rounded-xl border border-borderSoft bg-surfaceSubtle/80 p-4 transition-all hover:border-accent/40"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold text-primaryText">{cr.nome}</span>
              <span className="text-sm font-bold text-accent">
                {cr.nota}/{cr.maxNota}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-secondaryText">
              <strong className="text-primaryText">Evidência:</strong> {cr.comoCumpre}
            </p>
            {cr.gap && (
              <p className="mt-1 text-xs text-warning">
                <strong>Gap:</strong> {cr.gap}
              </p>
            )}
            {cr.pdi && (
              <p className="mt-2 rounded-lg bg-accentSoft/60 px-3 py-2 text-xs text-primaryText">
                <strong>PDI sugerido:</strong> {cr.pdi}
              </p>
            )}
            {cr.complementoIa && (
              <p className="mt-2 flex items-start gap-2 rounded-lg bg-infoSoft/50 px-3 py-2 text-xs text-primaryText">
                <Bot className="mt-0.5 size-3.5 shrink-0 text-info" aria-hidden />
                <span>
                  <strong>Complemento IA:</strong> {cr.complementoIa}
                </span>
              </p>
            )}
          </div>
        ))}
      </div>

      <div>
        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-primaryText">
          <Route className="size-4 text-accentSecondary" aria-hidden />
          Trajetória profissional possível
        </h4>
        <ol className="relative space-y-4 border-l-2 border-accent/30 pl-6">
          {candidato.trajetoria.map((t) => (
            <li key={t.fase} className="relative">
              <span className="absolute -left-[1.65rem] top-1 size-3 rounded-full bg-accent ring-4 ring-accentSoft" />
              <span className="text-xs font-bold uppercase tracking-wide text-accent">{t.fase}</span>
              <p className="mt-0.5 text-sm text-secondaryText">{t.descricao}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
