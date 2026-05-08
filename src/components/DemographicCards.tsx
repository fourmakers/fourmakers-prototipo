import { useState } from 'react';
import { Plus, Minus, Megaphone } from 'lucide-react';
import { DemographicGroup, DemographicRow } from '@/data/mockData';

const UNDEFINED_LABELS = ['sem resposta', 'não declarado', 'não definido', 'a definir', 'nao declarado', 'nao definido'];
const isUndefinedLabel = (label: string) => UNDEFINED_LABELS.includes(label.toLowerCase().trim());

function LabelWithStar({ label, className }: { label: string; className?: string }) {
  return (
    <span className={`flex items-center gap-1 ${className ?? ''}`}>
      <span className="truncate">{label}</span>
    </span>
  );
}

interface DemographicCardsProps {
  groups: DemographicGroup[];
  onCountClick: (category: string, count: number, label: string) => void;
}

export function DemographicCards({ groups, onCountClick }: DemographicCardsProps) {
  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
        <div className="w-12 h-12 rounded-xl bg-surface-elevated border border-border flex items-center justify-center">
          <span className="text-2xl">📊</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Configure um mapa personalizado para visualizar os dados demográficos
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {groups.map((group) => (
        <DemoCard key={group.category} group={group} onCountClick={onCountClick} />
      ))}
    </div>
  );
}

function PercentBar({ percent, isUndefined }: { percent: number; isUndefined?: boolean }) {
  return (
    <div className="w-full h-1 bg-surface-overlay rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${isUndefined ? 'bg-destructive/60' : 'bg-primary/60'}`}
        style={{ width: `${Math.min(percent, 100)}%` }}
      />
    </div>
  );
}

function ExpandableRow({
  row,
  onCountClick,
  category,
}: {
  row: DemographicRow;
  onCountClick: (category: string, count: number, label: string) => void;
  category: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = row.children && row.children.length > 0;

  return (
    <div>
      <div className="group flex items-center gap-2 py-1.5 rounded-md px-1 -mx-1 hover:bg-surface-overlay transition-colors">
        {/* Expand toggle */}
        <button
          onClick={() => hasChildren && setExpanded((p) => !p)}
          className={`shrink-0 w-4 h-4 flex items-center justify-center rounded transition-colors
            ${hasChildren ? 'text-primary hover:bg-primary/15' : 'text-transparent cursor-default'}`}
        >
          {hasChildren ? (
            expanded ? <Minus size={12} /> : <Plus size={12} />
          ) : null}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <LabelWithStar label={row.label} className={`text-xs font-medium ${isUndefinedLabel(row.label) ? 'text-destructive' : 'text-foreground'}`} />
            <div className="flex items-center gap-2 shrink-0">
              {isUndefinedLabel(row.label) && <Megaphone size={12} className="text-destructive shrink-0" />}
              <button
                onClick={() => onCountClick(category, row.count, row.label)}
                className={`text-xs font-semibold hover:underline transition-colors ${isUndefinedLabel(row.label) ? 'text-destructive hover:text-destructive' : 'text-primary hover:text-primary-hover'}`}
                title="Ver lista de colaboradores"
              >
                {row.count.toString().padStart(2, '0')}
              </button>
              <span className={`text-[11px] w-12 text-right ${isUndefinedLabel(row.label) ? 'text-destructive' : 'text-muted-foreground'}`}>
                {row.percent.toFixed(2)}%
              </span>
            </div>
          </div>
          <PercentBar percent={row.percent} isUndefined={isUndefinedLabel(row.label)} />
        </div>
      </div>

      {/* Children */}
      {expanded && hasChildren && (
        <div className="ml-5 pl-2 border-l border-border/50 mt-0.5 mb-1 space-y-0.5 animate-fade-in">
          {row.children!.filter(c => c.count > 0).map((child) => {
            const childUndefined = isUndefinedLabel(child.label);
            return (
            <div key={child.label} className="flex items-center justify-between gap-2 py-1 px-1">
              <LabelWithStar label={child.label} className={`text-[11px] flex-1 ${childUndefined ? 'text-destructive' : 'text-muted-foreground'}`} />
              <div className="flex items-center gap-2 shrink-0">
                {childUndefined && <Megaphone size={12} className="text-destructive shrink-0" />}
                <button
                  onClick={() => onCountClick(category, child.count, `${row.label} - ${child.label}`)}
                  className={`text-[11px] font-semibold hover:underline ${childUndefined ? 'text-destructive' : 'text-primary'}`}
                >
                  {child.count.toString().padStart(2, '0')}
                </button>
                <span className={`text-[10px] w-12 text-right ${childUndefined ? 'text-destructive' : 'text-muted-text'}`}>
                  {child.percent.toFixed(2)}%
                </span>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DemoCard({
  group,
  onCountClick,
}: {
  group: DemographicGroup;
  onCountClick: (category: string, count: number, label: string) => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const visibleRows = showAll ? group.rows : group.rows.slice(0, 7);

  return (
    <div className="bg-surface-elevated border border-border rounded-xl elevation-card flex flex-col">
      {/* Card Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-border/50">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {group.category}
        </h3>
        <span className="text-xs text-muted-text">
          Total: <span className="text-foreground font-medium">{group.totalCount}</span>
        </span>
      </div>

      {/* Rows */}
      <div className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto max-h-64">
        {visibleRows.map((row) => (
          group.expandable && row.expandable !== false ? (
            <ExpandableRow
              key={row.label}
              row={row}
              onCountClick={onCountClick}
              category={group.category}
            />
          ) : (
            <div key={row.label} className="py-1.5 px-1">
              <div className="flex items-center justify-between gap-2">
                <LabelWithStar label={row.label} className={`text-xs flex-1 ${isUndefinedLabel(row.label) ? 'text-destructive' : 'text-foreground'}`} />
                <div className="flex items-center gap-2 shrink-0">
                  {isUndefinedLabel(row.label) && <Megaphone size={12} className="text-destructive shrink-0" />}
                  <button
                    onClick={() => onCountClick(group.category, row.count, row.label)}
                    className={`text-xs font-semibold hover:underline transition-colors ${isUndefinedLabel(row.label) ? 'text-destructive hover:text-destructive' : 'text-primary hover:text-primary-hover'}`}
                    title="Ver colaboradores"
                  >
                    {row.count.toString().padStart(2, '0')}
                  </button>
                  <span className={`text-[11px] w-12 text-right ${isUndefinedLabel(row.label) ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {row.percent.toFixed(2)}%
                  </span>
                </div>
              </div>
              <PercentBar percent={row.percent} isUndefined={isUndefinedLabel(row.label)} />
            </div>
          )
        ))}

        {group.rows.length > 7 && (
          <button
            onClick={() => setShowAll((p) => !p)}
            className="w-full text-center text-[11px] text-primary hover:text-primary-hover py-1 transition-colors"
          >
            {showAll ? 'Ver menos ↑' : `Ver mais +${group.rows.length - 7}`}
          </button>
        )}
      </div>
    </div>
  );
}
