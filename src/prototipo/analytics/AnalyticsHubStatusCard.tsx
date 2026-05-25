import { ExternalLink, Radio } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  APP_FIREBASE_EVENTS_INSTRUMENTED,
  FIREBASE_CONSOLE_LINKS,
  HUB_FASE_A_BLOCKERS,
} from "@/prototipo/analytics/analyticsHubCatalog";
import { analyticsApiBaseUrl, analyticsUseMock } from "@/prototipo/analytics/api/analyticsConfig";
import { getFirebaseProjectMeta } from "@/prototipo/analytics/firebaseProjectMeta";

export function AnalyticsHubStatusCard() {
  const meta = getFirebaseProjectMeta();
  const apiUrl = analyticsApiBaseUrl();
  const usingMock = analyticsUseMock();

  return (
    <Card className="border-borderSoft bg-secondaryBackground/50 shadow-softToken" data-testid="analytics-hub-status">
      <CardHeader className="pb-2">
        <CardTitle className="flex flex-wrap items-center gap-2 text-base font-semibold text-primaryText">
          <Radio className="size-4 text-primary" aria-hidden />
          Cenário Analytics Hub (dev)
          <Badge variant="outline" className="font-normal">
            App coleta ~70%
          </Badge>
          <Badge variant="secondary" className="font-normal">
            API 0%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p className="text-secondaryText">
          Projeto <span className="font-mono text-primaryText">{meta.projectId}</span> — eventos no app:{" "}
          <span className="font-mono text-xs">{APP_FIREBASE_EVENTS_INSTRUMENTED.join(", ")}</span>. Métricas
          agregadas no hub dependem da <strong className="font-medium text-primaryText">Analytics API</strong> (Fase
          A).
        </p>

        <div className="flex flex-wrap gap-2">
          <Badge variant={usingMock ? "secondary" : "default"}>
            {usingMock ? "UI: mock / API indisponível" : "UI: Analytics API"}
          </Badge>
          {apiUrl ? (
            <Badge variant="outline" className="max-w-full truncate font-mono text-xs">
              {apiUrl}
            </Badge>
          ) : null}
        </div>

        <div>
          <p className="mb-2 font-medium text-primaryText">Consolas (dados reais hoje, sem hub)</p>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["Analytics", FIREBASE_CONSOLE_LINKS.analytics],
                ["DebugView", FIREBASE_CONSOLE_LINKS.debugView],
                ["Crashlytics", FIREBASE_CONSOLE_LINKS.crashlytics],
                ["Performance", FIREBASE_CONSOLE_LINKS.performance],
              ] as const
            ).map(([label, href]) => (
              <Button key={href} variant="outline" size="sm" className="h-8 gap-1.5 text-xs" asChild>
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {label}
                  <ExternalLink className="size-3" aria-hidden />
                </a>
              </Button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-borderSoft bg-surfaceElevated px-3 py-2">
          <p className="font-medium text-primaryText">Fase A — pendências (backend)</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-secondaryText">
            {HUB_FASE_A_BLOCKERS.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-secondaryText">
          Doc: <code className="rounded bg-surfaceElevated px-1">docs/ANALYTICS_HUB_CENARIO_ESTADO_E_PENDENCIAS.md</code>
        </p>
      </CardContent>
    </Card>
  );
}
