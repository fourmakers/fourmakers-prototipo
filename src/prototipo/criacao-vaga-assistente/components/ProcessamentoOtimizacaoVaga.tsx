import { useEffect, useState } from "react";
import { Briefcase, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const ETAPAS = [
  "Analisando cliente, gestor e contexto organizacional",
  "Cruzando momento de mercado e benchmarks de retenção",
  "Gerando desafios e objetivos mensuráveis da posição",
  "Definindo critérios de match (aderência + anti-churn)",
  "Montando hierarquia de pesos e skills imprescindíveis",
  "Consolidando vaga otimizada para triagem",
];

interface ProcessamentoOtimizacaoVagaProps {
  onComplete: () => void;
}

export function ProcessamentoOtimizacaoVaga({ onComplete }: ProcessamentoOtimizacaoVagaProps) {
  const [etapaAtiva, setEtapaAtiva] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    ETAPAS.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          if (cancelled) return;
          setEtapaAtiva(i);
          if (i === ETAPAS.length - 1) {
            timers.push(setTimeout(() => !cancelled && onComplete(), 900));
          }
        }, (i + 1) * 1000),
      );
    });
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [onComplete]);

  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center px-4 py-12">
      <div className="analise-pulse-ring relative mb-8 flex size-20 items-center justify-center rounded-full analise-brand-gradient shadow-[0_0_40px_rgba(154,27,255,0.35)]">
        <Briefcase className="size-9 text-white" aria-hidden />
      </div>
      <h2 className="analise-brand-gradient-text text-xl font-bold">Otimizando vaga com IA</h2>
      <p className="mt-2 max-w-md text-center text-sm text-secondaryText">
        Estruturando desafios, contexto e critérios de match para reduzir churn e melhorar aderência na triagem.
      </p>
      <ul className="mt-8 w-full max-w-lg space-y-3">
        {ETAPAS.map((texto, i) => (
          <li
            key={texto}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all duration-500",
              i <= etapaAtiva ? "analise-glass analise-glow-card text-primaryText" : "text-secondaryText opacity-50",
            )}
          >
            {i < etapaAtiva ? (
              <Sparkles className="size-4 shrink-0 text-accent" aria-hidden />
            ) : i === etapaAtiva ? (
              <Loader2 className="size-4 shrink-0 animate-spin text-accent" aria-hidden />
            ) : (
              <span className="size-4 shrink-0 rounded-full border border-borderDefault" aria-hidden />
            )}
            {texto}
          </li>
        ))}
      </ul>
      <div className="mt-8 h-2 w-full max-w-md overflow-hidden rounded-full bg-surfaceSubtle">
        <div
          className="h-full rounded-full analise-shimmer transition-all duration-500"
          style={{ width: `${((etapaAtiva + 1) / ETAPAS.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
