import { BarChart3, Pencil, Eye, Copy, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable, type Column } from '@/components/common';
import { Campaign, CampaignStatus, STATUS_CONFIG, CAMPAIGN_TYPE_OPTIONS } from './campaignData';

interface Props {
  campaigns: Campaign[];
  onEdit: (c: Campaign) => void;
  onResults: (c: Campaign) => void;
  onView: (c: Campaign) => void;
  onDuplicate: (c: Campaign) => void;
  onActivate?: (c: Campaign) => void;
}

function formatDate(d: string) {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

function getButtons(status: CampaignStatus): ('visualizar' | 'resultado' | 'editar' | 'duplicar')[] {
  switch (status) {
    case 'rascunho': return ['editar'];
    case 'nova': return ['visualizar', 'editar'];
    case 'ativa': return ['visualizar', 'resultado', 'editar'];
    case 'concluida': return ['visualizar', 'resultado', 'duplicar'];
    case 'cancelada': return ['visualizar', 'resultado', 'duplicar'];
    case 'arquivada': return ['visualizar', 'resultado', 'duplicar'];
    default: return ['visualizar'];
  }
}

const COLUMNS: Column[] = [
  { id: 'title', label: 'Título', sortable: true },
  { id: 'tipoCampanha', label: 'Tipo', sortable: true },
  { id: 'solicitante', label: 'Solicitante', sortable: true },
  { id: 'totalImpactados', label: 'Público', sortable: true },
  { id: 'startDate', label: 'Início', sortable: true },
  { id: 'endDate', label: 'Fim', sortable: true },
  { id: 'status', label: 'Status', sortable: true },
  { id: 'acoes', label: 'Ações', sortable: false, align: 'right' },
];

export function CampaignList({
  campaigns,
  onEdit,
  onResults,
  onView,
  onDuplicate,
  onActivate,
}: Props) {
  const renderCell = (c: Campaign, columnId: string) => {
    switch (columnId) {
      case 'title':
        return <span className="font-medium text-foreground">{c.title}</span>;
      case 'tipoCampanha':
        return (
          <span className="text-muted-foreground">
            {CAMPAIGN_TYPE_OPTIONS.find((t) => t.value === c.tipoCampanha)?.label ?? c.tipoCampanha ?? '—'}
          </span>
        );
      case 'solicitante':
        return <span className="text-muted-foreground">{c.solicitante}</span>;
      case 'totalImpactados':
        return <span className="text-muted-foreground">{c.totalImpactados}</span>;
      case 'startDate':
        return <span className="text-muted-foreground">{formatDate(c.startDate)}</span>;
      case 'endDate':
        return <span className="text-muted-foreground">{formatDate(c.endDate)}</span>;
      case 'status': {
        const cfg = STATUS_CONFIG[c.status];
        return (
          <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md ${cfg.color} ${cfg.bg}`}>
            {cfg.label}
          </span>
        );
      }
      case 'acoes': {
        const cfg = STATUS_CONFIG[c.status];
        const buttons = getButtons(c.status);
        return (
          <div className="flex items-center justify-end gap-1">
            {buttons.includes('visualizar') && (
              <button
                type="button"
                onClick={() => onView(c)}
                title="Visualizar"
                className="p-1.5 rounded-md text-foreground hover:bg-surface-overlay transition-colors"
              >
                <Eye size={14} />
              </button>
            )}
            {buttons.includes('resultado') && (
              <button
                type="button"
                onClick={() => onResults(c)}
                title="Resultados"
                className="p-1.5 rounded-md text-primary hover:bg-primary/10 transition-colors"
              >
                <BarChart3 size={14} />
              </button>
            )}
            {buttons.includes('editar') && (
              <button
                type="button"
                onClick={() => onEdit(c)}
                title="Editar"
                className="p-1.5 rounded-md text-foreground hover:bg-surface-overlay transition-colors"
              >
                <Pencil size={14} />
              </button>
            )}
            {buttons.includes('duplicar') && (
              <button
                type="button"
                onClick={() => onDuplicate(c)}
                title="Duplicar"
                className="p-1.5 rounded-md text-foreground hover:bg-surface-overlay transition-colors"
              >
                <Copy size={14} />
              </button>
            )}
            {onActivate && c.status === 'nova' && (
              <button
                type="button"
                onClick={() => onActivate(c)}
                title="Ativar campanha"
                className="p-1.5 rounded-md text-success hover:bg-success/10 transition-colors"
              >
                <Zap size={14} />
              </button>
            )}
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <Card className="rounded-xl">
      <CardContent className="p-6">
        <DataTable<Campaign>
          columns={COLUMNS}
          data={campaigns}
          keyExtractor={(item) => item.id}
          renderCell={renderCell}
          emptyMessage="Nenhuma campanha encontrada"
        />
      </CardContent>
    </Card>
  );
}
