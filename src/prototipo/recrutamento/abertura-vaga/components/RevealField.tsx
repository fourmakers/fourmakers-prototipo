import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealFieldProps {
  visible: boolean;
  children: ReactNode;
  className?: string;
}

export function RevealField({ visible, children, className }: RevealFieldProps) {
  return (
    <div
      className={cn(
        "transition-[max-height,opacity] duration-300 ease-out",
        visible ? "max-h-[1200px] overflow-visible opacity-100" : "max-h-0 overflow-hidden opacity-0",
        className,
      )}
      aria-hidden={!visible}
    >
      {children}
    </div>
  );
}
