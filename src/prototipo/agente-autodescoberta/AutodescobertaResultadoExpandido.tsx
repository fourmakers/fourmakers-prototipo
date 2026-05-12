import { useMemo, useState } from "react";
import { Briefcase, Heart, Info, Share2, Sparkles, Wrench, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type {
  AgenteCatalogoMock,
  CategoriaSegmento,
  ComposicaoMock,
  ConfiancaIa,
} from "@/prototipo/agente-autodescoberta/autodescobertaAnalisePreviaMock";
import { MOCK_AGENTES_CATALOGO, MOCK_ANALISE_PREVIA } from "@/prototipo/agente-autodescoberta/autodescobertaAnalisePreviaMock";
import type { CarreiraPotencializadaMock, VagaCardMock } from "@/prototipo/agente-autodescoberta/autodescobertaResultadoMocks";
import { MOCK_CARREIRAS_POTENCIALIZADAS, MOCK_VAGAS_AUTODESCOBERTA } from "@/prototipo/agente-autodescoberta/autodescobertaResultadoMocks";

function chipCategoria(cat: CategoriaSegmento): string {
  switch (cat) {
    case "decision":
      return "border-l-4 border-primary bg-primarySoft text-primaryText";
    case "routine":
      return "border-l-4 border-success bg-successSoft text-primaryText";
    case "deliverable":
      return "border-l-4 border-info bg-infoSoft text-primaryText";
    case "communication":
      return "border-l-4 border-accent bg-accentSoft text-primaryText";
    default:
      return "bg-surfaceSubtle text-primaryText";
  }
}

function labelConfianca(c: ConfiancaIa): string {
  if (c === "high") return "Alta";
  if (c === "medium") return "Média";
  return "Baixa";
}

function redistributeComposicao(
  chave: keyof ComposicaoMock,
  novoValor: number,
  atual: ComposicaoMock,
): ComposicaoMock {
  const nv = Math.max(0, Math.min(100, Math.round(novoValor)));
  const outros = (["humano", "agentes", "hibrido"] as const).filter((k) => k !== chave);
  const resto = 100 - nv;
  const s = atual[outros[0]] + atual[outros[1]];
  let o0: number;
  let o1: number;
  if (s <= 0) {
    o0 = Math.floor(resto / 2);
    o1 = resto - o0;
  } else {
    o0 = Math.round((resto * atual[outros[0]]) / s);
    o1 = resto - o0;
  }
  return { ...atual, [chave]: nv, [outros[0]]: o0, [outros[1]]: o1 };
}

function BarraPercentual({
  label,
  value,
  variant,
}: {
  label: string;
  value: number;
  variant: "atual" | "potencializada";
}) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs text-secondaryText">{label}</span>
        <span className="text-sm font-semibold tabular-nums text-primaryText">{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondaryBackground">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            variant === "atual" ? "bg-primary" : "bg-success",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function VagaCard({ vaga }: { vaga: VagaCardMock }) {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-borderSoft bg-surfaceElevated p-5 shadow-softToken">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 text-sm text-secondaryText">
          <Briefcase className="size-4 shrink-0 text-primary" aria-hidden />
          <span>Vaga: {vaga.codigoVaga}</span>
        </div>
        <Zap className="size-4 shrink-0 text-primary" aria-hidden />
      </div>
      <h3 className="text-lg font-bold leading-snug text-primaryText">{vaga.titulo}</h3>
      <p className="mt-2 text-xs text-secondaryText">
        Publicada em {vaga.publicadaEm}
        <span className="text-secondaryText"> · </span>
        {vaga.local}
        <span className="text-secondaryText"> · </span>
        <span className="font-semibold text-primaryText">{vaga.modalidade}</span>
      </p>
      <p className="mb-2 mt-4 text-[11px] font-medium uppercase tracking-wider text-secondaryText">
        habilidades técnicas
      </p>
      <div className="flex flex-wrap gap-1.5">
        {vaga.habilidades.map((h) => (
          <span
            key={h}
            className="rounded-pillToken border border-primary/15 bg-primarySoft px-2.5 py-1 text-xs font-medium text-primaryText"
          >
            {h}
          </span>
        ))}
      </div>
      <div className="mt-auto pt-5">
        <Button type="button" className="h-11 w-full rounded-2xl bg-primaryText font-semibold text-inverseText hover:opacity-90">
          Ver vaga e candidatar-se
        </Button>
        <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-borderSoft bg-secondaryBackground px-3 py-2">
          <span className="min-w-0 truncate text-[11px] text-secondaryText" title={vaga.urlPublica}>
            {vaga.urlPublica}
          </span>
          <button
            type="button"
            className="shrink-0 rounded-md p-1 text-secondaryText hover:bg-primarySoft hover:text-primary"
            aria-label="Partilhar link da vaga"
          >
            <Share2 className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CarreiraCard({ carreira }: { carreira: CarreiraPotencializadaMock }) {
  return (
    <Card className="border-borderSoft bg-surfaceElevated shadow-softToken">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start gap-2">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accentSoft text-accent">
            <Sparkles className="size-4" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-base font-semibold text-primaryText">{carreira.titulo}</h4>
            <p className="mt-1 text-sm leading-relaxed text-secondaryText">{carreira.resumoAlinhamento}</p>
          </div>
        </div>
        <div>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-secondaryText">
            skills em destaque nesta carreira
          </p>
          <div className="flex flex-wrap gap-1.5">
            {carreira.skillsDestaque.map((s) => (
              <Badge key={s} variant="secondary" className="font-normal">
                {s}
              </Badge>
            ))}
          </div>
        </div>
        <div className="space-y-4 rounded-xl border border-borderSoft bg-secondaryBackground p-4">
          <BarraPercentual label="Aderência ao perfil atual" value={carreira.aderenciaPerfilAtual} variant="atual" />
          <BarraPercentual
            label="Aderência potencializada (agentes IA)"
            value={carreira.aderenciaPotencializada}
            variant="potencializada"
          />
        </div>
        <div>
          <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-secondaryText">
            agentes IA mapeados (contribuição relativa na potencialização)
          </p>
          <ul className="space-y-3">
            {carreira.agentes.map((ag) => (
              <li
                key={ag.nome}
                className="rounded-lg border border-borderSoft bg-surfaceElevated p-3 text-sm leading-snug"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-semibold text-primaryText">{ag.nome}</span>
                  <span className="rounded-pillToken bg-primarySoft px-2 py-0.5 text-xs font-semibold text-primary">
                    {ag.contribuicaoPotencializacao}% da potencialização
                  </span>
                </div>
                <p className="mt-2 text-secondaryText">{ag.parecer}</p>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function ListaDetectados({
  titulo,
  itens,
}: {
  titulo: string;
  itens: { id: string; texto: string; categoria: CategoriaSegmento }[];
}) {
  return (
    <Card className="border-borderSoft bg-surfaceElevated">
      <CardContent className="p-4">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-secondaryText">{titulo}</p>
        <ul className="space-y-2">
          {itens.map((it) => (
            <li
              key={it.id}
              className={cn("rounded-lg px-3 py-2 text-sm leading-snug", chipCategoria(it.categoria))}
            >
              {it.texto}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export interface AutodescobertaResultadoExpandidoProps {
  tecnicas: string[];
  comportamentais: string[];
  cargos: string[];
}

export function AutodescobertaResultadoExpandido({
  tecnicas,
  comportamentais,
  cargos,
}: AutodescobertaResultadoExpandidoProps) {
  const [fase, setFase] = useState<"confirmacao" | "completo">("confirmacao");
  const [representaBem, setRepresentaBem] = useState(false);
  const [faltouAlgo, setFaltouAlgo] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [composicao, setComposicao] = useState<ComposicaoMock>(() => ({ ...MOCK_ANALISE_PREVIA.composicaoSugerida }));
  const [agentesAtivos, setAgentesAtivos] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const a of MOCK_AGENTES_CATALOGO) {
      init[a.id] = a.status === "available" || a.status === "pilot";
    }
    init.ag4 = false;
    return init;
  });

  const podeContinuar =
    representaBem || (faltouAlgo && feedback.trim().length >= 12);

  const textoSegmentado = useMemo(() => {
    return MOCK_ANALISE_PREVIA.segmentos.map((seg, i) => (
      <span key={i} className={cn("rounded-sm px-0.5", chipCategoria(seg.categoria))}>
        {seg.texto}
      </span>
    ));
  }, []);

  const barraComposicao = (
    <div className="flex h-5 w-full overflow-hidden rounded-full border border-borderSoft shadow-inner">
      <div
        className="bg-success transition-all duration-300"
        style={{ width: `${composicao.humano}%` }}
        title={`Humano ${composicao.humano}%`}
      />
      <div
        className="bg-primary transition-all duration-300"
        style={{ width: `${composicao.agentes}%` }}
        title={`Agentes ${composicao.agentes}%`}
      />
      <div
        className="bg-warning transition-all duration-300"
        style={{ width: `${composicao.hibrido}%` }}
        title={`Híbrido ${composicao.hibrido}%`}
      />
    </div>
  );

  const donutMini = (
    <div className="relative mx-auto size-40 shrink-0">
      <div
        className="absolute inset-0 rounded-full p-[6px]"
        style={{
          background: `conic-gradient(from -90deg, var(--color-success) 0% ${composicao.humano}%, var(--color-primary) ${composicao.humano}% ${composicao.humano + composicao.agentes}%, var(--color-warning) ${composicao.humano + composicao.agentes}% 100%)`,
        }}
      >
        <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-surfaceElevated text-center shadow-inner">
          <span className="text-xs font-semibold text-primaryText">
            {composicao.humano}/{composicao.agentes}/{composicao.hibrido}
          </span>
          <span className="text-[10px] leading-tight text-secondaryText">humano · agentes · híbrido</span>
        </div>
      </div>
    </div>
  );

  const sliderRow = (key: keyof ComposicaoMock, label: string) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-secondaryText">{label}</span>
        <span className="font-semibold tabular-nums text-primaryText">{composicao[key]}%</span>
      </div>
      <Slider
        min={0}
        max={100}
        step={1}
        value={[composicao[key]]}
        onValueChange={(v) => {
          const n = v[0] ?? 0;
          setComposicao((prev) => redistributeComposicao(key, n, prev));
        }}
        className="py-1"
      />
    </div>
  );

  const toggleAgente = (a: AgenteCatalogoMock, checked: boolean) => {
    if (a.status === "unavailable") return;
    setAgentesAtivos((prev) => ({ ...prev, [a.id]: checked }));
  };

  return (
    <section className="mt-8 space-y-6" aria-labelledby="heading-resultado-expandido">
        <div className="border-b border-borderSoft pb-2">
          <h2 id="heading-resultado-expandido" className="text-lg font-semibold text-primaryText">
            Próximos passos após a conversa
          </h2>
          <p className="mt-1 text-sm text-secondaryText">
            Alinhado ao fluxo de <strong className="font-medium text-primaryText">Perfil de Atuação</strong> (rever
            análise da IA), depois composição humano + agentes e carreiras potencializadas.
          </p>
        </div>

        {fase === "confirmacao" && (
          <Card className="border-borderSoft bg-surfaceElevated">
            <CardContent className="space-y-6 p-5 lg:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="gap-1 border-borderSoft bg-secondaryBackground">
                  <Sparkles className="size-3.5 text-primary" aria-hidden />
                  Sugestão de IA
                </Badge>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-pillToken border border-borderSoft bg-primarySoft px-2.5 py-1 text-xs font-semibold text-primary"
                    >
                      Confiança: {labelConfianca(MOCK_ANALISE_PREVIA.confianca)}
                      <Info className="size-3.5 opacity-70" aria-hidden />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-sm">
                    Indicador estimado com base no texto da autodescoberta. Em produção vem do endpoint{" "}
                    <code className="text-xs">/perfis-atuacao/analisar</code>.
                  </TooltipContent>
                </Tooltip>
              </div>

              <div>
                <h3 className="text-base font-semibold text-primaryText">Rever ou confirmar a análise prévia</h3>
                <p className="mt-1 text-sm text-secondaryText">
                  Confira o que a IA entendeu a partir da sua conversa. Ajustes finos podem ser feitos depois na
                  composição.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-primaryText">{textoSegmentado}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <ListaDetectados titulo="Decisões" itens={MOCK_ANALISE_PREVIA.decisoes} />
                <ListaDetectados titulo="Rotinas" itens={MOCK_ANALISE_PREVIA.rotinas} />
                <ListaDetectados titulo="Entregáveis" itens={MOCK_ANALISE_PREVIA.entregaveis} />
              </div>

              <div className="rounded-xl border border-borderSoft bg-secondaryBackground p-4 lg:flex lg:gap-8">
                <div className="flex-1 space-y-4">
                  <p className="text-sm font-medium text-primaryText">Confirmação</p>
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="rep-bem"
                      checked={representaBem}
                      onCheckedChange={(c) => {
                        const on = c === true;
                        setRepresentaBem(on);
                        if (on) {
                          setFaltouAlgo(false);
                          setFeedback("");
                        }
                      }}
                    />
                    <Label htmlFor="rep-bem" className="cursor-pointer text-sm leading-snug text-primaryText">
                      Isso representa bem o perfil
                    </Label>
                  </div>
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="faltou"
                      checked={faltouAlgo}
                      onCheckedChange={(c) => {
                        const on = c === true;
                        setFaltouAlgo(on);
                        if (on) setRepresentaBem(false);
                      }}
                    />
                    <Label htmlFor="faltou" className="cursor-pointer text-sm leading-snug text-primaryText">
                      Faltou algo importante
                    </Label>
                  </div>
                  {faltouAlgo && (
                    <div className="space-y-2 pt-1">
                      <Label htmlFor="feedback-ia" className="text-xs text-secondaryText">
                        Descreva o que ajustar (mín. 12 caracteres para continuar)
                      </Label>
                      <Textarea
                        id="feedback-ia"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        rows={3}
                        className="border-borderSoft bg-surfaceElevated text-sm"
                        placeholder="Ex.: Incluir mais peso em facilitação remota e menos em documentação formal..."
                      />
                    </div>
                  )}
                </div>
                <div className="mt-6 shrink-0 border-t border-borderSoft pt-6 lg:mt-0 lg:w-56 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                  <p className="text-xs text-secondaryText">
                    A IA pode errar. Você revisa antes de ver vagas, composição e carreiras.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                <Button type="button" disabled={!podeContinuar} onClick={() => setFase("completo")}>
                  Continuar para perfil, composição e carreiras
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {fase === "completo" && (
          <>
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
              <div className="lg:col-span-8">
                <Card className="border-borderSoft bg-surfaceElevated">
                  <CardContent className="space-y-4 p-5">
                    <h3 className="text-sm font-semibold text-primaryText">Competências e cargos (conversa)</h3>
                    {tecnicas.length > 0 && (
                      <div>
                        <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-secondaryText">
                          competências técnicas
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {tecnicas.map((h) => (
                            <Badge
                              key={h}
                              className="gap-1 border-successBorder bg-successSoft font-medium text-primaryText"
                              variant="outline"
                            >
                              <Wrench className="size-3" aria-hidden />
                              {h}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {comportamentais.length > 0 && (
                      <div>
                        <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-secondaryText">
                          competências comportamentais
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {comportamentais.map((h) => (
                            <Badge
                              key={h}
                              className="gap-1 border-infoBorder bg-infoSoft font-medium text-primaryText"
                              variant="outline"
                            >
                              <Heart className="size-3" aria-hidden />
                              {h}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {cargos.length > 0 && (
                      <div>
                        <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-secondaryText">
                          cargos que combinam com você
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {cargos.map((c) => (
                            <Badge
                              key={c}
                              className="gap-1 border-borderSoft bg-secondaryBackground font-medium text-primaryText"
                              variant="secondary"
                            >
                              <Briefcase className="size-3 text-secondaryText" aria-hidden />
                              {c}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-4">
                <h3 className="mb-1 text-sm font-semibold text-primaryText">Vagas disponíveis</h3>
                <p className="mb-4 text-xs text-secondaryText">Deslize para ver outras oportunidades (protótipo).</p>
                <div className="relative rounded-2xl border border-borderSoft bg-secondaryBackground p-2">
                  <Carousel opts={{ align: "start", loop: true }} className="w-full" aria-label="Carrossel de vagas">
                    <CarouselContent className="-ml-2">
                      {MOCK_VAGAS_AUTODESCOBERTA.map((vaga) => (
                        <CarouselItem key={vaga.id} className="basis-full pl-2 md:basis-full">
                          <div className="min-h-[420px]">
                            <VagaCard vaga={vaga} />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <div className="mt-3 flex items-center justify-center gap-2">
                      <CarouselPrevious
                        variant="outline"
                        size="icon"
                        className="static left-0 right-0 top-0 h-9 w-9 translate-x-0 translate-y-0 rounded-full"
                      />
                      <CarouselNext
                        variant="outline"
                        size="icon"
                        className="static left-0 right-0 top-0 h-9 w-9 translate-x-0 translate-y-0 rounded-full"
                      />
                    </div>
                  </Carousel>
                </div>
              </div>
            </div>

            <div className="space-y-6 rounded-2xl border border-borderSoft bg-secondaryBackground p-5 lg:p-8">
              <div>
                <h3 className="text-base font-semibold text-primaryText">Composição e agentes</h3>
                <p className="mt-1 text-sm text-secondaryText">
                  Ajuste a repartição entre funções humanas, por agentes e híbridas (sempre somam 100%). Depois, ative
                  os agentes do catálogo que fazem sentido para o seu perfil.
                </p>
              </div>

              <div className="flex flex-col items-stretch gap-8 lg:flex-row lg:items-start">
                <div className="flex flex-col items-center gap-3 lg:w-48">{donutMini}</div>
                <div className="min-w-0 flex-1 space-y-3">
                  <div>
                    <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-secondaryText">
                      distribuição sugerida
                    </p>
                    {barraComposicao}
                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-secondaryText">
                      <span>
                        <span className="mr-1 inline-block size-2 rounded-full bg-success align-middle" /> Humano{" "}
                        {composicao.humano}%
                      </span>
                      <span>
                        <span className="mr-1 inline-block size-2 rounded-full bg-primary align-middle" /> Agentes{" "}
                        {composicao.agentes}%
                      </span>
                      <span>
                        <span className="mr-1 inline-block size-2 rounded-full bg-warning align-middle" /> Híbrido{" "}
                        {composicao.hibrido}%
                      </span>
                    </div>
                  </div>
                  {sliderRow("humano", "Funções humanas (exclusivas de pessoas)")}
                  {sliderRow("agentes", "Funções por agentes de IA")}
                  {sliderRow("hibrido", "Funções híbridas (colaboração)")}
                </div>
              </div>

              <p className="rounded-lg border border-warning/40 bg-warningSoft px-3 py-2 text-xs text-primaryText">
                Tarefas de alto risco e decisões finais permanecem humanas por padrão.
              </p>

              <div>
                <h4 className="mb-3 text-sm font-semibold text-primaryText">Agentes disponíveis</h4>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {MOCK_AGENTES_CATALOGO.map((ag) => (
                    <li
                      key={ag.id}
                      className={cn(
                        "flex flex-col gap-2 rounded-xl border border-borderSoft bg-surfaceElevated p-4",
                        ag.status === "unavailable" && "opacity-60",
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-primaryText">{ag.nome}</p>
                          <p className="text-xs text-secondaryText">{ag.categoria}</p>
                        </div>
                        <Switch
                          checked={!!agentesAtivos[ag.id]}
                          disabled={ag.status === "unavailable"}
                          onCheckedChange={(c) => toggleAgente(ag, c)}
                          aria-label={`Usar ${ag.nome} neste perfil`}
                        />
                      </div>
                      <p className="text-xs leading-relaxed text-secondaryText">{ag.descricao}</p>
                      <Badge variant="outline" className="w-fit text-[10px] uppercase">
                        {ag.status === "available" && "Disponível"}
                        {ag.status === "pilot" && "Piloto"}
                        {ag.status === "unavailable" && "Indisponível"}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-borderSoft pt-8">
                <h3 className="text-base font-semibold text-primaryText">Análise de carreiras</h3>
                <p className="mt-1 text-sm text-secondaryText">
                  Carreiras em que o seu perfil encaixa hoje e o efeito de potencialização com os agentes mapeados.
                </p>
                <div className="mt-4 space-y-4">
                  {MOCK_CARREIRAS_POTENCIALIZADAS.map((c) => (
                    <CarreiraCard key={c.id} carreira={c} />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </section>
  );
}
