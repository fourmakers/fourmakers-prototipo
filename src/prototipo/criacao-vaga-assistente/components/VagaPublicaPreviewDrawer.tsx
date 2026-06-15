import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Eye,
  MapPin,
  RefreshCw,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type { PerfilExtraido, PreviewMercadoVaga, VagaOtimizadaResultado } from "../types";
import { buildDescricaoLinkedInVaga } from "../utils/linkedinDescricaoVaga";
import { updateResultadoFromPerfil } from "../utils/updateResultadoFromPerfil";
import { PreviewEditableSection } from "./PreviewEditableSection";

interface VagaPublicaPreviewDrawerProps {
  resultado: VagaOtimizadaResultado;
  onResultadoChange?: (r: VagaOtimizadaResultado) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VagaPublicaPreviewDrawer({
  resultado,
  onResultadoChange,
  open,
  onOpenChange,
}: VagaPublicaPreviewDrawerProps) {
  const [perfil, setPerfil] = useState<PerfilExtraido>(resultado.api.perfilExtraido);
  const [mercado, setMercado] = useState<PreviewMercadoVaga>(resultado.previewMercado);
  const [score, setScore] = useState(resultado.scoreQualidade);
  const [validacaoMsg, setValidacaoMsg] = useState(resultado.api.validacaoInformacoes.mensagemUsuario);
  const [descricaoLinkedin, setDescricaoLinkedin] = useState(() => buildDescricaoLinkedInVaga(resultado));
  const [desafios, setDesafios] = useState([...resultado.desafios]);
  const [mercadoRecalculado, setMercadoRecalculado] = useState(false);
  const [publicada, setPublicada] = useState(false);
  const confirmacaoRef = useRef<HTMLDivElement>(null);

  const skillsExtraidas = useMemo(
    () => perfil.gestorExternoPerfilSkills,
    [perfil.gestorExternoPerfilSkills],
  );
  const skillsPropostas = useMemo(
    () => resultado.api.skillsPropostas.gestorExternoPerfilSkills,
    [resultado.api.skillsPropostas.gestorExternoPerfilSkills],
  );

  const aplicarPerfil = useCallback(
    (nextPerfil: PerfilExtraido, recalcularMercado = true) => {
      setPerfil(nextPerfil);
      const nextResultado = updateResultadoFromPerfil(resultado, nextPerfil, recalcularMercado);
      setScore(nextResultado.scoreQualidade);
      setValidacaoMsg(nextResultado.api.validacaoInformacoes.mensagemUsuario);
      setDescricaoLinkedin(buildDescricaoLinkedInVaga(nextResultado));
      if (recalcularMercado) {
        setMercado(nextResultado.previewMercado);
        setMercadoRecalculado(true);
      }
      onResultadoChange?.(nextResultado);
    },
    [resultado, onResultadoChange],
  );

  const patchPerfil = useCallback(
    (patch: Partial<PerfilExtraido>, recalcularMercado = true) => {
      aplicarPerfil({ ...perfil, ...patch }, recalcularMercado);
    },
    [aplicarPerfil, perfil],
  );

  useEffect(() => {
    if (!publicada) return;
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        confirmacaoRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [publicada]);

  useEffect(() => {
    if (open) {
      setPerfil(resultado.api.perfilExtraido);
      setMercado(resultado.previewMercado);
      setScore(resultado.scoreQualidade);
      setValidacaoMsg(resultado.api.validacaoInformacoes.mensagemUsuario);
      setDescricaoLinkedin(buildDescricaoLinkedInVaga(resultado));
      setDesafios([...resultado.desafios]);
      setMercadoRecalculado(false);
      setPublicada(false);
    }
  }, [open, resultado]);

  useEffect(() => {
    if (!mercadoRecalculado) return;
    const t = setTimeout(() => setMercadoRecalculado(false), 6000);
    return () => clearTimeout(t);
  }, [mercadoRecalculado]);

  const localizacao =
    [perfil.cidade, perfil.estado].filter(Boolean).join(", ") ||
    perfil.modeloTrabalhoDescricao ||
    "Localidade a definir";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 border-borderSoft bg-surfaceSubtle p-0 sm:max-w-2xl lg:max-w-3xl"
      >
        <SheetHeader className="border-b border-borderSoft bg-secondaryBackground px-6 py-4 text-left">
          <SheetTitle className="flex items-center gap-2 text-lg text-primaryText">
            <Eye className="size-5 text-accent" aria-hidden />
            Preview — refinamento do perfil
          </SheetTitle>
          <SheetDescription className="text-left text-xs text-secondaryText">
            {publicada
              ? "Perfil publicado. Você já pode analisar aderentes."
              : "Edite os campos extraídos do prompt — completude e aderência atualizam em tempo real."}
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
                  <strong>Completude ({score}%)</strong>, <strong>média de aderência prevista</strong> e{" "}
                  <strong>banco de talentos</strong> atualizados conforme o refinamento.
                </p>
              </div>
            )}

            {resultado.promptOriginal && (
              <section className="rounded-xl border border-borderSoft bg-secondaryBackground p-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-secondaryText">Prompt inserido</p>
                <p className="mt-1 text-xs leading-relaxed text-primaryText">{resultado.promptOriginal}</p>
              </section>
            )}

