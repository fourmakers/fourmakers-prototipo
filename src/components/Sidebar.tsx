import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Layers, FileCode2, ChevronLeft, ChevronRight, ChevronDown, LogOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PROTOTIPO_REGISTRY } from "@/prototipo/registry";

const SIDEBAR_WIDTH = "260px";
const SIDEBAR_COLLAPSED_WIDTH = "72px";
const HEADER_HEIGHT = "72px";

function SubNavLink({
  label,
  collapsed,
  isActive,
  onSelect,
}: {
  label: string;
  collapsed: boolean;
  isActive: boolean;
  onSelect: () => void;
}) {
  const button = (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "flex items-center gap-2 w-full min-w-0 box-border rounded-pillToken text-[0.875rem] font-semibold transition-all duration-200",
        collapsed ? "justify-center py-3 px-3" : "justify-start py-3 pl-4 pr-2",
        isActive
          ? "bg-btnPrimary text-on-primary shadow-softToken hover:bg-btnPrimaryHover"
          : "text-secondaryText hover:bg-btnGhostHover hover:text-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      ].join(" ")}
    >
      {collapsed && (
        <span className="flex shrink-0 w-6 h-6 items-center justify-center [&_svg]:size-5" aria-hidden>
          <FileCode2 className="size-5" />
        </span>
      )}
      {!collapsed && <span className="truncate text-left">{label}</span>}
      {collapsed && <span className="sr-only">{label}</span>}
    </button>
  );
  return collapsed ? (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right" className="font-medium">
        {label}
      </TooltipContent>
    </Tooltip>
  ) : (
    button
  );
}

interface SidebarProps {
  collapsed: boolean;
  onClose: () => void;
  onToggleCollapse?: () => void;
}

