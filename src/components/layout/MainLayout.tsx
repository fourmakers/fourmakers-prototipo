import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Header, HEADER_HEIGHT } from "@/components/layout/Header";
import { Sidebar } from "@/components/Sidebar";

const CONTENT_PADDING = "py-2 px-12 pb-8 max-[1080px]:px-6 max-[1080px]:pb-12";

export function MainLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 768 : false,
  );
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 768 : false,
  );

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth <= 768;
      if (mobile) setIsSidebarCollapsed(true);
      setIsMobile(mobile);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const sidebarOffset = isSidebarCollapsed ? "72px" : "260px";
  const contentMarginLeft = isMobile ? "0" : sidebarOffset;

  return (
    <div className="min-h-screen bg-primaryBackground flex flex-col">
      <Header onMenuToggle={() => setIsSidebarCollapsed(false)} />

      <div
        className="flex flex-1 min-h-0 overflow-hidden transition-[margin-left] duration-300 ease-out"
        style={{ marginTop: HEADER_HEIGHT, marginLeft: contentMarginLeft }}
      >
        <Sidebar
          collapsed={isSidebarCollapsed}
          onClose={() => setIsSidebarCollapsed(true)}
          onToggleCollapse={() => setIsSidebarCollapsed((p) => !p)}
        />
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden bg-background">
          <div className={`flex-1 overflow-y-auto overflow-x-hidden min-h-0 bg-background ${CONTENT_PADDING}`}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
