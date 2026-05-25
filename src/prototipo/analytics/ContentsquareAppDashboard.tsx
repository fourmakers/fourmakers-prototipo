import { ScanEye } from "lucide-react";
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
import { cn } from "@/lib/utils";
import type { ContentsquareAppDashboardData } from "./types";
import {
  AnalyticsKpiGrid,
  AnalyticsScreenTable,
  AnalyticsSerieChart,
  IntegracaoBadges,
} from "./AnalyticsShared";

function maskingBadgeClass(nivel: string): string {
  if (nivel === "Máximo" || nivel === "Muito alto") return "bg-destructive/15 text-destructive";
  if (nivel.includes("Alto")) return "bg-warning/15 text-warning";
  return "bg-info/15 text-info";
}

export function ContentsquareAppDashboard({ data }: { data: ContentsquareAppDashboardData }) {
  return (
    <div className="space-y-6" data-testid="analytics-contentsquare-dashboard">
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-borderSoft bg-accentSoft/50 px-4 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/20 text-accent">
          <ScanEye className="size-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-primaryText">App — Contentsquare</p>
          <p className="text-xs text-secondaryText">{data.periodoLabel}</p>
        </div>
        <IntegracaoBadges
          items={[
            { label: "SDK directo", ativo: data.integracao.sdkIniciado },
            { label: "Session Replay", ativo: data.integracao.sessionReplayAtivo },
            { label: "GTM complementar", ativo: data.integracao.gtmComplementar },
          ]}
        />
      </div>

      <AnalyticsKpiGrid kpis={data.kpis} testIdPrefix="analytics-contentsquare" />

      <AnalyticsSerieChart
        titulo="Sessões analisadas por dia"
        serie={data.sessoesPorDia}
        testId="analytics-contentsquare-chart-sessoes"
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <AnalyticsScreenTable
          titulo="Screen views prioritários"
          rows={data.screenViews}
          testId="analytics-contentsquare-screens"
        />

        <Card className="border-borderSoft bg-surfaceElevated shadow-softToken" data-testid="analytics-contentsquare-conversoes">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-primaryText">Conversões</CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6 sm:pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Evento</TableHead>
                  <TableHead className="text-right">Sessões</TableHead>
                  <TableHead className="text-right">Taxa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.conversoes.map((c) => (
                  <TableRow key={c.nome}>
                    <TableCell className="font-mono text-xs">{c.nome}</TableCell>
                    <TableCell className="text-right tabular-nums">{c.sessoes.toLocaleString("pt-BR")}</TableCell>
                    <TableCell className="text-right tabular-nums text-success">{c.taxaPct}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="border-borderSoft bg-surfaceElevated shadow-softToken" data-testid="analytics-contentsquare-fricoes">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-primaryText">Fricção e falhas</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 sm:pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evento</TableHead>
                <TableHead className="text-right">Ocorrências</TableHead>
                <TableHead className="text-right">Sessões afectadas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.fricoes.map((f) => (
                <TableRow key={f.eventName}>
                  <TableCell className="font-mono text-xs text-destructive">{f.eventName}</TableCell>
                  <TableCell className="text-right tabular-nums">{f.ocorrencias.toLocaleString("pt-BR")}</TableCell>
                  <TableCell className="text-right tabular-nums">{f.sessoesAfetadas.toLocaleString("pt-BR")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-borderSoft bg-surfaceElevated shadow-softToken">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-primaryText">Custom variables (seguras)</CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6 sm:pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Variável</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead className="text-right">Sessões</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.customVariables.map((v, i) => (
                  <TableRow key={`${v.name}-${v.value}-${i}`}>
                    <TableCell className="font-mono text-xs">{v.name}</TableCell>
                    <TableCell>{v.value}</TableCell>
                    <TableCell className="text-right tabular-nums">{v.usuarios.toLocaleString("pt-BR")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-borderSoft bg-surfaceElevated shadow-softToken" data-testid="analytics-contentsquare-jornadas">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-primaryText">Jornadas frequentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.jornadaTop.map((j) => (
              <div key={j.passo} className="rounded-lg border border-borderSoft bg-secondaryBackground/60 p-3">
                <div className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="font-medium text-primaryText">{j.passo}</span>
                  <span className="tabular-nums text-secondaryText">{j.sessoes.toLocaleString("pt-BR")} sessões</span>
                </div>
                {j.dropoffPct != null ? (
                  <p className="mt-1 text-xs text-warning">Drop-off {j.dropoffPct}%</p>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-borderSoft bg-surfaceElevated shadow-softToken" data-testid="analytics-contentsquare-masking">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-primaryText">Session Replay e masking por tela</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 sm:pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tela</TableHead>
                <TableHead>Replay</TableHead>
                <TableHead>Masking</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.maskingPorTela.map((m) => (
                <TableRow key={m.tela}>
                  <TableCell className="font-medium">{m.tela}</TableCell>
                  <TableCell>
                    <Badge variant={m.replay ? "default" : "outline"} className={m.replay ? "bg-success/15 text-success" : ""}>
                      {m.replay ? "Sim" : "Evitar"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={cn("font-normal", maskingBadgeClass(m.nivelMasking))}>
                      {m.nivelMasking}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-borderSoft bg-secondaryBackground/80">
        <CardContent className="flex flex-wrap items-center justify-between gap-2 p-4 text-xs text-secondaryText">
          <span>
            Última coleta:{" "}
            <time dateTime={data.integracao.ultimaColeta}>
              {new Date(data.integracao.ultimaColeta).toLocaleString("pt-BR")}
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
