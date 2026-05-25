import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, BarChart3, ChevronRight, Download, Filter, Flame, RefreshCw, ScanEye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { downloadTechnicalDoc } from "@/prototipo/downloadTechnicalDoc";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { AnalyticsEnvironment, AnalyticsPlatform } from "@/prototipo/analytics/types";
import { FirebaseAppDashboard } from "@/prototipo/analytics/FirebaseAppDashboard";
import { ContentsquareAppDashboard } from "@/prototipo/analytics/ContentsquareAppDashboard";
import { AnalyticsHubStatusCard } from "@/prototipo/analytics/AnalyticsHubStatusCard";
import { APP_FEATURES } from "@/prototipo/analytics/analyticsHubCatalog";
import { analyticsApiBaseUrl, analyticsUseMock, describeAnalyticsDataMode } from "@/prototipo/analytics/api/analyticsConfig";
import type { AnalyticsUiFilter } from "@/prototipo/analytics/api/analyticsApiClient";
import { AnalyticsApiError } from "@/prototipo/analytics/api/analyticsApiTypes";
import {
  useContentsquareAppDashboardQuery,
  useFirebaseAppDashboardQuery,
} from "@/prototipo/analytics/api/analyticsQueries";

type AppFonte = "firebase" | "contentsquare";

function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function fmtISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function AnalyticsApiErrorPanel({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <Card className="border-destructive/40 bg-errorSoft/40" data-testid="analytics-api-error">
      <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <AlertCircle className="size-5 shrink-0 text-destructive" aria-hidden />
          <div>
            <p className="font-semibold text-primaryText">Não foi possível carregar da Analytics API</p>
            <p className="mt-1 text-sm text-secondaryText">{message}</p>
            <p className="mt-2 text-xs text-secondaryText">
              Configure <code className="rounded bg-secondaryBackground px-1">VITE_ANALYTICS_API_BASE_URL</code> e{" "}
              <code className="rounded bg-secondaryBackground px-1">VITE_ANALYTICS_USE_MOCK=false</code>, ou active{" "}
              <code className="rounded bg-secondaryBackground px-1">VITE_ANALYTICS_FALLBACK_MOCK=true</code>.
            </p>
          </div>
        </div>
        <Button type="button" variant="outline" size="sm" className="shrink-0 gap-2" onClick={onRetry}>
          <RefreshCw className="size-4" aria-hidden />
          Tentar novamente
        </Button>
      </CardContent>
    </Card>
  );
}

