import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Eye, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  EntradaCriacaoVagaPanel,
  podeOtimizarVaga,
} from "@/prototipo/criacao-vaga-assistente/components/EntradaCriacaoVagaPanel";
import { ProcessamentoOtimizacaoVaga } from "@/prototipo/criacao-vaga-assistente/components/ProcessamentoOtimizacaoVaga";
import { ResultadoVagaOtimizada } from "@/prototipo/criacao-vaga-assistente/components/ResultadoVagaOtimizada";
import { VagaPublicaPreviewDrawer } from "@/prototipo/criacao-vaga-assistente/components/VagaPublicaPreviewDrawer";
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
  const [previewOpen, setPreviewOpen] = useState(false);

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
    setPreviewOpen(false);
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
                  Comercial · criação dinâmica
                </p>
                <h1 className="mt-2 text-2xl font-bold md:text-3xl">
                  <span className="analise-brand-gradient-text">Assistente de criação de vaga</span>
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-secondaryText">
                  Descreva o perfil em um prompt — a IA extrai dados do perfil de atuação. Refine no preview em tempo
                  real antes de publicar. Detalhamento de triagem e critérios de aderência ficam para uma experiência
                  futura.
                </p>
              </div>
              {view === "results" && (
                <Button type="button" variant="outline" className="gap-2 rounded-full" onClick={handleNova}>
                  <RotateCcw className="size-4" aria-hidden />
                  Nova criação
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
          Protótipo — respostas simuladas no contrato API perfil/vaga.
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
              Gerar perfil com IA
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

      {view === "results" && resultado && (
        <>
          <ResultadoVagaOtimizada resultado={resultado} />
          <VagaPublicaPreviewDrawer
            resultado={resultado}
            onResultadoChange={setResultado}
            open={previewOpen}
            onOpenChange={setPreviewOpen}
          />
          <Button
            type="button"
            aria-label="Abrir preview da vaga"
            className="fixed bottom-6 right-6 z-50 gap-2 rounded-full analise-brand-gradient px-5 py-6 text-white shadow-[0_8px_32px_rgba(154,27,255,0.45)] hover:opacity-95"
            onClick={() => setPreviewOpen(true)}
          >
            <Eye className="size-5" aria-hidden />
            Preview da vaga
          </Button>
        </>
      )}
    </div>
  );
}
