import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnalyticsDataMode } from "@/prototipo/analytics/api/analyticsConfig";
import { describeAnalyticsDataMode, isAnalyticsMockMode } from "@/prototipo/analytics/api/analyticsConfig";

export function AnalyticsMockDataFrame({
  mode,
  channel,
  children,
  className,
}: {
  mode: AnalyticsDataMode | undefined;
  channel: "firebase" | "contentsquare";
  children: ReactNode;
  className?: string;
}) {
  const isMock = isAnalyticsMockMode(mode);

  if (!isMock) {
    return (
      <div
        className={cn("rounded-xl border-2 border-transparent", className)}
        data-testid={`analytics-live-frame-${channel}`}
        data-analytics-source="api"
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border-2 border-dashed border-warningBorder bg-warningSoft/30 p-1 shadow-[inset_0_0_0_1px_hsl(var(--warning)/0.15)]",
        className,
      )}
      data-testid={`analytics-mock-frame-${channel}`}
      data-analytics-source="mock"
      role="region"
      aria-label={`Dashboard ${channel}: dados simulados`}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-warningBorder bg-warningSoft px-3 py-2 text-sm text-on-warning">
        <AlertTriangle className="size-4 shrink-0 text-warning" aria-hidden />
        <span>
          <strong className="font-semibold">Mock</strong> — {describeAnalyticsDataMode(mode ?? "mock")}. Sem borda
          warning = dados da Analytics API / GA4.
        </span>
      </div>
      <div className="rounded-lg border border-warningBorder/50 bg-surfaceElevated/80 p-2 sm:p-3">{children}</div>
    </div>
  );
}
