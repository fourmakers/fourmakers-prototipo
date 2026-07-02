import { BarChart3, List, PieChart } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { DataCardViewMode } from "./dataCardView";
import { DATA_CARD_VIEW_LABELS } from "./dataCardView";

const MODES: { value: DataCardViewMode; icon: typeof List }[] = [
  { value: "list", icon: List },
  { value: "donut", icon: PieChart },
  { value: "bar", icon: BarChart3 },
];

export function DataCardViewSelector({
  value,
  onChange,
  testId,
}: {
  value: DataCardViewMode;
  onChange: (mode: DataCardViewMode) => void;
  testId?: string;
}) {
  return (
    <TooltipProvider delayDuration={300}>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(v) => {
          if (v === "list" || v === "donut" || v === "bar") onChange(v);
        }}
        className="shrink-0 rounded-lg border border-borderSoft bg-secondaryBackground/80 p-0.5"
        data-testid={testId}
      >
        {MODES.map(({ value: mode, icon: Icon }) => (
          <Tooltip key={mode}>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value={mode}
                aria-label={DATA_CARD_VIEW_LABELS[mode]}
                className="h-7 w-7 rounded-md p-0 data-[state=on]:bg-surfaceElevated data-[state=on]:text-primary"
              >
                <Icon className="size-3.5" aria-hidden />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {DATA_CARD_VIEW_LABELS[mode]}
            </TooltipContent>
          </Tooltip>
        ))}
      </ToggleGroup>
    </TooltipProvider>
  );
}