            <div className="rounded-xl border border-warningBorder bg-warningSoft/30 px-3 py-2 text-xs text-primaryText">
              {validacaoMsg}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="analise-glass analise-glow-card rounded-2xl p-4">
                <BarChart3 className="mb-2 size-4 text-accent" aria-hidden />
                <p className="text-2xl font-bold analise-brand-gradient-text">{mercado.mediaAderenciaPrevista}%</p>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-secondaryText">
                  Média aderência prevista
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
                <p className="text-2xl font-bold analise-brand-gradient-text">{score}%</p>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-secondaryText">
                  Completude do perfil
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-borderSoft bg-secondaryBackground shadow-[var(--elevation-soft)]">
              <div className="h-16 analise-brand-gradient opacity-90" aria-hidden />
              <div className="-mt-8 space-y-4 px-5 pb-5">
                <PreviewEditableSection
                  titulo="Nome do perfil"
                  valorTexto={perfil.nomePerfil}
                  onSaveTexto={(v) => patchPerfil({ nomePerfil: v })}
                  multiline={false}
                >
                  <h2 className="text-xl font-bold text-primaryText">{perfil.nomePerfil}</h2>
                </PreviewEditableSection>

                <div className="flex items-center gap-2 text-xs text-secondaryText">
                  <MapPin className="size-3.5 shrink-0" aria-hidden />
                  <span>{localizacao}</span>
                  {perfil.modeloTrabalhoDescricao && (
                    <Badge variant="outline" className="text-[10px]">
                      {perfil.modeloTrabalhoDescricao}
                    </Badge>
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="pv-custo" className="text-[10px] uppercase tracking-wide text-secondaryText">
                      Custo perfil (R$)
                    </Label>
                    <Input
                      id="pv-custo"
                      type="number"
                      className="h-9 rounded-xl text-sm"
                      placeholder="0,00"
                      value={perfil.custoPerfil || ""}
                      onChange={(e) =>
                        patchPerfil({ custoPerfil: parseFloat(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="pv-rate" className="text-[10px] uppercase tracking-wide text-secondaryText">
                      Ratecard perfil (R$)
                    </Label>
                    <Input
                      id="pv-rate"
                      type="number"
                      className="h-9 rounded-xl text-sm"
                      placeholder="0,00"
                      value={perfil.ratecardPerfil || ""}
                      onChange={(e) =>
                        patchPerfil({ ratecardPerfil: parseFloat(e.target.value) || 0 })
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="pv-cidade" className="text-[10px] uppercase tracking-wide text-secondaryText">
                      Cidade
                    </Label>
                    <Input
                      id="pv-cidade"
                      className="h-9 rounded-xl text-sm"
                      placeholder="Ex.: São Paulo"
                      value={perfil.cidade ?? ""}
                      onChange={(e) => patchPerfil({ cidade: e.target.value || null })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="pv-estado" className="text-[10px] uppercase tracking-wide text-secondaryText">
                      Estado
                    </Label>
                    <Input
                      id="pv-estado"
                      className="h-9 rounded-xl text-sm"
                      placeholder="Ex.: SP"
                      value={perfil.estado ?? ""}
                      onChange={(e) => patchPerfil({ estado: e.target.value || null })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="pv-cep" className="text-[10px] uppercase tracking-wide text-secondaryText">
                      CEP
                    </Label>
                    <Input
                      id="pv-cep"
                      className="h-9 rounded-xl text-sm"
                      placeholder="00000-000"
                      value={perfil.cep ?? ""}
                      onChange={(e) => patchPerfil({ cep: e.target.value || null })}
                    />
                  </div>
                </div>

                <PreviewEditableSection
                  titulo="Informações relevantes"
                  valorTexto={perfil.informacoesRelevantes}
                  onSaveTexto={(v) => patchPerfil({ informacoesRelevantes: v })}
                >
                  <p className="text-sm leading-relaxed text-primaryText">{perfil.informacoesRelevantes}</p>
                </PreviewEditableSection>

                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-secondaryText">
                    Skills extraídas do prompt
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {skillsExtraidas.map((s) => (
                      <Badge key={s.skill.id} variant="default" className="text-[11px]">
                        {s.skill.descricao}
                        <span className="ml-1 opacity-70">· {s.nivel.descricao}</span>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-secondaryText">
                    Skills propostas pela IA
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {skillsPropostas.map((s) => (
                      <Badge key={s.skill.id} variant="secondary" className="text-[11px]">
                        {s.skill.descricao}
                        <span className="ml-1 opacity-70">· {s.nivel.descricao}</span>
                      </Badge>
                    ))}
                  </div>
                </div>

                <PreviewEditableSection
                  titulo="Descrição (formato LinkedIn)"
                  valorTexto={descricaoLinkedin}
                  onSaveTexto={(v) => {
                    setDescricaoLinkedin(v);
                    setMercadoRecalculado(true);
                  }}
                  className="mt-2"
                >
                  <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-primaryText">
                    {descricaoLinkedin}
                  </pre>
                </PreviewEditableSection>
              </div>
            </div>

            <PreviewEditableSection titulo="Desafios detalhados" className="bg-secondaryBackground">
              <ul className="space-y-2">
                {desafios.map((d, i) => (
                  <li key={`${i}-${d.slice(0, 12)}`} className="group/item">
                    <Textarea
                      className="min-h-[52px] rounded-lg text-xs"
                      value={d}
                      onChange={(e) => {
                        const next = desafios.map((x, j) => (j === i ? e.target.value : x));
                        setDesafios(next);
                      }}
                      onBlur={() => setMercadoRecalculado(true)}
                    />
                  </li>
                ))}
              </ul>
            </PreviewEditableSection>

            {publicada && (
              <div
                ref={confirmacaoRef}
                className="flex items-center gap-2 rounded-xl border border-successBorder bg-successSoft px-3 py-2.5 text-sm text-success"
              >
                <CheckCircle2 className="size-4 shrink-0" aria-hidden />
                Perfil publicado com sucesso.
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
                Publicar perfil
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
