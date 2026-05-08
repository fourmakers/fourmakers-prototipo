import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { NivelStakeholder } from "@/prototipo/dashboard-comercial/types";

const NIVEL_META: Record<
  NivelStakeholder,
  { label: string; className: string }
> = {
  cLevel: { label: "C-Level", className: "border-transparent bg-infoSoft text-info" },
  decisor: { label: "Decisor", className: "border-transparent bg-accentSoft text-accent" },
  influenciador: {
    label: "Influenciador",
    className: "border-transparent bg-success/15 text-success",
  },
  operacional: {
    label: "Operacional",
    className: "border-transparent bg-muted text-secondaryText",
  },
  semClassificacao: {
    label: "s/ classif.",
    className: "border-transparent bg-error/10 text-error",
  },
};

export function NivelBadge({ nivel }: { nivel: NivelStakeholder }) {
  const m = NIVEL_META[nivel] ?? NIVEL_META.semClassificacao;
  return (
    <Badge variant="outline" className={cn("shrink-0 font-semibold", m.className)}>
      {m.label}
    </Badge>
  );
}

export function iniciais(nome: string): string {
  const p = nome.trim().split(/\s+/).filter(Boolean);
  if (p.length === 0) return "?";
  if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
  return (p[0][0] + p[p.length - 1][0]).toUpperCase();
}

const AVATAR_ROT = [
  "bg-error/15 text-error",
  "bg-infoSoft text-info",
  "bg-accentSoft text-accent",
  "bg-success/15 text-success",
  "bg-warningSoft text-on-warning",
  "bg-destructive/10 text-destructive",
];

export function avatarToneClass(id: number): string {
  return AVATAR_ROT[Math.abs(id) % AVATAR_ROT.length];
}