export function Sidebar({ collapsed, onClose, onToggleCollapse }: SidebarProps) {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  /** Prefixo público do app (Vite `base`), sem barra final — ex.: `/prototipo` ou vazio na raiz. */
  const hubBase = import.meta.env.BASE_URL.replace(/\/$/, "");

  const isPrototipoChildActive = PROTOTIPO_REGISTRY.some((e) => e.path === pathname);
  const [prototiposExpanded, setPrototiposExpanded] = useState(() =>
    hubBase ? pathname.startsWith(hubBase) : pathname.startsWith("/prototipo")
  );

  useEffect(() => {
    if (isPrototipoChildActive) setPrototiposExpanded(true);
  }, [isPrototipoChildActive]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const go = (path: string) => {
    navigate(path);
    if (isMobile) onClose();
  };

  const handleLogout = () => {
    console.log("Sair (prototipo)");
  };

  const handlePrototiposParent = () => {
    if (collapsed) {
      onToggleCollapse?.();
      setTimeout(() => setPrototiposExpanded(true), 150);
      return;
    }
    setPrototiposExpanded((p) => !p);
  };

  const homePath = import.meta.env.BASE_URL === "/" ? "/" : import.meta.env.BASE_URL;
  const inicioActive =
    pathname === "/" ||
    pathname === homePath ||
    pathname === `${hubBase}` ||
    pathname === `${hubBase}/`;

  const inicioButton = (
    <button
      type="button"
      onClick={() => go(homePath)}
      className={[
        "flex items-center gap-2 w-full min-w-0 box-border rounded-pillToken text-[0.875rem] font-semibold transition-all duration-200",
        collapsed ? "justify-center py-3 px-3" : "justify-start py-3 pl-4 pr-2",
        inicioActive
          ? "bg-btnPrimary text-on-primary shadow-softToken hover:bg-btnPrimaryHover"
          : "text-secondaryText hover:bg-btnGhostHover hover:text-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      ].join(" ")}
    >
      <span className="flex shrink-0 w-6 h-6 items-center justify-center [&_svg]:size-5">
        <Home className="size-5" aria-hidden />
      </span>
      {!collapsed && <span className="truncate">Início</span>}
    </button>
  );

  const parentPrototipos = (
    <button
      type="button"
      onClick={handlePrototiposParent}
      aria-expanded={prototiposExpanded ? 'true' : 'false'}
      className={[
        "flex items-center gap-2 w-full min-w-0 box-border rounded-pillToken text-[0.875rem] font-semibold transition-all duration-200",
        collapsed ? "justify-center py-3 px-3" : "justify-start py-3 pl-3 pr-2",
        "text-secondaryText hover:bg-btnGhostHover hover:text-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      ].join(" ")}
    >
      <span className="flex shrink-0 w-6 h-6 items-center justify-center [&_svg]:size-5">
        <Layers className="size-5" aria-hidden />
      </span>
      {!collapsed && (
        <>
          <span className="truncate flex-1 text-left">Protótipos</span>
          <span className="shrink-0 flex items-center">
            {prototiposExpanded ? <ChevronDown className="size-4" aria-hidden /> : <ChevronRight className="size-4" aria-hidden />}
          </span>
        </>
      )}
    </button>
  );

  return (
    <TooltipProvider>
      <aside
        className={[
          "fixed top-0 left-0 h-full flex flex-col font-sans",
          "bg-surface border-r border-border",
          "overflow-y-auto overflow-x-visible",
          "transition-[width,padding] duration-300 ease-out box-border",
          "z-[15] md:z-[15] max-md:z-[35] max-md:w-[260px] max-md:transition-transform max-md:duration-300",
          collapsed ? "max-md:-translate-x-full" : "max-md:translate-x-0",
        ].join(" ")}
        style={{
          width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
          padding: collapsed ? "0 0.5rem 1rem" : "0 0.75rem 1rem",
        }}
      >
        <nav
          className="sidebar-nav flex flex-col gap-2 flex-1 min-h-0 pb-2 overflow-y-auto overflow-x-hidden"
          style={{ paddingTop: `calc(${HEADER_HEIGHT} + 1rem)` }}
        >
          {collapsed ? (
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>{inicioButton}</TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                Início
              </TooltipContent>
            </Tooltip>
          ) : (
            inicioButton
          )}

          <div className="flex flex-col gap-2">
            {collapsed ? (
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>{parentPrototipos}</TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  Protótipos
                </TooltipContent>
              </Tooltip>
            ) : (
              parentPrototipos
            )}
            {!collapsed && prototiposExpanded && (
              <div className="flex flex-col gap-1 pl-2 ml-1 border-l-2 border-border mt-1 mb-2">
                {PROTOTIPO_REGISTRY.map((entry) => (
                  <SubNavLink
                    key={entry.id}
                    label={entry.menuLabel}
                    collapsed={collapsed}
                    isActive={pathname === entry.path}
                    onSelect={() => go(entry.path)}
                  />
                ))}
              </div>
            )}
            {collapsed && isPrototipoChildActive && (
              <div className="flex flex-col gap-1">
                {PROTOTIPO_REGISTRY.map((entry) => (
                  <SubNavLink
                    key={entry.id}
                    label={entry.menuLabel}
                    collapsed={collapsed}
                    isActive={pathname === entry.path}
                    onSelect={() => go(entry.path)}
                  />
                ))}
              </div>
            )}
          </div>
        </nav>

        <div
          className={`flex flex-col flex-shrink-0 border-t border-border bg-surface ${collapsed ? "p-2" : "p-3"}`}
        >
          {collapsed ? (
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Sair"
                  className="flex items-center justify-center w-full rounded-pillToken py-3 text-[0.875rem] font-semibold text-secondaryText hover:bg-btnGhostHover hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <LogOut className="size-5 shrink-0" aria-hidden />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                Sair
              </TooltipContent>
            </Tooltip>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 w-full rounded-pillToken py-3 pl-3 pr-2 text-[0.875rem] font-semibold text-secondaryText hover:bg-btnGhostHover hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <LogOut className="size-5 shrink-0" aria-hidden />
              <span className="truncate">Sair</span>
            </button>
          )}
        </div>
      </aside>

      {onToggleCollapse && (
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expandir menu" : "Colapsar menu"}
          className="fixed hidden md:flex items-center justify-center w-6 h-6 min-w-[24px] min-h-[24px] p-0 border border-border rounded-full bg-surface text-secondaryText transition-all duration-300 z-[50] pointer-events-auto hover:bg-primarySoft hover:text-primaryStrong hover:scale-[1.15] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          style={{
            top: `calc(${HEADER_HEIGHT} - 12px)`,
            left: collapsed ? "calc(72px - 12px)" : "calc(260px - 12px)",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          {collapsed ? <ChevronRight className="size-[14px] shrink-0" aria-hidden /> : <ChevronLeft className="size-[14px] shrink-0" aria-hidden />}
        </button>
      )}

      <div
        role="presentation"
        onClick={onClose}
        className={`
          hidden max-md:block fixed inset-0 backdrop-blur-[2px] z-[34]
          ${collapsed ? "pointer-events-none invisible" : "pointer-events-auto visible"}
        `}
        style={{ backgroundColor: "rgba(15, 16, 18, 0.45)" }}
        aria-hidden
      />
    </TooltipProvider>
  );
}
