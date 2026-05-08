import { Menu, Sun, Moon } from "lucide-react";
import logoFourmakers from "@/assets/logo-fourmakers.svg";
import { useTheme } from "@/hooks/use-theme";
import { Badge } from "@/components/ui/badge";

const HEADER_HEIGHT = "72px";

export function Header({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4 border-b border-border bg-surface elevation-soft h-[72px] shrink-0 w-full box-border"
      style={{ minHeight: HEADER_HEIGHT }}
    >
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            type="button"
            onClick={onMenuToggle}
            aria-label="Abrir menu"
            title="Abrir menu"
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-surface-elevated text-foreground hover:bg-surface-overlay transition-colors"
          >
            <Menu className="size-5" />
          </button>
        )}
        <img
          src={logoFourmakers}
          alt="Four Makers"
          className="h-10 dark:invert cursor-pointer shrink-0"
          title="Prototipo Fourmakers"
        />
        <Badge
          variant="outline"
          className="border-accent text-accent bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.03em]"
        >
          Protótipo
        </Badge>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          title="Alternar tema"
          className="w-7 h-7 rounded-full bg-surface-elevated border border-border flex items-center justify-center hover:bg-surface-overlay transition-colors duration-200"
        >
          {theme === "dark" ? (
            <Sun size={14} className="text-muted-foreground transition-transform duration-300 hover:rotate-45" />
          ) : (
            <Moon size={14} className="text-muted-foreground transition-transform duration-300 hover:-rotate-12" />
          )}
        </button>
        <div className="w-7 h-7 rounded-full bg-surface-elevated border border-border flex items-center justify-center">
          <span className="text-[10px] font-semibold text-muted-foreground">GM</span>
        </div>
        <div className="hidden sm:block">
          <p className="text-xs font-medium text-foreground">Gestor Principal</p>
          <p className="text-[11px] text-muted-foreground">Administrador</p>
        </div>
      </div>
    </header>
  );
}

export { HEADER_HEIGHT };
