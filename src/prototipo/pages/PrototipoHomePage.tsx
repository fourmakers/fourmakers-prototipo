import { Link } from "react-router-dom";
import { Download, Folder } from "lucide-react";
import { PROTOTIPO_REGISTRY } from "@/prototipo/registry";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { downloadTechnicalDoc } from "@/prototipo/downloadTechnicalDoc";

export function PrototipoHomePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Protótipos"
        description="Acesse as features em construção pelo menu Protótipos ou pelos cards abaixo. Use o ícone de download para obter a documentação técnica em Markdown."
      />

      <div className="grid max-w-4xl gap-4 sm:grid-cols-2">
        {PROTOTIPO_REGISTRY.map((entry) => (
          <div
            key={entry.id}
            className={cn(
              "group relative flex flex-col rounded-lg border border-borderSoft bg-surfaceElevated shadow-softToken",
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
    </div>
  );
}
