import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Layers,
  BarChart3,
  FileCode2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  Sparkles,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  MENU_GROUP_LABELS,
  PROTOTIPO_REGISTRY,
  registryByMenuGroup,
  type PrototipoMenuGroup,
} from "@/prototipo/registry";

const SIDEBAR_WIDTH = "260px";
const SIDEBAR_COLLAPSED_WIDTH = "72px";
const HEADER_HEIGHT = "72px";

const GROUP_ICONS: Record<PrototipoMenuGroup, typeof Layers> = {
  showcase: Sparkles,
  prototipos: Layers,
  analytics: BarChart3,
};

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

/** Item de primeiro nível (fora dos grupos colapsáveis), como Início e Showcase. */
function TopNavLink({
  label,
  icon: Icon,
  collapsed,
  isActive,
  onSelect,
}: {
  label: string;
  icon: typeof Layers;
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
      <span className="flex shrink-0 w-6 h-6 items-center justify-center [&_svg]:size-5">
        <Icon className="size-5" aria-hidden />
      </span>
      {!collapsed && <span className="truncate">{label}</span>}
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

function NavGroupSection({
  group,
  collapsed,
  pathname,
  expanded,
  onToggleExpanded,
  onNavigate,
  onExpandFromCollapsed,
}: {
  group: PrototipoMenuGroup;
  collapsed: boolean;
  pathname: string;
  expanded: boolean;
  onToggleExpanded: () => void;
  onNavigate: (path: string) => void;
  onExpandFromCollapsed: () => void;
}) {
  const entries = registryByMenuGroup(group);
  const Icon = GROUP_ICONS[group];
  const label = MENU_GROUP_LABELS[group];
  const isChildActive = entries.some((e) => e.path === pathname);

  const parentButton = (
    <button
      type="button"
      onClick={() => {
        if (collapsed) onExpandFromCollapsed();
        else onToggleExpanded();
      }}
      aria-expanded={expanded}
      className={[
        "flex items-center gap-2 w-full min-w-0 box-border rounded-pillToken text-[0.875rem] font-semibold transition-all duration-200",
        collapsed ? "justify-center py-3 px-3" : "justify-start py-3 pl-3 pr-2",
        "text-secondaryText hover:bg-btnGhostHover hover:text-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      ].join(" ")}
    >
      <span className="flex shrink-0 w-6 h-6 items-center justify-center [&_svg]:size-5">
        <Icon className="size-5" aria-hidden />
      </span>
      {!collapsed && (
        <>
          <span className="truncate flex-1 text-left">{label}</span>
          <span className="shrink-0 flex items-center">
            {expanded ? <ChevronDown className="size-4" aria-hidden /> : <ChevronRight className="size-4" aria-hidden />}
          </span>
        </>
      )}
    </button>
  );

  return (
    <div className="flex flex-col gap-2">
      {collapsed ? (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>{parentButton}</TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {label}
          </TooltipContent>
        </Tooltip>
      ) : (
        parentButton
      )}
      {!collapsed && expanded && (
        <div className="flex flex-col gap-1 pl-2 ml-1 border-l-2 border-border mt-1 mb-2">
          {entries.map((entry) => (
            <SubNavLink
              key={entry.id}
              label={entry.menuLabel}
              collapsed={collapsed}
              isActive={pathname === entry.path}
              onSelect={() => onNavigate(entry.path)}
            />
          ))}
        </div>
      )}
      {collapsed && isChildActive && (
        <div className="flex flex-col gap-1">
          {entries.map((entry) => (
            <SubNavLink
              key={entry.id}
              label={entry.menuLabel}
              collapsed={collapsed}
              isActive={pathname === entry.path}
              onSelect={() => onNavigate(entry.path)}
            />
          ))}
        </div>
      )}
    </div>
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

  const isHubChildActive = PROTOTIPO_REGISTRY.some((e) => e.path === pathname);
  const [prototiposExpanded, setPrototiposExpanded] = useState(
    () => pathname !== "/" && PROTOTIPO_REGISTRY.some((e) => e.path === pathname),
  );
  const [analyticsExpanded, setAnalyticsExpanded] = useState(() =>
    registryByMenuGroup("analytics").some((e) => e.path === pathname),
  );

  useEffect(() => {
    if (isHubChildActive) setPrototiposExpanded(true);
    if (registryByMenuGroup("analytics").some((e) => e.path === pathname)) setAnalyticsExpanded(true);
  }, [pathname, isHubChildActive]);

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

  const expandGroupFromCollapsed = (setExpanded: (v: boolean) => void) => {
    onToggleCollapse?.();
    setTimeout(() => setExpanded(true), 150);
  };

  const inicioActive = pathname === "/";

  const inicioButton = (
    <button
      type="button"
      onClick={() => go("/")}
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

          {registryByMenuGroup("showcase").map((entry) => (
            <TopNavLink
              key={entry.id}
              label={entry.menuLabel}
              icon={GROUP_ICONS.showcase}
              collapsed={collapsed}
              isActive={pathname === entry.path}
              onSelect={() => go(entry.path)}
            />
          ))}

          <NavGroupSection
            group="prototipos"
            collapsed={collapsed}
            pathname={pathname}
            expanded={prototiposExpanded}
            onToggleExpanded={() => setPrototiposExpanded((p) => !p)}
            onNavigate={go}
            onExpandFromCollapsed={() => expandGroupFromCollapsed(setPrototiposExpanded)}
          />

          <NavGroupSection
            group="analytics"
            collapsed={collapsed}
            pathname={pathname}
            expanded={analyticsExpanded}
            onToggleExpanded={() => setAnalyticsExpanded((p) => !p)}
            onNavigate={go}
            onExpandFromCollapsed={() => expandGroupFromCollapsed(setAnalyticsExpanded)}
          />
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
