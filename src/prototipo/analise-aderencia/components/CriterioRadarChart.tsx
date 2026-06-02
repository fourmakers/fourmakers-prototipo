import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import type { CriterioAderencia } from "../types";

interface CriterioRadarChartProps {
  criterios: CriterioAderencia[];
  candidatoNome: string;
  cargo: string;
}

export function CriterioRadarChart({ criterios, candidatoNome, cargo }: CriterioRadarChartProps) {
  const data = criterios.map((c) => ({
    criterio: c.nome.length > 22 ? `${c.nome.slice(0, 20)}…` : c.nome,
    nota: c.nota,
    full: c.nome,
  }));

  return (
    <div className="w-full">
      <p className="mb-2 text-center text-sm font-semibold text-primaryText">
        Avaliação {candidatoNome} — {cargo}
      </p>
      <div className="h-[280px] w-full sm:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="78%">
            <PolarGrid stroke="var(--color-border-default)" />
            <PolarAngleAxis
              dataKey="criterio"
              tick={{ fill: "var(--color-secondary-text)", fontSize: 10 }}
            />
            <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fontSize: 10 }} />
            <Radar
              name="Nota"
              dataKey="nota"
              stroke="#2563eb"
              fill="#2563eb"
              fillOpacity={0.35}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-1 text-center text-[10px] text-secondaryText">Escala 0 a 5 por critério</p>
    </div>
  );
}
