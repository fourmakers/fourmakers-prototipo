import { Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { FirebaseAppDashboardData } from "./types";
import {
  AnalyticsEventTable,
  AnalyticsFunisGrid,
  AnalyticsKpiGrid,
  AnalyticsScreenTable,
  AnalyticsSerieChart,
  IntegracaoBadges,
} from "./AnalyticsShared";

export function FirebaseAppDashboard({ data }: { data: FirebaseAppDashboardData }) {
  return (
    <div className="space-y-6" data-testid="analytics-firebase-dashboard">
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-borderSoft bg-primarySoft/40 px-4 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/20 text-warning">
          <Flame className="size-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-primaryText">App — Firebase Analytics / GA4</p>
          <p className="text-xs text-secondaryText">{data.periodoLabel}</p>
        </div>
        <IntegracaoBadges
          items={[
            { label: "BigQuery Export", ativo: data.integracao.bigQueryExportAtivo },
            { label: "DebugView", ativo: data.integracao.debugViewAtivo },
          ]}
        />
      </div>

      <AnalyticsKpiGrid kpis={data.kpis} testIdPrefix="analytics-firebase" />

      <AnalyticsSerieChart
        titulo="Eventos por dia (mock BigQuery events_*)"
        serie={data.eventosPorDia}
        testId="analytics-firebase-chart-eventos"
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <AnalyticsEventTable
          titulo="Top eventos (AnalyticsEvents)"
          rows={data.topEventos}
          testId="analytics-firebase-top-eventos"
        />
        <AnalyticsScreenTable
          titulo="Screen views (RouteObserver)"
          rows={data.screenViews}
          testId="analytics-firebase-screens"
        />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-primaryText">Funis por feature</h3>
        <AnalyticsFunisGrid funis={data.funis} testIdPrefix="analytics-firebase" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-borderSoft bg-surfaceElevated shadow-softToken">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-primaryText">User properties</CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6 sm:pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Propriedade</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead className="text-right">Utilizadores</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.userProperties.map((p, i) => (
                  <TableRow key={`${p.name}-${p.value}-${i}`}>
                    <TableCell className="font-mono text-xs">{p.name}</TableCell>
                    <TableCell>{p.value}</TableCell>
                    <TableCell className="text-right tabular-nums">{p.usuarios.toLocaleString("pt-BR")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <AnalyticsEventTable
          titulo="Erros e fricção (eventos)"
          rows={data.erros}
          testId="analytics-firebase-erros"
        />
      </div>

      <Card className="border-borderSoft bg-secondaryBackground/80">
        <CardContent className="flex flex-wrap items-center justify-between gap-2 p-4 text-xs text-secondaryText">
          <span>
            Última sync BigQuery:{" "}
            <time dateTime={data.integracao.ultimaSyncBigQuery}>
              {new Date(data.integracao.ultimaSyncBigQuery).toLocaleString("pt-BR")}
            </time>
          </span>
          <Badge variant="outline" className="font-normal">
            Comparativo Web — em breve
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