export function AnalyticsMetricasAppPage() {
  const queryClient = useQueryClient();
  const today = useMemo(() => new Date(), []);
  const defaultInicio = useMemo(() => addDays(today, -13), [today]);

  const [fonte, setFonte] = useState<AppFonte>("firebase");
  const [environment, setEnvironment] = useState<AnalyticsEnvironment>("hml");
  const [platform, setPlatform] = useState<AnalyticsPlatform>("all");
  const [feature, setFeature] = useState<string>("all");
  const [dataInicio, setDataInicio] = useState(() => fmtISODate(defaultInicio));
  const [dataFim, setDataFim] = useState(() => fmtISODate(today));

  const dateRangeInvalid = dataInicio > dataFim;

  const uiFilter: AnalyticsUiFilter = useMemo(
    () => ({
      dataInicio,
      dataFim,
      environment,
      platform,
      feature: feature === "all" ? undefined : feature,
    }),
    [dataInicio, dataFim, environment, platform, feature],
  );

  const filtersEnabled = !dateRangeInvalid;

  const firebaseQuery = useFirebaseAppDashboardQuery(uiFilter, filtersEnabled && fonte === "firebase");
  const contentsquareQuery = useContentsquareAppDashboardQuery(
    uiFilter,
    filtersEnabled && fonte === "contentsquare",
  );

  const activeQuery = fonte === "firebase" ? firebaseQuery : contentsquareQuery;
  const dataMode = activeQuery.data?.mode;
  const badgeLabel = dataMode ? describeAnalyticsDataMode(dataMode) : analyticsUseMock() ? "Dados simulados" : "Analytics API";

  const limparFiltros = () => {
    setDataInicio(fmtISODate(defaultInicio));
    setDataFim(fmtISODate(today));
    setEnvironment("hml");
    setPlatform("all");
    setFeature("all");
  };

  const retry = () => {
    void queryClient.invalidateQueries({ queryKey: ["analytics"] });
  };

  const apiErrorMessage =
    activeQuery.error instanceof AnalyticsApiError
      ? activeQuery.error.message
      : activeQuery.error instanceof Error
        ? activeQuery.error.message
        : "Erro desconhecido.";

  return (
    <div className="mx-auto max-w-[1100px] space-y-4 pb-10" data-testid="analytics-metricas-app-page">
      <nav className="flex flex-wrap items-center gap-1 text-xs text-secondaryText" aria-label="Breadcrumb">
        <Link to="/" className="font-medium text-primary hover:underline">
          Início
        </Link>
        <ChevronRight className="size-3.5 shrink-0 opacity-50" aria-hidden />
        <span className="text-primaryText">Métricas APP</span>
      </nav>

      <div className="flex flex-wrap items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-on-primary">
          <BarChart3 className="size-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="page-title text-2xl">Métricas APP</h1>
            <Badge
              variant={dataMode === "api" ? "default" : "secondary"}
              className="font-normal"
              data-testid="analytics-badge-data-mode"
            >
              {badgeLabel}
            </Badge>
          </div>
          <p className="page-subtitle mt-0.5 max-w-2xl">
            Firebase/GA4 (BigQuery) e Contentsquare via Analytics API FourMakers — mocks quando não há API configurada.
          </p>
          {!analyticsUseMock() && analyticsApiBaseUrl() ? (
            <p className="mt-1 text-xs text-secondaryText">
              API: <span className="font-mono">{analyticsApiBaseUrl()}</span>
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            data-testid="analytics-download-cenario-dev"
            onClick={() => downloadTechnicalDoc("ANALYTICS_HUB_CENARIO_ESTADO_E_PENDENCIAS.md")}
          >
            <Download className="size-4" aria-hidden />
            Cenário dev (.md)
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            data-testid="analytics-download-status-report"
            onClick={() => downloadTechnicalDoc("ANALYTICS_INTEGRACAO_STATUS_REPORT.md")}
          >
            <Download className="size-4" aria-hidden />
            Relatório integração
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            data-testid="analytics-download-necessidades-doc"
            onClick={() => downloadTechnicalDoc("ANALYTICS_METRICAS_APP_NECESSIDADES_INTEGRACAO_API.md")}
          >
            <Download className="size-4" aria-hidden />
            Necessidades API
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            data-testid="analytics-download-integracao-doc"
            onClick={() => downloadTechnicalDoc("ANALYTICS_METRICAS_APP_DOCUMENTACAO_TECNICA.md")}
          >
            <Download className="size-4" aria-hidden />
            Doc técnica (.md)
          </Button>
        </div>
      </div>

      <AnalyticsHubStatusCard />

      <Tabs
        value={fonte}
        onValueChange={(v) => setFonte(v as AppFonte)}
        className="w-full"
        data-testid="analytics-fonte-tabs"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-secondaryBackground">
          <TabsTrigger value="firebase" className="gap-2" data-testid="analytics-tab-firebase">
            <Flame className="size-4" aria-hidden />
            App — Firebase
          </TabsTrigger>
          <TabsTrigger value="contentsquare" className="gap-2" data-testid="analytics-tab-contentsquare">
            <ScanEye className="size-4" aria-hidden />
            App — Contentsquare
          </TabsTrigger>
        </TabsList>

        <Card className="mt-4 border-borderSoft bg-surfaceElevated shadow-softToken" data-testid="analytics-card-filtros">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0 pb-4 pt-6">
            <div className="flex items-center gap-2 text-base font-semibold text-primaryText">
              <Filter className="size-4 text-secondaryText" aria-hidden />
              Filtros
            </div>
            <Button type="button" variant="ghost" size="sm" className="gap-1.5 text-info" onClick={limparFiltros}>
              Limpar filtros
            </Button>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {dateRangeInvalid && (
              <div className="sm:col-span-2 lg:col-span-4 rounded-lg border border-destructive/40 bg-errorSoft/60 px-3 py-2 text-sm text-destructive">
                A data de início não pode ser posterior à data de fim.
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="an-ini">Data início</Label>
              <Input
                id="an-ini"
                type="date"
                value={dataInicio}
                error={dateRangeInvalid}
                onChange={(e) => setDataInicio(e.target.value)}
                data-testid="analytics-filtro-data-inicio"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="an-fim">Data fim</Label>
              <Input
                id="an-fim"
                type="date"
                value={dataFim}
                error={dateRangeInvalid}
                onChange={(e) => setDataFim(e.target.value)}
                data-testid="analytics-filtro-data-fim"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="an-env">Ambiente</Label>
              <Select value={environment} onValueChange={(v) => setEnvironment(v as AnalyticsEnvironment)}>
                <SelectTrigger id="an-env" data-testid="analytics-filtro-ambiente">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dev">Desenvolvimento</SelectItem>
                  <SelectItem value="hml">Homologação</SelectItem>
                  <SelectItem value="prod">Produção</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="an-plat">Plataforma</Label>
              <Select value={platform} onValueChange={(v) => setPlatform(v as AnalyticsPlatform)}>
                <SelectTrigger id="an-plat" data-testid="analytics-filtro-plataforma">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Android + iOS</SelectItem>
                  <SelectItem value="android">Android</SelectItem>
                  <SelectItem value="ios">iOS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="an-feat">Feature</Label>
              <Select value={feature} onValueChange={setFeature}>
                <SelectTrigger id="an-feat" data-testid="analytics-filtro-feature">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {APP_FEATURES.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {dateRangeInvalid ? (
          <div className="rounded-lg border border-borderSoft bg-surfaceElevated p-8 text-center text-secondaryText">
            Ajuste o período para visualizar os dashboards.
          </div>
        ) : activeQuery.isPending ? (
          <div
            className={cn(
              "rounded-lg border border-borderSoft bg-surfaceElevated p-12 text-center text-secondaryText",
            )}
            aria-busy="true"
            data-testid="analytics-loading"
          >
            A carregar métricas…
          </div>
        ) : activeQuery.isError ? (
          <AnalyticsApiErrorPanel message={apiErrorMessage} onRetry={retry} />
        ) : (
          <>
            <TabsContent value="firebase" className="mt-4">
              {firebaseQuery.data ? <FirebaseAppDashboard data={firebaseQuery.data.data} /> : null}
            </TabsContent>
            <TabsContent value="contentsquare" className="mt-4">
              {contentsquareQuery.data ? <ContentsquareAppDashboard data={contentsquareQuery.data.data} /> : null}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
