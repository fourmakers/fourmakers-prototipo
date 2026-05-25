import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { FunilEtapa, KpiMetric, SerieDia } from "./types";

const chartConfig = {
  valor: { label: "Volume", color: "hsl(var(--primary))" },
};

export function AnalyticsKpiGrid({ kpis, testIdPrefix }: { kpis: KpiMetric[]; testIdPrefix: string }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" data-testid={`${testIdPrefix}-kpis`}>
      {kpis.map((k) => (
        <Card
          key={k.id}
          className="border-borderSoft bg-surfaceElevated shadow-softToken"
          data-testid={`${testIdPrefix}-kpi-${k.id}`}
        >
          <CardContent className="p-4">
            <p className="text-xs font-medium text-secondaryText">{k.label}</p>
            <p
              className={cn(
                "mt-1 text-2xl font-bold tabular-nums",
                k.variant === "success" && "text-success",
                k.variant === "warning" && "text-warning",
                k.variant === "danger" && "text-destructive",
                k.variant === "info" && "text-info",
                (!k.variant || k.variant === "default") && "text-primaryText",
              )}
            >
              {k.value}
            </p>
            {k.hint ? <p className="mt-1 text-[11px] text-secondaryText">{k.hint}</p> : null}
            {k.trendPct != null ? (
              <div
                className={cn(
                  "mt-2 flex items-center gap-1 text-xs font-medium",
                  k.trendPct >= 0 ? "text-success" : "text-destructive",
                )}
              >
                {k.trendPct >= 0 ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
                {k.trendPct >= 0 ? "+" : ""}
                {k.trendPct.toFixed(1)}% vs. período anterior
              </div>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function AnalyticsSerieChart({
  titulo,
  serie,
  testId,
}: {
  titulo: string;
  serie: SerieDia[];
  testId: string;
}) {
  const data = serie.map((s) => ({
    ...s,
    label: s.data.slice(5),
  }));

  return (
    <Card className="border-borderSoft bg-surfaceElevated shadow-softToken" data-testid={testId}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-primaryText">{titulo}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-[2.4/1] min-h-[200px] w-full">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={48} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="valor" fill="var(--color-valor)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function AnalyticsEventTable({
  titulo,
  rows,
  testId,
}: {
  titulo: string;
  rows: { eventName: string; totalEvents: number; uniqueUsers: number; feature?: string }[];
  testId: string;
}) {
  return (
    <Card className="border-borderSoft bg-surfaceElevated shadow-softToken" data-testid={testId}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-primaryText">{titulo}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:p-6 sm:pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Evento / ecrã</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Utilizadores</TableHead>
              <TableHead>Feature</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.eventName}>
                <TableCell className="font-mono text-xs text-primaryText">{r.eventName}</TableCell>
                <TableCell className="text-right tabular-nums">{r.totalEvents.toLocaleString("pt-BR")}</TableCell>
                <TableCell className="text-right tabular-nums">{r.uniqueUsers.toLocaleString("pt-BR")}</TableCell>
                <TableCell>
                  {r.feature ? (
                    <Badge variant="secondary" className="font-normal">
                      {r.feature}
                    </Badge>
                  ) : (
                    "—"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function AnalyticsScreenTable({
  titulo,
  rows,
  testId,
}: {
  titulo: string;
  rows: { screenName: string; views: number; uniqueUsers: number }[];
  testId: string;
}) {
  return (
    <Card className="border-borderSoft bg-surfaceElevated shadow-softToken" data-testid={testId}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-primaryText">{titulo}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:p-6 sm:pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ecrã</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Utilizadores</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.screenName}>
                <TableCell className="font-mono text-xs">{r.screenName}</TableCell>
                <TableCell className="text-right tabular-nums">{r.views.toLocaleString("pt-BR")}</TableCell>
                <TableCell className="text-right tabular-nums">{r.uniqueUsers.toLocaleString("pt-BR")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function AnalyticsFunisGrid({
  funis,
  testIdPrefix,
}: {
  funis: { id: string; titulo: string; etapas: FunilEtapa[] }[];
  testIdPrefix: string;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-3" data-testid={`${testIdPrefix}-funis`}>
      {funis.map((f) => {
        const max = Math.max(...f.etapas.map((e) => e.usuarios), 1);
        return (
          <Card key={f.id} className="border-borderSoft bg-surfaceElevated shadow-softToken">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-primaryText">{f.titulo}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {f.etapas.map((e) => (
                <div key={e.nome}>
                  <div className="flex items-baseline justify-between gap-2 text-xs">
                    <span className="truncate font-mono text-secondaryText">{e.nome}</span>
                    <span className="shrink-0 tabular-nums font-semibold text-primaryText">
                      {e.usuarios.toLocaleString("pt-BR")}
                      {e.taxaConversaoPct != null ? (
                        <span className="ml-1 font-normal text-success">({e.taxaConversaoPct}%)</span>
                      ) : null}
                    </span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-secondaryBackground">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${(e.usuarios / max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export function IntegracaoBadges({
  items,
}: {
  items: { label: string; ativo: boolean; detail?: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Badge
          key={item.label}
          variant={item.ativo ? "default" : "outline"}
          className={cn(item.ativo ? "bg-success/15 text-success hover:bg-success/20" : "text-secondaryText")}
        >
          {item.label}
          {item.detail ? ` · ${item.detail}` : ""}
        </Badge>
      ))}
    </div>
  );
}
