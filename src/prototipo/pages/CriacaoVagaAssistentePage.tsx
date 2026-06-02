import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  EntradaCriacaoVagaPanel,
  podeOtimizarVaga,
} from "@/prototipo/criacao-vaga-assistente/components/EntradaCriacaoVagaPanel";
import { ProcessamentoOtimizacaoVaga } from "@/prototipo/criacao-vaga-assistente/components/ProcessamentoOtimizacaoVaga";
import { ResultadoVagaOtimizada } from "@/prototipo/criacao-vaga-assistente/components/ResultadoVagaOtimizada";
import { buildVagaOtimizadaMock } from "@/prototipo/criacao-vaga-assistente/mocks/otimizarVagaMock";
import type { EntradaFormularioVaga, ModoEntradaVaga, VagaOtimizadaResultado } from "@/prototipo/criacao-vaga-assistente/types";
import "@/prototipo/analise-aderencia/analiseAderencia.css";

type View = "setup" | "processing" | "results";

const FORM_INICIAL: EntradaFormularioVaga = {
  cliente: "",
  gestor: "",
  tituloVaga: "",
  modeloTrabalho: "",
  contextoBreve: "",
};

export function CriacaoVagaAssistentePage() {
  const [view, setView] = useState<View>("setup");
  const [modo, setModo] = useState<ModoEntradaVaga>("prompt");
  const [form, setForm] = useState<EntradaFormularioVaga>(FORM_INICIAL);
  const [prompt, setPrompt] = useState("");
  const [resultado, setResultado] = useState<VagaOtimizadaResultado | null>(null);

  const podeOtimizar = podeOtimizarVaga(modo, form, prompt);

  const handleOtimizar = () => {
    if (!podeOtimizar) return;
    setView("processing");
    setResultado(null);
  };

  const handleComplete = useCallback(() => {
    setResultado(buildVagaOtimizadaMock(modo, form, prompt));
    setView("results");
  }, [modo, form, prompt]);

  const handleNova = () => {
    setView("setup");
    setResultado(null);
  };

  return (
    <div className="mx-auto w-full max-w-5xl pb-12">
      <header className="mb-8">
        <nav
          className="mb-3 flex flex-wrap items-center gap-1.5 text-xs text-secondaryText"
          aria-label="Breadcrumb"
        >
          <span>Recrutamento</span>
          <ChevronRight className="size-3 shrink-0 opacity-60" aria-hidden />
          <span className="font-medium text-primaryText">Assistente de criação de vaga</span>
        </nav>
        <div className="overflow-hidden rounded-2xl analise-brand-gradient p-[1px]">
          <div className="rounded-2xl bg-secondaryBackground px-6 py-8 md:px-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                  Match perfeito · anti-churn
                </p>
                <h1 className="mt-2 text-2xl font-bold md:text-3xl">
                  <span className="analise-brand-gradient-text">Assistente de criação de vaga</span>
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-secondaryText">
                  Otimize vagas com IA: preencha o formulário (perfil de atuação) ou descreva em um prompt. Gere
                  contexto, desafios, critérios de aderência e recomendações para reduzir churn e melhorar o fit na
                  triagem — integrado à Análise de aderência.
                </p>
              </div>
              {view === "results" && (
                <Button type="button" variant="outline" className="gap-2 rounded-full" onClick={handleNova}>
                  <RotateCcw className="size-4" aria-hidden />
                  Nova otimização
                </Button>
              )}
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-secondaryText">
          <Link to="/" className="font-medium text-accent hover:underline">
            ← Hub de protótipos
          </Link>
          <span className="mx-2">·</span>
          <Link to="/analise-aderencia" className="font-medium text-accent hover:underline">
            Análise de aderência
          </Link>
          <span className="mx-2">·</span>
          Protótipo — respostas simuladas.
        </p>
      </header>

      {view === "setup" && (
        <Card className="analise-glow-card rounded-2xl border-borderSoft">
          <CardContent className="space-y-6 p-6 md:p-8">
            <EntradaCriacaoVagaPanel
              modo={modo}
              onModoChange={setModo}
              form={form}
              onFormChange={setForm}
              prompt={prompt}
              onPromptChange={setPrompt}
            />
            <Button
              type="button"
              disabled={!podeOtimizar}
              className="w-full gap-2 rounded-full analise-brand-gradient text-white shadow-lg hover:opacity-95 sm:w-auto"
              onClick={handleOtimizar}
            >
              <Sparkles className="size-4" aria-hidden />
              Otimizar vaga com IA
            </Button>
            {!form.cliente && (
              <p className="text-xs text-warning">Selecione o cliente para continuar.</p>
            )}
            {form.cliente && !form.gestor && (
              <p className="text-xs text-warning">Selecione o gestor da vaga para continuar.</p>
            )}
            {modo === "prompt" && form.cliente && form.gestor && prompt.length > 0 && prompt.length < 40 && (
              <p className="text-xs text-warning">Escreva pelo menos 40 caracteres no prompt para continuar.</p>
            )}
          </CardContent>
        </Card>
      )}

      {view === "processing" && (
        <Card className="rounded-2xl border-borderSoft">
          <CardContent className="p-0">
            <ProcessamentoOtimizacaoVaga onComplete={handleComplete} />
          </CardContent>
        </Card>
      )}

      {view === "results" && resultado && <ResultadoVagaOtimizada resultado={resultado} />}
    </div>
  );
}
