import type { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <section className="space-y-3 rounded-md border border-borderSoft bg-surfaceSubtle/50 p-4">
      <div>
        <h3 className="text-xs font-semibold text-primaryText">{title}</h3>
        {description ? (
          <p className="mt-0.5 text-[11px] leading-relaxed text-secondaryText">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
