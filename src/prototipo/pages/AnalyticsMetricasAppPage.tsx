import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, ChevronRight, Download, Filter, Flame, ScanEye } from "lucide-react";
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
import { getMockFirebaseAppDashboard } from "@/prototipo/analytics/mockFirebaseApp";
import { getMockContentsquareAppDashboard } from "@/prototipo/analytics/mockContentsquareApp";
import { FirebaseAppDashboard } from "@/prototipo/analytics/FirebaseAppDashboard";
import { ContentsquareAppDashboard } from "@/prototipo/analytics/ContentsquareAppDashboard";

type AppFonte = "firebase" | "contentsquare";

function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function fmtISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function AnalyticsMetricasAppPage() {
  const today = useMemo(() => new Date(), []);
  const defaultInicio = useMemo(() => addDays(today, -13), [today]);

  const [fonte, setFonte] = useState<AppFonte>("firebase");
  const [environment, setEnvironment] = useState<AnalyticsEnvironment>("hml");
  const [platform, setPlatform] = useState<AnalyticsPlatform>("all");
  const [dataInicio, setDataInicio] = useState(() => fmtISODate(defaultInicio));
  const [dataFim, setDataFim] = useState(() => fmtISODate(today));
  const [loading, setLoading] = useState(true);

  const dateRangeInvalid = dataInicio > dataFim;

  useEffect(() => {
    if (dateRangeInvalid) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const t = window.setTimeout(() => setLoading(false), 400);
    return () => window.clearTimeout(t);
  }, [dataInicio, dataFim, environment, platform, fonte, dateRangeInvalid]);

  const firebaseData = useMemo(
    () =>
      dateRangeInvalid ? null : getMockFirebaseAppDashboard(environment, platform, dataInicio, dataFim),
    [environment, platform, dataInicio, dataFim, dateRangeInvalid],
  );

  const contentsquareData = useMemo(
    () =>
      dateRangeInvalid ? null : getMockContentsquareAppDashboard(environment, platform, dataInicio, dataFim),
    [environment, platform, dataInicio, dataFim, dateRangeInvalid],
  );

  const limparFiltros = () => {
    setDataInicio(fmtISODate(defaultInicio));
    setDataFim(fmtISODate(today));
    setEnvironment("hml");
    setPlatform("all");
  };

  return (
    <div className="mx-auto max-w-[1100px] space-y-4 pb-10" data-testid="analytics-metricas-app-page">
      <nav className="flex flex-wrap items-center gap-1 text-xs text-secondaryText" aria-label="Breadcrumb">
        <Link to="/" className="font-medium text-primary hover:underline">
          Início
        </Link>
        <ChevronRight className="size-3.5 shrink-0 opacity-50" aria-hidden />
        <span className="text-primaryText">Métricas APP</span>
      </nav>

      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-on-primary">
          <BarChart3 className="size-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="page-title text-2xl">Métricas APP</h1>
            <Badge variant="secondary" className="font-normal" data-testid="analytics-badge-mock">
              Dados simulados
            </Badge>
          </div>
          <p className="page-subtitle mt-0.5 max-w-2xl">
            Acompanhamento quantitativo (Firebase/GA4) e qualitativo (Contentsquare) do app Flutter — mocks até integração
            com API; comparativo Web em evolução.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 gap-2"
          data-testid="analytics-download-integracao-doc"
          onClick={() => downloadTechnicalDoc("ANALYTICS_METRICAS_APP_DOCUMENTACAO_TECNICA.md")}
        >
          <Download className="size-4" aria-hidden />
          Guia integração (.md)
        </Button>
      </div>

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
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          </CardContent>
        </Card>

        {loading ? (
          <div
            className={cn(
              "rounded-lg border border-borderSoft bg-surfaceElevated p-12 text-center text-secondaryText",
            )}
            aria-busy="true"
          >
            A carregar métricas…
          </div>
        ) : dateRangeInvalid ? (
          <div className="rounded-lg border border-borderSoft bg-surfaceElevated p-8 text-center text-secondaryText">
            Ajuste o período para visualizar os dashboards.
          </div>
        ) : (
          <>
            <TabsContent value="firebase" className="mt-4">
              {firebaseData ? <FirebaseAppDashboard data={firebaseData} /> : null}
            </TabsContent>
            <TabsContent value="contentsquare" className="mt-4">
              {contentsquareData ? <ContentsquareAppDashboard data={contentsquareData} /> : null}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
