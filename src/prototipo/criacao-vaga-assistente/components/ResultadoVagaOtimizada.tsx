import { useState } from "react";
import {
  AlertTriangle,
  Eye,
  Layers,
  ShieldCheck,
  Target,
  TrendingDown,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { VagaOtimizadaResultado } from "../types";
import { VagaPublicaPreviewDrawer } from "./VagaPublicaPreviewDrawer";

interface ResultadoVagaOtimizadaProps {
  resultado: VagaOtimizadaResultado;
}

export function ResultadoVagaOtimizada({ resultado }: ResultadoVagaOtimizadaProps) {
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-2xl analise-brand-gradient p-[1px]">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-secondaryBackground px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-accent">Vaga otimizada</p>
            <h2 className="mt-1 text-xl font-bold text-primaryText">{resultado.tituloSugerido}</h2>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold analise-brand-gradient-text">{resultado.scoreQualidade}%</p>
            <p className="text-[10px] uppercase tracking-wide text-secondaryText">Score de qualidade</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="analise-glass analise-glow-card rounded-2xl p-5">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-primaryText">
            <Users className="size-4 text-accent" aria-hidden />
            Contexto cliente e gestor
          </h3>
          <p className="text-xs leading-relaxed text-secondaryText">{resultado.contextoCliente}</p>
          <p className="mt-3 border-t border-borderSoft pt-3 text-xs leading-relaxed text-secondaryText">
            {resultado.contextoGestor}
          </p>
        </div>
        <div className="analise-glass analise-glow-card rounded-2xl p-5">
          <h3 className="mb-2 text-sm font-semibold text-primaryText">Momento de mercado</h3>
          <p className="text-xs leading-relaxed text-secondaryText">{resultado.momentoMercado}</p>
          {resultado.pdiOrganizacional && (
            <p className="mt-3 rounded-lg bg-accentSoft/50 px-3 py-2 text-xs text-primaryText">
              <strong>PDI organizacional:</strong> {resultado.pdiOrganizacional}
            </p>
          )}
        </div>
      </div>

      <section className="rounded-2xl border border-borderSoft p-5">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-primaryText">
          <Layers className="size-4 text-accent" aria-hidden />
          Hierarquia do match
        </h3>
        <p className="mb-4 text-xs text-secondaryText">
          Pesos sugeridos para triagem — alinhado ao protótipo Desafio/Match do Perfil de atuação e à Análise de
          aderência.
        </p>
        <ul className="space-y-3">
          {resultado.hierarquiaMatch.map((h) => (
            <li key={h.label}>
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-primaryText">{h.label}</span>
                <span className="font-bold text-accent">{h.peso}%</span>
              </div>
              <Progress value={h.peso} className="mt-1 h-2" />
              <p className="mt-0.5 text-[11px] text-secondaryText">{h.descricao}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-borderSoft p-5">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-primaryText">
          <Target className="size-4 text-accent" aria-hidden />
          Desafios da posição
        </h3>
        <ul className="space-y-2">
          {resultado.desafios.map((d, i) => (
            <li
              key={d}
              className="flex gap-2 rounded-xl border border-borderSoft bg-surfaceSubtle/60 px-3 py-2 text-xs text-primaryText"
            >
              <span className="font-bold text-accent">{i + 1}.</span>
              {d}
            </li>
          ))}
        </ul>
        <p className="mt-4 rounded-xl bg-surfaceSubtle p-3 text-xs leading-relaxed text-secondaryText">
          <strong className="text-primaryText">Texto consolidado:</strong> {resultado.textoDesafioConsolidado}
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-borderSoft p-5">
          <h3 className="mb-2 text-sm font-semibold text-primaryText">Objetivos</h3>
          <ul className="list-disc space-y-1 pl-4 text-xs text-secondaryText">
            {resultado.objetivos.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl border border-borderSoft p-5">
          <h3 className="mb-2 text-sm font-semibold text-primaryText">Insights para triagem</h3>
          <ul className="space-y-2">
            {resultado.insightsTriagem.map((ins) => (
              <li
                key={ins}
                className="rounded-lg border-l-4 border-accent bg-accentSoft/40 px-3 py-2 text-xs text-primaryText"
              >
                {ins}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border border-warningBorder bg-warningSoft/25 p-5">
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-primaryText">
          <TrendingDown className="size-4 text-warning" aria-hidden />
          Anti-churn e retenção
        </h3>
        <ul className="space-y-2">
          {resultado.antiChurn.map((a) => (
            <li key={a} className="flex gap-2 text-xs text-secondaryText">
              <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-warning" aria-hidden />
              {a}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-accent/30 bg-accentSoft/20 p-5">
        <h3 className="mb-3 text-sm font-semibold text-primaryText">
          Critérios para Análise de aderência (≥6)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-xs">
            <thead>
              <tr className="border-b border-borderSoft text-secondaryText">
                <th className="py-2 pr-2 font-semibold">Critério</th>
                <th className="py-2 pr-2 font-semibold">Peso</th>
                <th className="py-2 pr-2 font-semibold">Desafio</th>
                <th className="py-2 font-semibold">Evidência esperada</th>
              </tr>
            </thead>
            <tbody>
              {resultado.criteriosAderencia.map((cr) => (
                <tr key={cr.id} className="border-b border-borderSoft last:border-0">
                  <td className="py-2 pr-2 font-medium text-primaryText">{cr.nome}</td>
                  <td className="py-2 pr-2">
                    <Badge variant="outline">{cr.peso}/5</Badge>
                  </td>
                  <td className="py-2 pr-2 text-secondaryText">{cr.desafioVaga}</td>
                  <td className="py-2 text-secondaryText">{cr.evidenciaEsperada}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-borderSoft p-5">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-primaryText">
          <ShieldCheck className="size-4 text-success" aria-hidden />
          Skills sugeridas
        </h3>
        <div className="flex flex-wrap gap-2">
          {resultado.skillsSugeridas.map((s) => (
            <Badge
              key={s.nome}
              variant={s.relevante ? "default" : "secondary"}
              className="text-xs"
            >
              {s.nome} · {s.nivel}
              {s.relevante ? " · impresc." : " · desej."}
            </Badge>
          ))}
        </div>
      </section>

      <div className="border-t border-borderSoft pt-6">
        <Button
          type="button"
          className="gap-2 rounded-full analise-brand-gradient border-0 text-white shadow-lg hover:opacity-95"
          onClick={() => setPreviewOpen(true)}
        >
          <Eye className="size-4" aria-hidden />
          Preview da vaga
        </Button>
      </div>

      <VagaPublicaPreviewDrawer
        resultado={resultado}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </div>
  );
}
