import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Eye,
  MapPin,
  Pencil,
  RefreshCw,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { PreviewMercadoVaga, VagaOtimizadaResultado } from "../types";
import { buildDescricaoLinkedInVaga } from "../utils/linkedinDescricaoVaga";
import { recalcularPreviewMercado } from "../utils/recalcularPreviewMercado";
import { PreviewEditableSection } from "./PreviewEditableSection";

interface VagaPublicaPreviewDrawerProps {
  resultado: VagaOtimizadaResultado;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VagaPublicaPreviewDrawer({
  resultado,
  open,
  onOpenChange,
}: VagaPublicaPreviewDrawerProps) {
  const inicial = useMemo(
    () => ({
      titulo: resultado.tituloSugerido,
      descricaoLinkedin: buildDescricaoLinkedInVaga(resultado),
      desafioDestaque: resultado.textoDesafioConsolidado,
      localizacao: "São Paulo, SP · Remoto com encontros trimestrais",
    }),
    [resultado],
  );

  const [titulo, setTitulo] = useState(inicial.titulo);
  const [descricaoLinkedin, setDescricaoLinkedin] = useState(inicial.descricaoLinkedin);
  const [desafioDestaque, setDesafioDestaque] = useState(inicial.desafioDestaque);
  const [localizacao, setLocalizacao] = useState(inicial.localizacao);
  const [desafios, setDesafios] = useState([...resultado.desafios]);
  const [mercado, setMercado] = useState<PreviewMercadoVaga>(resultado.previewMercado);
  const [mercadoRecalculado, setMercadoRecalculado] = useState(false);
  const [publicada, setPublicada] = useState(false);
  const confirmacaoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!publicada) return;
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const alvo = confirmacaoRef.current;
        if (!alvo) return;
        alvo.scrollIntoView({ behavior: "smooth", block: "end" });
        const viewport = alvo.closest("[data-radix-scroll-area-viewport]");
        if (viewport instanceof HTMLElement) {
          viewport.scrollTop = viewport.scrollHeight;
        }
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [publicada]);

  useEffect(() => {
    if (open) {
      setTitulo(inicial.titulo);
      setDescricaoLinkedin(inicial.descricaoLinkedin);
      setDesafioDestaque(inicial.desafioDestaque);
      setLocalizacao(inicial.localizacao);
      setDesafios([...resultado.desafios]);
      setMercado(resultado.previewMercado);
      setMercadoRecalculado(false);
      setPublicada(false);
    }
  }, [open, inicial, resultado.desafios, resultado.previewMercado]);

  const notificarRecalculoMercado = useCallback(() => {
    setMercado((prev) => recalcularPreviewMercado(prev));
    setMercadoRecalculado(true);
  }, []);

  useEffect(() => {
    if (!mercadoRecalculado) return;
    const t = setTimeout(() => setMercadoRecalculado(false), 6000);
    return () => clearTimeout(t);
  }, [mercadoRecalculado]);

  const editarLocalizacao = () => {
    const next = prompt("Localização:", localizacao);
    if (next?.trim()) {
      setLocalizacao(next.trim());
      notificarRecalculoMercado();
    }
  };

  const editarDesafioItem = (i: number, d: string) => {
    const next = prompt("Editar desafio:", d);
    if (next?.trim()) {
      setDesafios((prev) => prev.map((x, j) => (j === i ? next.trim() : x)));
      notificarRecalculoMercado();
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 border-borderSoft bg-surfaceSubtle p-0 sm:max-w-2xl lg:max-w-3xl"
      >
        <SheetHeader className="border-b border-borderSoft bg-secondaryBackground px-6 py-4 text-left">
          <SheetTitle className="flex items-center gap-2 text-lg text-primaryText">
            <Eye className="size-5 text-accent" aria-hidden />
            Preview da vaga pública
          </SheetTitle>
          <SheetDescription className="text-left text-xs text-secondaryText">
            {publicada
              ? "Vaga publicada. Você já pode analisar aderentes com os critérios desta vaga."
              : "Rascunho antes da publicação — formato LinkedIn + desafios e skills. Edições recalculam a projeção de match."}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="space-y-4 p-4 md:p-6">
            {mercadoRecalculado && (
              <div
                role="status"
                className="flex items-start gap-2 rounded-xl border border-infoBorder bg-infoSoft/60 px-3 py-2.5 text-xs text-primaryText"
              >
                <RefreshCw className="mt-0.5 size-4 shrink-0 text-info" aria-hidden />
                <p>
                  <strong>Média de aderência prevista</strong> e <strong>banco de talentos com aderência ≥
                  80%</strong> foram atualizados conforme o refinamento da vaga.
                </p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="analise-glass analise-glow-card rounded-2xl p-4">
                <BarChart3 className="mb-2 size-4 text-accent" aria-hidden />
                <p className="text-2xl font-bold analise-brand-gradient-text">{mercado.mediaAderenciaPrevista}%</p>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-secondaryText">
                  Média de aderência prevista
                </p>
              </div>
              <div className="analise-glass analise-glow-card rounded-2xl p-4">
                <Users className="mb-2 size-4 text-accent" aria-hidden />
                <p className="text-2xl font-bold text-primaryText">{mercado.talentosBancoAcima80}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-secondaryText">
                  Banco ≥ 80% aderência
                </p>
              </div>
              <div className="analise-glass analise-glow-card rounded-2xl p-4">
                <Sparkles className="mb-2 size-4 text-accent" aria-hidden />
                <p className="text-2xl font-bold text-primaryText">{mercado.talentosQualificadosSimilares}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-secondaryText">
                  Talentos qualificados
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-borderSoft bg-secondaryBackground shadow-[var(--elevation-soft)]">
              <div className="h-24 analise-brand-gradient opacity-90" aria-hidden />
              <div className="-mt-12 px-5 pb-5">
                <PreviewEditableSection
                  titulo="Título da vaga"
                  valorTexto={titulo}
                  onSaveTexto={setTitulo}
                  onAfterSave={notificarRecalculoMercado}
                  multiline={false}
                >
                  <h2 className="text-xl font-bold text-primaryText">{titulo}</h2>
                </PreviewEditableSection>

                <div className="group/loc mt-3 flex items-center gap-2 text-xs text-secondaryText">
                  <MapPin className="size-3.5 shrink-0" aria-hidden />
                  <span className="flex-1">{localizacao}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 opacity-0 group-hover/loc:opacity-100"
                    aria-label="Editar localização"
                    onClick={editarLocalizacao}
                  >
                    <Pencil className="size-3.5" aria-hidden />
                  </Button>
                </div>

                <div className="mt-4">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-secondaryText">
                    Skills (detalhes da vaga)
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {resultado.skillsSugeridas.map((s) => (
                      <Badge key={s.nome} variant={s.relevante ? "default" : "secondary"} className="text-[11px]">
                        {s.nome}
                        <span className="ml-1 opacity-70">· {s.nivel}</span>
                      </Badge>
                    ))}
                  </div>
                </div>

                <PreviewEditableSection
                  titulo="Descrição (formato LinkedIn)"
                  valorTexto={descricaoLinkedin}
                  onSaveTexto={setDescricaoLinkedin}
                  onAfterSave={notificarRecalculoMercado}
                  className="mt-4"
                >
                  <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-primaryText">
                    {descricaoLinkedin}
                  </pre>
                </PreviewEditableSection>
              </div>
            </div>

            <PreviewEditableSection
              titulo="Desafio da vaga"
              valorTexto={desafioDestaque}
              onSaveTexto={setDesafioDestaque}
              onAfterSave={notificarRecalculoMercado}
              className="border-accent/25 bg-accentSoft/15 backdrop-blur-sm"
            >
              <p className="text-sm leading-relaxed text-primaryText">{desafioDestaque}</p>
            </PreviewEditableSection>

            <PreviewEditableSection titulo="Desafios detalhados" className="bg-secondaryBackground">
              <ul className="space-y-2">
                {desafios.map((d, i) => (
                  <li
                    key={`${i}-${d.slice(0, 12)}`}
                    className="group/item flex gap-2 rounded-lg border border-borderSoft px-2 py-1.5 text-xs text-primaryText"
                  >
                    <Target className="mt-0.5 size-3.5 shrink-0 text-accent" aria-hidden />
                    <span className="flex-1">{d}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-6 shrink-0 opacity-0 group-hover/item:opacity-100"
                      aria-label="Editar desafio"
                      onClick={() => editarDesafioItem(i, d)}
                    >
                      <Pencil className="size-3" aria-hidden />
                    </Button>
                  </li>
                ))}
              </ul>
            </PreviewEditableSection>

            {publicada && (
              <div
                ref={confirmacaoRef}
                className="scroll-mb-4 flex items-center gap-2 rounded-xl border border-successBorder bg-successSoft px-3 py-2.5 text-sm text-success"
              >
                <CheckCircle2 className="size-4 shrink-0" aria-hidden />
                Vaga publicada com sucesso.
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex flex-wrap gap-2 border-t border-borderSoft bg-secondaryBackground p-4">
          {publicada ? (
            <>
              <Button
                type="button"
                className="flex-1 gap-2 analise-brand-gradient border-0 text-white sm:flex-none"
                asChild
              >
                <Link to="/analise-aderencia" onClick={() => onOpenChange(false)}>
                  Analisar aderentes
                  <ChevronRight className="size-4" aria-hidden />
                </Link>
              </Button>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                className="flex-1 analise-brand-gradient border-0 text-white sm:flex-none"
                onClick={() => setPublicada(true)}
              >
                Publicar vaga
              </Button>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Fechar preview
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
