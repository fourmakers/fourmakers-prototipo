import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Sparkles, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EntradaCandidatosPanel,
  hasEntradaCandidatos,
  type EntradaCandidatosState,
} from "@/prototipo/analise-aderencia/components/EntradaCandidatosPanel";
import { ProcessamentoAnalise } from "@/prototipo/analise-aderencia/components/ProcessamentoAnalise";
import { ResultadosAnaliseLayout } from "@/prototipo/analise-aderencia/components/ResultadosAnaliseLayout";
import { VAGAS_ANALISE_MOCK } from "@/prototipo/analise-aderencia/mocks/vagasAnalise";
import { buildResultadoMock } from "@/prototipo/analise-aderencia/mocks/resultadoAnaliseMock";
import "@/prototipo/analise-aderencia/analiseAderencia.css";

type View = "setup" | "processing" | "results";

const ENTRADA_INICIAL: EntradaCandidatosState = { arquivos: [], urlsLinkedin: [] };

export function AnaliseAderenciaPage() {
  const [view, setView] = useState<View>("setup");
  const [vagaId, setVagaId] = useState<string>(VAGAS_ANALISE_MOCK[0].id);
  const [entrada, setEntrada] = useState<EntradaCandidatosState>(ENTRADA_INICIAL);
  const [resultado, setResultado] = useState<ReturnType<typeof buildResultadoMock> | null>(null);
  const [candidatoSelecionadoId, setCandidatoSelecionadoId] = useState<string | null>(null);

  const vaga = useMemo(() => VAGAS_ANALISE_MOCK.find((v) => v.id === vagaId), [vagaId]);

  const handleIniciarAnalise = () => {
    if (!vagaId || !hasEntradaCandidatos(entrada)) return;
    setView("processing");
    setResultado(null);
    setCandidatoSelecionadoId(null);
  };

  const handleProcessamentoComplete = useCallback(() => {
    const res = buildResultadoMock(vagaId);
    setResultado(res);
    setCandidatoSelecionadoId(res.candidatos[0]?.id ?? null);
    setView("results");
  }, [vagaId]);

  const handleNovaAnalise = () => {
    setView("setup");
    setEntrada(ENTRADA_INICIAL);
    setResultado(null);
    setCandidatoSelecionadoId(null);
  };

  const candidatoSelecionado = resultado?.candidatos.find((c) => c.id === candidatoSelecionadoId);

  const podeIniciar = Boolean(vagaId && hasEntradaCandidatos(entrada));

  return (
    <div
      className={cn(
        "mx-auto w-full pb-12",
        view === "results" ? "max-w-7xl px-4 md:px-6" : "max-w-5xl",
      )}
    >
      <header className="mb-8">
        <nav
          className="mb-3 flex flex-wrap items-center gap-1.5 text-xs text-secondaryText"
          aria-label="Breadcrumb"
        >
          <span>Recrutamento</span>
          <ChevronRight className="size-3 shrink-0 opacity-60" aria-hidden />
          <span className="font-medium text-primaryText">Análise de aderência</span>
        </nav>
        <div className="overflow-hidden rounded-2xl analise-brand-gradient p-[1px]">
          <div className="rounded-2xl bg-secondaryBackground px-6 py-8 md:px-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                  Triagem com IA
                </p>
                <h1 className="mt-2 text-2xl font-bold md:text-3xl">
                  <span className="analise-brand-gradient-text">Análise de aderência</span>
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-secondaryText">
                  Envie CVs, ZIP ou perfis LinkedIn, selecione a vaga e receba panorama de mercado,
                  ranking e parecer visual por critérios alinhados aos desafios da posição.
                </p>
              </div>
              {view === "results" && (
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2 rounded-full"
                  onClick={handleNovaAnalise}
                >
                  <RotateCcw className="size-4" aria-hidden />
                  Nova análise
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
          Protótipo — respostas simuladas; integração com API de IA pendente.
        </p>
      </header>

      {view === "setup" && (
        <Card className="analise-glow-card rounded-2xl border-borderSoft shadow-[var(--elevation-soft)]">
          <CardContent className="space-y-6 p-6 md:p-8">
            <div className="space-y-2">
              <Label htmlFor="vaga-select" className="text-sm font-semibold">
                Vaga para análise
              </Label>
              <Select value={vagaId} onValueChange={setVagaId}>
                <SelectTrigger id="vaga-select" className="h-11 rounded-xl">
                  <SelectValue placeholder="Selecione a vaga" />
                </SelectTrigger>
                <SelectContent>
                  {VAGAS_ANALISE_MOCK.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.codigo} — {v.titulo} ({v.cliente})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {vaga && (
                <p className="text-xs text-secondaryText">
                  {vaga.desafios.length} desafios mapeados · {vaga.objetivos.length} objetivos
                </p>
              )}
            </div>

            <div>
              <h2 className="mb-1 text-sm font-semibold text-primaryText">Candidatos para triagem</h2>
              <p className="mb-4 text-xs text-secondaryText">
                Arquivo único, lote, ZIP ou um ou mais links de LinkedIn.
              </p>
              <EntradaCandidatosPanel value={entrada} onChange={setEntrada} />
            </div>

            <Button
              type="button"
              disabled={!podeIniciar}
              className="w-full gap-2 rounded-full analise-brand-gradient text-white shadow-lg shadow-accent/30 transition-all hover:scale-[1.02] hover:opacity-95 sm:w-auto"
              onClick={handleIniciarAnalise}
            >
              <Sparkles className="size-4" aria-hidden />
              Iniciar análise com IA
            </Button>
          </CardContent>
        </Card>
      )}

      {view === "processing" && (
        <Card className="rounded-2xl border-borderSoft">
          <CardContent className="p-0">
            <ProcessamentoAnalise onComplete={handleProcessamentoComplete} />
          </CardContent>
        </Card>
      )}

      {view === "results" && resultado && vaga && (
        <ResultadosAnaliseLayout
          vaga={vaga}
          resultado={resultado}
          candidatoSelecionado={candidatoSelecionado}
          candidatoSelecionadoId={candidatoSelecionadoId}
          onSelectCandidato={setCandidatoSelecionadoId}
        />
      )}
    </div>
  );
}
