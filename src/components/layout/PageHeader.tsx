import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

/**
 * Cabeçalho de página no padrão fourmakers-v2.
 * Usa as classes .page-title e .page-subtitle do design system.
 */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="page-title">{title}</h1>
        {description && <p className="page-subtitle mt-0.5">{description}</p>}
      </div>
      {actions && (
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full md:w-auto">
          {actions}
        </div>
      )}
    </div>
  );
}
