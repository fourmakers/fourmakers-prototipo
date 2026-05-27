import { Link } from "react-router-dom";
import { BarChart3, Download, Folder, Layers } from "lucide-react";
import { MENU_GROUP_LABELS, registryByMenuGroup, type PrototipoMenuGroup, type PrototipoRegistryEntry } from "@/prototipo/registry";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { downloadTechnicalDoc } from "@/prototipo/downloadTechnicalDoc";

const GROUP_ORDER: PrototipoMenuGroup[] = ["prototipos", "analytics"];

const GROUP_ICONS: Record<PrototipoMenuGroup, typeof Layers> = {
  prototipos: Layers,
  analytics: BarChart3,
};

function RegistryCardGrid({ entries }: { entries: PrototipoRegistryEntry[] }) {
  return (
    <div className="flex flex-wrap gap-4">
      {entries.map((entry) => (
          <div
            key={entry.id}
            className={cn(
              "group relative flex w-full min-w-[min(100%,280px)] flex-col sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]",
              "rounded-lg border border-borderSoft bg-surfaceElevated shadow-softToken",
              "transition-shadow duration-200 hover:shadow-cardHoverToken",
            )}
          >
            {entry.documentationMarkdownFile ? (
              <div className="absolute right-2 top-2 z-10">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0 text-secondaryText hover:bg-primarySoft hover:text-primary"
                  aria-label={`Baixar documentação técnica (${entry.documentationMarkdownFile})`}
                  title="Baixar documentação técnica (.md)"
                  data-testid={`prototipo-card-download-doc-${entry.id}`}
                  onClick={() => downloadTechnicalDoc(entry.documentationMarkdownFile!)}
                >
                  <Download className="size-4" aria-hidden />
                </Button>
              </div>
            ) : null}

            <Link
              to={entry.path}
              className={cn(
                "flex flex-1 flex-col rounded-lg p-5 outline-none",
                "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              )}
            >
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-borderSoft bg-primaryBackground text-primary">
                <Folder className="size-5" aria-hidden />
              </span>
              <h2 className="pr-12 text-lg font-bold text-primaryText">{entry.cardTitle}</h2>
              <p className="mt-1 text-sm text-secondaryText">{entry.cardDescription}</p>
              <code className="mt-3 block font-mono text-xs text-secondaryText">{entry.routeSlug}</code>
            </Link>
          </div>
        ))}
    </div>
  );
}

export function PrototipoHomePage() {
  return (
    <div className="space-y-10">
      <PageHeader
        title="Hub Fourmakers"
        description="Protótipos de interface e dashboards de analytics. Use o menu lateral ou os cards por secção."
      />

      {GROUP_ORDER.map((group) => {
        const entries = registryByMenuGroup(group);
        if (entries.length === 0) return null;
        const Icon = GROUP_ICONS[group];
        return (
          <section key={group} className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-md border border-borderSoft bg-primarySoft text-primary">
                <Icon className="size-4" aria-hidden />
              </span>
              <h2 className="text-lg font-bold text-primaryText">{MENU_GROUP_LABELS[group]}</h2>
            </div>
            <RegistryCardGrid entries={entries} />
          </section>
        );
      })}
    </div>
  );
}
