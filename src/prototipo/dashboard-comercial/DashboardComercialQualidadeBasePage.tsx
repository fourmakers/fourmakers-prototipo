import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Filter,
  Users,
  AlertTriangle,
  Clock,
  DollarSign,
  Target,
  ChevronRight,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type {
  KpiPainelId,
  QualidadeBaseResumo,
  SemaforoPainelId,
  StakeholderDetalheDto,
} from "@/prototipo/dashboard-comercial/types";
import { MOCK_RESUMO, MOCK_POR_CLIENTE, MOCK_STAKEHOLDERS_POR_FILTRO } from "@/prototipo/dashboard-comercial/mockQualidadeBase";
import { NivelBadge, avatarToneClass, iniciais } from "@/prototipo/dashboard-comercial/nivelUi";

function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function fmtISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function fmtMiBRL(reais: number): string {
  const mi = reais / 1_000_000;
  return mi.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

function coverageBarClass(pct: number): string {
  if (pct >= 70) return "bg-success";
  if (pct >= 40) return "bg-warning";
  return "bg-destructive";
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollPanelIntoView(el: HTMLElement | null) {
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "nearest" });
}

export function DashboardComercialQualidadeBasePage() {
  const today = useMemo(() => new Date(), []);
  const defaultInicio = useMemo(() => addDays(today, -60), [today]);
  const [dataInicio, setDataInicio] = useState(() => fmtISODate(defaultInicio));
  const [dataFim, setDataFim] = useState(() => fmtISODate(today));
  const [clienteId, setClienteId] = useState<string>("all");
  const [comercialId, setComercialId] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [resumo, setResumo] = useState<QualidadeBaseResumo | null>(null);
  const [activeKpi, setActiveKpi] = useState<KpiPainelId | null>(null);
  const [activeSem, setActiveSem] = useState<SemaforoPainelId | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const semRef = useRef<HTMLDivElement | null>(null);
  const kpiPanelCloseRef = useRef<HTMLButtonElement | null>(null);

  const dateRangeInvalid = dataInicio > dataFim;

  useEffect(() => {
    if (dateRangeInvalid) {
      setLoading(false);
      setResumo(null);
      return;
    }
    setLoading(true);
    const t = window.setTimeout(() => {
      setResumo(MOCK_RESUMO);
      setLoading(false);
    }, 450);
    return () => window.clearTimeout(t);
  }, [dataInicio, dataFim, clienteId, comercialId, dateRangeInvalid]);

  useEffect(() => {
    if (activeKpi) scrollPanelIntoView(panelRef.current);
  }, [activeKpi]);

  useEffect(() => {
    if (activeSem) scrollPanelIntoView(semRef.current);
  }, [activeSem]);

  useEffect(() => {
    if (activeKpi && kpiPanelCloseRef.current) {
      const id = window.setTimeout(() => kpiPanelCloseRef.current?.focus(), 100);
      return () => window.clearTimeout(id);
    }
  }, [activeKpi]);

  const toggleKpi = useCallback((id: KpiPainelId) => {
    setActiveSem(null);
    setActiveKpi((prev) => (prev === id ? null : id));
  }, []);

  const toggleSem = useCallback((id: SemaforoPainelId) => {
    setActiveKpi(null);
    setActiveSem((prev) => (prev === id ? null : id));
  }, []);

  const limparFiltros = () => {
    setDataInicio(fmtISODate(defaultInicio));
    setDataFim(fmtISODate(today));
    setClienteId("all");
    setComercialId("all");
  };

  const maxStakeholdersCliente = useMemo(
    () => Math.max(...MOCK_POR_CLIENTE.map((c) => c.totalStakeholders), 1),
    [],
  );

  const totaisNiveis = useMemo(() => {
    return MOCK_POR_CLIENTE.reduce(
      (acc, c) => ({
        cLevel: acc.cLevel + c.porNivel.cLevel,
        decisor: acc.decisor + c.porNivel.decisor,
        influenciador: acc.influenciador + c.porNivel.influenciador,
        operacional: acc.operacional + c.porNivel.operacional,
        semClassificacao: acc.semClassificacao + c.porNivel.semClassificacao,
      }),
      { cLevel: 0, decisor: 0, influenciador: 0, operacional: 0, semClassificacao: 0 },
    );
  }, []);

  const semaforoFlex = resumo
    ? {
        green: resumo.semaforo.ate30Dias,
        yellow: resumo.semaforo.de31a60Dias,
        red: resumo.semaforo.de61a90Dias,
        critical: resumo.semaforo.acima90Dias,
      }
    : null;

  const orcamentoMi = resumo ? fmtMiBRL(resumo.orcamentoTotal2026.valorMapeadoReais) : "—";

  const desafioRows = useMemo(
    () => [...MOCK_POR_CLIENTE].sort((a, b) => b.percentualSemDesafio - a.percentualSemDesafio),
    [],
  );

  if (!resumo && !loading && !dateRangeInvalid) {
    return (
      <div className="rounded-lg border border-borderSoft bg-surfaceElevated p-8 text-center text-secondaryText">
        Não foi possível carregar os indicadores.
      </div>
    );
  }

  const kpiZero =
    resumo != null &&
    resumo.totalStakeholders === 0 &&
    resumo.semOrcamento2026.quantidade === 0 &&
    resumo.cLevelDecisorSemVisita60Dias.quantidade === 0;

  return (
    <div
      className="mx-auto max-w-[1100px] space-y-4 pb-10"
      data-testid="prototipo-dashboard-comercial-page"
    >
      <nav className="flex flex-wrap items-center gap-1 text-xs text-secondaryText" aria-label="Breadcrumb">
        <Link to="/" className="font-medium text-primary hover:underline">
          Início
        </Link>
        <ChevronRight className="size-3.5 shrink-0 opacity-50" aria-hidden />
        <span className="text-primaryText">Dashboard comercial</span>
      </nav>

      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-on-primary">
          <LayoutDashboard className="size-5" aria-hidden />
        </div>
        <div>
          <h1 className="page-title text-2xl">Dashboard comercial</h1>
          <p className="page-subtitle mt-0.5 max-w-2xl">
            Radar de relacionamento — KPIs de saúde, alcance e gráficos
          </p>
        </div>
      </div>

      <Card data-testid="dashboard-comercial-card-filtros">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0 pb-4 pt-6">
          <div className="flex items-center gap-2 text-base font-semibold text-primaryText">
            <Filter className="size-4 text-secondaryText" aria-hidden />
            Filtros
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1.5 text-info"
            onClick={limparFiltros}
            data-testid="dashboard-comercial-limpar-filtros"
          >
            Limpar filtros
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dateRangeInvalid && (
            <div className="sm:col-span-2 lg:col-span-4 rounded-lg border border-destructive/40 bg-errorSoft/60 px-3 py-2 text-sm text-destructive">
              A data de início não pode ser posterior à data de fim. Ajuste o período para atualizar os indicadores.
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="dc-ini">Data início</Label>
            <Input
              id="dc-ini"
              type="date"
              value={dataInicio}
              error={dateRangeInvalid}
              onChange={(e) => setDataInicio(e.target.value)}
              data-testid="dashboard-comercial-filtro-data-inicio"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dc-fim">Data fim</Label>
            <Input
              id="dc-fim"
              type="date"
              value={dataFim}
              error={dateRangeInvalid}
              onChange={(e) => setDataFim(e.target.value)}
              data-testid="dashboard-comercial-filtro-data-fim"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dc-cliente">Cliente</Label>
            <Select value={clienteId} onValueChange={setClienteId}>
              <SelectTrigger id="dc-cliente" className="border-borderDefault" data-testid="dashboard-comercial-filtro-cliente">
                <SelectValue placeholder="Cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os clientes</SelectItem>
                {MOCK_POR_CLIENTE.map((c) => (
                  <SelectItem key={c.clienteId} value={String(c.clienteId)}>
                    {c.nomeCliente}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dc-comercial">Comercial</Label>
            <Select value={comercialId} onValueChange={setComercialId}>
              <SelectTrigger id="dc-comercial" className="border-borderDefault" data-testid="dashboard-comercial-filtro-comercial">
                <SelectValue placeholder="Comercial" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="1">Ana Comercial</SelectItem>
                <SelectItem value="2">Bruno Comercial</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-dashed opacity-60">
        <CardContent className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm italic text-secondaryText">
            KPIs — Saúde &amp; Alcance (encontros, sem interação, clientes impactados…)
          </p>
          <Badge variant="secondary" className="w-fit">
            Já existe
          </Badge>
        </CardContent>
      </Card>

      <div
        className="flex gap-2 rounded-lg border border-warningBorder bg-warningSoft px-4 py-3 text-sm text-on-warning"
        role="note"
      >
        <AlertTriangle className="size-4 shrink-0 text-warning" aria-hidden />
        <p>
          Nova seção: <strong>Qualidade da base</strong> — entre KPIs de Saúde/Alcance e os gráficos (protótipo).
        </p>
      </div>

      <section aria-labelledby="dc-sec-qualidade-titulo" className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <p id="dc-sec-qualidade-titulo" className="page-section-title">
            Qualidade da base
          </p>
          <Badge className="border-0 bg-accent text-on-accent">novo</Badge>
        </div>

        <div
          role="status"
          aria-live="polite"
          aria-busy={loading}
          className="sr-only"
        >
          {loading ? "A carregar indicadores de qualidade da base." : resumo ? "Indicadores atualizados." : ""}
        </div>

        {/* KPI cards */}
        <div
          className="grid grid-cols-2 gap-3 lg:grid-cols-5"
          role="group"
          aria-label="Indicadores de qualidade da base — selecione um cartão para ver detalhe"
          data-testid="dashboard-comercial-kpi-grid"
        >
          {(loading || !resumo) && !dateRangeInvalid
            ? Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[120px] motion-safe:animate-pulse rounded-lg bg-muted"
                  aria-hidden
                />
              ))
            : null}
          {resumo && !dateRangeInvalid && (
            <>
              <KpiCard
                kpiId="total"
                active={activeKpi === "total"}
                onClick={() => toggleKpi("total")}
                className="bg-primaryText text-on-primary"
                label="Stakeholders cadastrados"
                icon={<Users className="size-4 opacity-70" aria-hidden />}
                value={String(resumo.totalStakeholders)}
                sub={`${resumo.totalClientes} clientes ativos`}
              />
              <KpiCard
                kpiId="orc"
                active={activeKpi === "orc"}
                onClick={() => toggleKpi("orc")}
                className="bg-warning text-on-warning"
                label="Sem orçamento 2026"
                icon={<AlertTriangle className="size-4 opacity-80" aria-hidden />}
                value={String(resumo.semOrcamento2026.quantidade)}
                sub={`${resumo.semOrcamento2026.percentual.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% da base`}
              />
              <KpiCard
                kpiId="visita"
                active={activeKpi === "visita"}
                onClick={() => toggleKpi("visita")}
                className="bg-destructive text-on-destructive"
                label="C-Level / Decisor sem visita 60+ dias"
                icon={<Clock className="size-4 opacity-80" aria-hidden />}
                value={String(resumo.cLevelDecisorSemVisita60Dias.quantidade)}
                sub="Ação recomendada"
              />
              <KpiCard
                kpiId="budget"
                active={activeKpi === "budget"}
                onClick={() => toggleKpi("budget")}
                className="bg-info text-on-info"
                label="Orçamento total 2026"
                icon={<DollarSign className="size-4 opacity-80" aria-hidden />}
                value={orcamentoMi}
                unit="mi"
                sub={`Parcial — ${resumo.orcamentoTotal2026.percentualCobertura}% cobertos`}
              />
              <KpiCard
                kpiId="desafio"
                active={activeKpi === "desafio"}
                onClick={() => toggleKpi("desafio")}
                className="bg-accentSecondary text-on-accent-secondary"
                label="Sem desafio 2026"
                icon={<Target className="size-4 opacity-80" aria-hidden />}
                value={String(resumo.semDesafio2026.quantidade)}
                sub={`${resumo.semDesafio2026.percentual.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% da base`}
              />
            </>
          )}
        </div>

        {resumo && kpiZero && (
          <p className="rounded-lg border border-borderSoft bg-muted/40 px-4 py-3 text-sm text-secondaryText">
            Nenhuma pendência encontrada para o período e filtros seleccionados — óptimo momento para reforçar relacionamento preventivo.
          </p>
        )}
      </section>

      <div ref={panelRef} className="space-y-4">
        {resumo && activeKpi === "total" && (
          <DetailShell
            tone="neutral"
            panelId="kpi-panel-total"
            title="Stakeholders por cliente"
            count={resumo.totalStakeholders}
            onClose={() => setActiveKpi(null)}
            closeRef={kpiPanelCloseRef}
          >
            {MOCK_POR_CLIENTE.map((row) => (
              <div
                key={row.clienteId}
                className="flex flex-col gap-3 border-b border-borderSoft py-3 last:border-0 sm:flex-row sm:flex-wrap sm:items-center"
              >
                <div className="min-w-[120px] text-sm font-semibold text-primaryText">{row.nomeCliente}</div>
                <div className="text-sm font-semibold tabular-nums text-secondaryText sm:w-10 sm:text-right">
                  {row.totalStakeholders}
                </div>
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <div
                    className="flex h-6 min-w-[2rem] items-center rounded-md bg-secondaryText px-2 text-xs font-semibold text-on-primary"
                    style={{
                      width: `${Math.max(8, (row.totalStakeholders / maxStakeholdersCliente) * 100)}%`,
                      maxWidth: "100%",
                    }}
                  >
                    {row.totalStakeholders}
                  </div>
                </div>
                <div className="flex flex-wrap justify-end gap-1.5">
                  <MiniPill label={`${row.porNivel.cLevel} C-Level`} kind="info" />
                  <MiniPill label={`${row.porNivel.decisor} Decisor`} kind="accent" />
                  <MiniPill label={`${row.porNivel.influenciador} Influenc.`} kind="success" />
                  <MiniPill label={`${row.porNivel.operacional} Operac.`} kind="muted" />
                  <MiniPill label={`${row.porNivel.semClassificacao} s/ classif.`} kind="danger" />
                </div>
              </div>
            ))}
            <div className="flex flex-wrap gap-2 border-t border-borderSoft pt-3 text-xs text-secondaryText">
              <span>Resumo:</span>
              <MiniPill label={`${totaisNiveis.cLevel} C-Level`} kind="info" />
              <MiniPill label={`${totaisNiveis.decisor} Decisor`} kind="accent" />
              <MiniPill label={`${totaisNiveis.influenciador} Influenciador`} kind="success" />
              <MiniPill label={`${totaisNiveis.operacional} Operacional`} kind="muted" />
              <MiniPill label={`${totaisNiveis.semClassificacao} sem classificação`} kind="danger" />
            </div>
            <VerTodosFooter total={resumo.totalClientes} entidade="clientes" />
          </DetailShell>
        )}

        {resumo && activeKpi === "orc" && (
          <DetailShell
            tone="amber"
            panelId="kpi-panel-orc"
            title="Stakeholders sem orçamento 2026"
            count={resumo.semOrcamento2026.quantidade}
            onClose={() => setActiveKpi(null)}
            closeRef={kpiPanelCloseRef}
          >
            {MOCK_STAKEHOLDERS_POR_FILTRO.semOrcamento.map((s) => (
              <StakeholderLinha key={s.id} s={s} showDias={false} />
            ))}
            <VerTodosFooter total={resumo.semOrcamento2026.quantidade} entidade="stakeholders" />
          </DetailShell>
        )}

        {resumo && activeKpi === "visita" && (
          <DetailShell
            tone="red"
            panelId="kpi-panel-visita"
            title="C-Level / Decisor sem visita há 60+ dias"
            count={resumo.cLevelDecisorSemVisita60Dias.quantidade}
            onClose={() => setActiveKpi(null)}
            closeRef={kpiPanelCloseRef}
          >
            {MOCK_STAKEHOLDERS_POR_FILTRO.semVisita60.map((s) => (
              <StakeholderLinha key={s.id} s={s} showDias />
            ))}
            <VerTodosFooter total={resumo.cLevelDecisorSemVisita60Dias.quantidade} entidade="stakeholders" />
          </DetailShell>
        )}

        {resumo && activeKpi === "budget" && (
          <DetailShell
            tone="blue"
            panelId="kpi-panel-budget"
            title="Orçamento 2026 por cliente"
            onClose={() => setActiveKpi(null)}
            closeRef={kpiPanelCloseRef}
          >
            <p className="mb-3 flex flex-wrap items-center gap-2 text-xs text-on-warning">
              <span className="rounded-md border border-warningBorder bg-warningSoft px-2 py-1 font-medium">
                Total parcial — soma dos stakeholders com orçamento preenchido
              </span>
            </p>
            <div className="grid grid-cols-[2fr_1.2fr_1.2fr_auto] gap-2 border-b border-borderSoft pb-2 text-[10px] font-semibold uppercase tracking-wide text-secondaryText">
              <span>Cliente</span>
              <span>Orçamento mapeado</span>
              <span>Cobertura</span>
              <span />
            </div>
            {MOCK_POR_CLIENTE.map((row) => (
              <div
                key={row.clienteId}
                className="grid grid-cols-1 items-center gap-2 border-b border-borderSoft py-2.5 text-sm last:border-0 sm:grid-cols-[2fr_1.2fr_1.2fr_auto]"
              >
                <span className="font-semibold text-primaryText">{row.nomeCliente}</span>
                <span className="tabular-nums">R$ {fmtMiBRL(row.orcamentoMapeadoReais)} mi</span>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn("h-full rounded-full", coverageBarClass(row.percentualCobertura))}
                      style={{ width: `${row.percentualCobertura}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-xs text-secondaryText">{row.percentualCobertura}%</span>
                </div>
                <span className="text-xs text-secondaryText">
                  {row.stakeholdersComOrcamento}/{row.totalStakeholders}
                </span>
              </div>
            ))}
          </DetailShell>
        )}

        {resumo && activeKpi === "desafio" && (
          <DetailShell
            tone="teal"
            panelId="kpi-panel-desafio"
            title="Stakeholders sem desafio 2026 por cliente"
            count={resumo.semDesafio2026.quantidade}
            onClose={() => setActiveKpi(null)}
            closeRef={kpiPanelCloseRef}
          >
            <div className="grid grid-cols-[2fr_1fr_0.8fr] gap-2 border-b border-borderSoft pb-2 text-[10px] font-semibold uppercase tracking-wide text-secondaryText">
              <span>Cliente</span>
              <span>Sem desafio</span>
              <span>% da base</span>
            </div>
            {desafioRows.map((row) => (
              <div
                key={row.clienteId}
                className="grid grid-cols-1 gap-1 border-b border-borderSoft py-2.5 text-sm last:border-0 sm:grid-cols-[2fr_1fr_0.8fr]"
              >
                <span className="font-semibold text-primaryText">{row.nomeCliente}</span>
                <span
                  className={cn(
                    "font-medium",
                    row.percentualSemDesafio >= 55 ? "text-destructive" : "text-warning",
                  )}
                >
                  {row.semDesafio} de {row.totalStakeholders}
                </span>
                <span
                  className={cn(
                    "font-medium",
                    row.percentualSemDesafio >= 55 ? "text-destructive" : "text-warning",
                  )}
                >
                  {row.percentualSemDesafio.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}%
                </span>
              </div>
            ))}
          </DetailShell>
        )}
      </div>

      {/* Semáforo */}
      {resumo && semaforoFlex && (
        <Card
          ref={semRef}
          className={cn(
            "border-borderSoft transition-colors",
            activeSem && "border-borderDefault shadow-softToken",
          )}
          data-testid="dashboard-comercial-semaforo"
        >
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0 pb-3">
            <span id="dc-semaforo-titulo" className="text-sm font-semibold text-primaryText">
              Recência de visita
            </span>
            <Badge variant="outline" className="border-info/30 bg-infoSoft font-medium text-info">
              C-Level / Decisor
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3" aria-labelledby="dc-semaforo-titulo">
            <p className="sr-only">
              Semáforo apenas para perfis C-Level e Decisor. Use as teclas Enter ou Espaço nos segmentos após focar com Tab.
            </p>
            <div
              className="flex min-h-10 items-stretch gap-0.5 overflow-hidden rounded-md py-1"
              role="group"
              aria-label="Distribuição por dias sem visita"
            >
              {(
                [
                  ["green", semaforoFlex.green, "bg-success", activeSem === "green", "Até 30 dias"],
                  ["yellow", semaforoFlex.yellow, "bg-warning", activeSem === "yellow", "31 a 60 dias"],
                  ["red", semaforoFlex.red, "bg-destructive", activeSem === "red", "61 a 90 dias"],
                  [
                    "critical",
                    semaforoFlex.critical,
                    "bg-[color-mix(in_srgb,var(--color-error)_82%,#000_18%)]",
                    activeSem === "critical",
                    "Mais de 90 dias",
                  ],
                ] as const
              ).map(([key, count, bg, active, labelHuman], idx, arr) => (
                <button
                  key={key}
                  type="button"
                  style={{ flex: Math.max(count, 1) }}
                  onClick={() => toggleSem(key as SemaforoPainelId)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleSem(key as SemaforoPainelId);
                    }
                  }}
                  className={cn(
                    "relative min-h-8 min-w-[2rem] motion-safe:transition-all",
                    bg,
                    idx === 0 && "rounded-l-md",
                    idx === arr.length - 1 && "rounded-r-md",
                    active ? "motion-safe:scale-y-[1.15] shadow-md ring-2 ring-white/50" : "hover:opacity-90",
                    activeSem && !active && "opacity-35",
                  )}
                  aria-pressed={active}
                  aria-label={`${labelHuman}: ${count} stakeholders`}
                >
                  <span className="sr-only">
                    {labelHuman}, {count} contactos
                  </span>
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
              <SemLeg
                active={activeSem === "green"}
                onClick={() => toggleSem("green")}
                dotClass="bg-success"
                label={`Até 30d (${semaforoFlex.green})`}
              />
              <SemLeg
                active={activeSem === "yellow"}
                onClick={() => toggleSem("yellow")}
                dotClass="bg-warning"
                label={`31–60d (${semaforoFlex.yellow})`}
              />
              <SemLeg
                active={activeSem === "red"}
                onClick={() => toggleSem("red")}
                dotClass="bg-destructive"
                label={`61–90d (${semaforoFlex.red})`}
              />
              <SemLeg
                active={activeSem === "critical"}
                onClick={() => toggleSem("critical")}
                dotClass="bg-[color-mix(in_srgb,var(--color-error)_82%,#000_18%)]"
                label={`90+d (${semaforoFlex.critical})`}
              />
            </div>

            {activeSem === "green" && (
              <SemDetail
                title="Até 30 dias — relacionamento ativo"
                count={semaforoFlex.green}
                dotClass="bg-success"
                badgeClass="bg-success text-on-success"
                onClose={() => toggleSem("green")}
                filtroKey="semaforoVerde"
              />
            )}
            {activeSem === "yellow" && (
              <SemDetail
                title="31–60 dias — atenção"
                count={semaforoFlex.yellow}
                dotClass="bg-warning"
                badgeClass="bg-warning text-on-warning"
                onClose={() => toggleSem("yellow")}
                filtroKey="semaforoAmbar"
              />
            )}
            {activeSem === "red" && (
              <SemDetail
                title="61–90 dias — risco de esfriamento"
                count={semaforoFlex.red}
                dotClass="bg-destructive"
                badgeClass="bg-destructive text-on-destructive"
                onClose={() => toggleSem("red")}
                filtroKey="semaforoVermelho"
              />
            )}
            {activeSem === "critical" && (
              <SemDetail
                title="90+ dias — risco crítico"
                count={semaforoFlex.critical}
                dotClass="bg-[color-mix(in_srgb,var(--color-error)_82%,#000_18%)]"
                badgeClass="bg-[color-mix(in_srgb,var(--color-error)_82%,#000_18%)] text-on-destructive"
                onClose={() => toggleSem("critical")}
                filtroKey="semaforo90mais"
              />
            )}
          </CardContent>
        </Card>
      )}

      <Separator className="my-6 border-dashed" />

      <Card className="border-dashed opacity-60">
        <CardContent className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm italic text-secondaryText">
            Gráficos: Foco por Categoria · Níveis Estratégicos Acessados · Dedicação por Objetivo
          </p>
          <Badge variant="secondary" className="w-fit">
            Já existe
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}

function KpiCard({
  kpiId,
  active,
  onClick,
  className,
  label,
  icon,
  value,
  unit,
  sub,
}: {
  kpiId: string;
  active: boolean;
  onClick: () => void;
  className: string;
  label: string;
  icon: ReactNode;
  value: string;
  unit?: string;
  sub: string;
}) {
  const panelDomId = `kpi-panel-${kpiId}`;
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={`dashboard-comercial-kpi-${kpiId}`}
      aria-expanded={active}
      aria-controls={panelDomId}
      className={cn(
        "relative flex min-h-[118px] flex-col justify-between rounded-lg p-4 text-left shadow-softToken motion-safe:transition-all",
        "motion-safe:hover:-translate-y-0.5 hover:shadow-cardHoverToken focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
        active && "ring-2 ring-white/40 ring-offset-2 ring-offset-background",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="max-w-[85%] text-[11px] font-semibold uppercase leading-snug tracking-wide opacity-90">
          {label}
        </span>
        {icon}
      </div>
      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-semibold tabular-nums leading-none">{value}</span>
          {unit && <span className="text-sm opacity-80">{unit}</span>}
        </div>
        <p className="mt-1 text-[11px] opacity-75">{sub}</p>
      </div>
      <span className="absolute bottom-2.5 right-3 text-[10px] opacity-50">Clique para detalhe</span>
    </button>
  );
}

type DetailTone = "neutral" | "amber" | "red" | "blue" | "teal";

function DetailShell({
  tone,
  panelId,
  title,
  count,
  onClose,
  closeRef,
  children,
}: {
  tone: DetailTone;
  panelId: string;
  title: string;
  count?: number;
  onClose: () => void;
  closeRef?: RefObject<HTMLButtonElement | null>;
  children: ReactNode;
}) {
  const shell = {
    neutral: "border-borderDefault bg-surfaceElevated",
    amber: "border-warningBorder bg-warningSoft/40",
    red: "border-destructive/30 bg-errorSoft/50",
    blue: "border-infoBorder bg-infoSoft/40",
    teal: "border-successBorder bg-successSoft/30",
  }[tone];
  const head = {
    neutral: "bg-muted/50 border-borderSoft",
    amber: "bg-warningSoft border-warningBorder",
    red: "bg-errorSoft/80 border-destructive/20",
    blue: "bg-infoSoft/60 border-infoBorder",
    teal: "bg-successSoft/50 border-successBorder",
  }[tone];
  return (
    <Card id={panelId} role="region" aria-labelledby={`${panelId}-titulo`} className={cn("overflow-hidden shadow-softToken", shell)}>
      <div className={cn("flex items-center justify-between border-b px-5 py-3", head)}>
        <div className="flex flex-wrap items-center gap-2">
          <h2 id={`${panelId}-titulo`} className="text-sm font-semibold text-primaryText">
            {title}
          </h2>
          {count != null && (
            <Badge className="border-0 bg-primaryText text-on-primary text-[11px]">{count}</Badge>
          )}
        </div>
        <Button
          ref={closeRef}
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={onClose}
          aria-label="Fechar painel de detalhe"
        >
          <X className="size-4" aria-hidden />
        </Button>
      </div>
      <CardContent className="p-0 px-5 py-2">{children}</CardContent>
    </Card>
  );
}

function StakeholderLinha({ s, showDias }: { s: StakeholderDetalheDto; showDias: boolean }) {
  const diasClass =
    s.diasSemVisita == null
      ? "text-secondaryText"
      : s.diasSemVisita <= 30
        ? "text-success"
        : s.diasSemVisita <= 60
          ? "text-warning"
          : s.diasSemVisita <= 90
            ? "text-destructive"
            : "text-[color-mix(in_srgb,var(--color-error)_75%,#000_25%)]";

  return (
    <div className="flex flex-col gap-2 border-b border-borderSoft py-3 last:border-0 sm:flex-row sm:items-center sm:gap-3">
      <Avatar className="h-9 w-9">
        <AvatarFallback className={cn("text-[11px] font-semibold", avatarToneClass(s.id))}>
          {iniciais(s.nomeColaborador)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-primaryText">{s.nomeColaborador}</p>
        <p className="text-xs text-secondaryText">
          {s.empresa} · {s.cargo}
        </p>
      </div>
      <NivelBadge nivel={s.nivel} />
      {showDias && s.diasSemVisita != null && (
        <span className={cn("text-sm font-semibold tabular-nums sm:min-w-[4.5rem] sm:text-right", diasClass)}>
          {s.diasSemVisita} dias
        </span>
      )}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="shrink-0 border-info text-info hover:bg-infoSoft"
        aria-label={`Ver perfil de ${s.nomeColaborador}`}
        data-testid={`dashboard-comercial-ver-perfil-${s.id}`}
      >
        Ver perfil
      </Button>
    </div>
  );
}

function VerTodosFooter({ total, entidade }: { total: number; entidade: string }) {
  return (
    <button
      type="button"
      className="w-full border-t border-borderSoft py-3 text-center text-sm font-medium text-info transition-colors hover:bg-infoSoft/30"
      aria-label={`Ver todos os ${total} ${entidade} (protótipo — sem navegação)`}
      data-testid={`dashboard-comercial-ver-todos-${entidade}`}
    >
      Ver todos os {total} {entidade} →
    </button>
  );
}

function MiniPill({ label, kind }: { label: string; kind: "info" | "accent" | "success" | "muted" | "danger" }) {
  const map = {
    info: "bg-infoSoft text-info",
    accent: "bg-accentSoft text-accent",
    success: "bg-success/15 text-success",
    muted: "bg-muted text-secondaryText",
    danger: "bg-error/10 text-error",
  }[kind];
  return <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-semibold", map)}>{label}</span>;
}

function SemLeg({
  active,
  onClick,
  dotClass,
  label,
}: {
  active: boolean;
  onClick: () => void;
  dotClass: string;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-center gap-1.5 rounded-md px-1.5 py-1 text-secondaryText transition-colors hover:bg-muted",
        active && "bg-muted font-semibold text-primaryText",
      )}
    >
      <span className={cn("size-2 shrink-0 rounded-sm", dotClass)} aria-hidden />
      {label}
    </button>
  );
}

function SemDetail({
  title,
  count,
  dotClass,
  badgeClass,
  onClose,
  filtroKey,
}: {
  title: string;
  count: number;
  dotClass: string;
  badgeClass: string;
  onClose: () => void;
  filtroKey: keyof typeof MOCK_STAKEHOLDERS_POR_FILTRO;
}) {
  const rows = MOCK_STAKEHOLDERS_POR_FILTRO[filtroKey] ?? [];
  return (
    <div className="space-y-3 border-t border-borderSoft pt-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn("size-2.5 shrink-0 rounded-sm", dotClass)} aria-hidden />
          <span className="text-sm font-semibold text-primaryText">{title}</span>
          <Badge className={cn("border-0 text-[11px]", badgeClass)}>{count}</Badge>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onClose}
          aria-label="Fechar painel do semáforo"
        >
          <X className="size-4" aria-hidden />
        </Button>
      </div>
      {rows.map((s) => (
        <StakeholderLinha key={s.id} s={s} showDias />
      ))}
      <VerTodosFooter total={count} entidade="stakeholders" />
    </div>
  );
}
