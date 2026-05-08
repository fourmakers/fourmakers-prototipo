import { useState, useRef, useCallback } from 'react';
import { BarChart3, Pencil, Eye, Copy, GripVertical, Archive, Zap, AlertTriangle } from 'lucide-react';
import { Campaign, CampaignStatus, KANBAN_COLUMNS, STATUS_CONFIG } from './campaignData';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel,
} from '@/components/ui/alert-dialog';

const COLUMN_ORDER: CampaignStatus[] = KANBAN_COLUMNS.map((c) => c.status);

interface Props {
  campaigns: Campaign[];
  onEdit: (c: Campaign) => void;
  onResults: (c: Campaign) => void;
  onView: (c: Campaign) => void;
  onDuplicate: (c: Campaign) => void;
  onStatusChange: (id: string, status: CampaignStatus) => void;
  onActivate?: (c: Campaign) => void;
}

function formatDate(d: string) {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

// Button config per status
function getButtons(status: CampaignStatus): ('visualizar' | 'resultado' | 'editar' | 'duplicar' | 'cancelar')[] {
  switch (status) {
    case 'rascunho': return ['editar'];
    case 'nova': return ['visualizar', 'editar', 'cancelar'];
    case 'ativa': return ['visualizar', 'resultado', 'cancelar'];
    case 'concluida': return ['visualizar', 'resultado', 'duplicar'];
    case 'cancelada': return ['visualizar', 'resultado', 'duplicar'];
    case 'arquivada': return ['visualizar', 'resultado', 'duplicar'];
    default: return ['visualizar'];
  }
}

export function CampaignKanban({ campaigns, onEdit, onResults, onView, onDuplicate, onStatusChange, onActivate }: Props) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<CampaignStatus | null>(null);
  const [pendingMove, setPendingMove] = useState<{ id: string; from: CampaignStatus; to: CampaignStatus } | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMouseDragging, setIsMouseDragging] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const onScrollMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('[draggable="true"]') || target.closest('button')) return;
    if (!scrollRef.current) return;
    setIsMouseDragging(true);
    startXRef.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
  }, []);

  const onScrollMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isMouseDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
  }, [isMouseDragging]);

  const onScrollMouseUp = useCallback(() => {
    setIsMouseDragging(false);
  }, []);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent, status: CampaignStatus) => {
    if (!draggedId) return;
    const campaign = campaigns.find((c) => c.id === draggedId);
    if (!campaign) return;
    const fromIdx = COLUMN_ORDER.indexOf(campaign.status);
    const toIdx = COLUMN_ORDER.indexOf(status);
    if (toIdx <= fromIdx) {
      e.dataTransfer.dropEffect = 'none';
      return;
    }
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCol(status);
  };

  const handleDragLeave = () => setDragOverCol(null);

  const handleDrop = (e: React.DragEvent, status: CampaignStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (!id) return;
    const campaign = campaigns.find((c) => c.id === id);
    if (!campaign) return;
    const fromIdx = COLUMN_ORDER.indexOf(campaign.status);
    const toIdx = COLUMN_ORDER.indexOf(status);
    if (toIdx <= fromIdx) return;
    setPendingMove({ id, from: campaign.status, to: status });
    setDraggedId(null);
    setDragOverCol(null);
  };

  const confirmMove = () => {
    if (pendingMove) {
      onStatusChange(pendingMove.id, pendingMove.to);
      setPendingMove(null);
    }
  };

  const cancelMove = () => setPendingMove(null);

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverCol(null);
  };

  return (
    <div
      ref={scrollRef}
      onMouseDown={onScrollMouseDown}
      onMouseMove={onScrollMouseMove}
      onMouseUp={onScrollMouseUp}
      onMouseLeave={onScrollMouseUp}
      className={`flex flex-nowrap gap-0 overflow-x-auto pb-2 divide-x divide-black/[0.08] dark:divide-white/[0.12] ${isMouseDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
    >
      {KANBAN_COLUMNS.map(col => {
        const items = campaigns.filter(c => c.status === col.status);
        const cfg = STATUS_CONFIG[col.status];
        const isOver = dragOverCol === col.status;
        const isArchived = col.status === 'arquivada';

        return (
          <div
            key={col.status}
            className={`flex flex-col rounded-xl p-3 transition-colors min-w-[300px] w-[300px] shrink-0 hover:bg-black/[0.03] dark:hover:bg-white/[0.04] ${
              isOver ? 'border-2 border-primary/40 bg-primary/5' : 'border-2 border-transparent'
            }`}
            onDragOver={e => handleDragOver(e, col.status)}
            onDragLeave={handleDragLeave}
            onDrop={e => handleDrop(e, col.status)}
          >
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${cfg.color}`}>
                <span className={`w-2 h-2 rounded-full ${cfg.bg} ring-2 ring-current`} />
                {col.label}
              </span>
              <span className="text-[10px] text-muted-foreground bg-surface-overlay rounded-full px-1.5 py-0.5 min-w-[18px] text-center font-medium">
                {items.length}
              </span>
            </div>

            <div className="flex flex-col gap-2.5 min-h-[120px]">
              {items.length === 0 && (
                <div className="flex items-center justify-center h-24 border border-dashed border-border rounded-xl text-xs text-muted-foreground">
                  Nenhuma campanha
                </div>
              )}
              {items.map(campaign => (
                isArchived ? (
                  <ArchivedCard
                    key={campaign.id}
                    campaign={campaign}
                    onView={() => onView(campaign)}
                    onResults={() => onResults(campaign)}
                    onDuplicate={() => onDuplicate(campaign)}
                    isDragging={draggedId === campaign.id}
                    onDragStart={e => handleDragStart(e, campaign.id)}
                    onDragEnd={handleDragEnd}
                  />
                ) : (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    onEdit={() => onEdit(campaign)}
                    onResults={() => onResults(campaign)}
                    onView={() => onView(campaign)}
                    onDuplicate={() => onDuplicate(campaign)}
                    onActivate={onActivate ? () => onActivate(campaign) : undefined}
                    onCancel={() => onStatusChange(campaign.id, 'cancelada')}
                    isDragging={draggedId === campaign.id}
                    onDragStart={(e) => handleDragStart(e, campaign.id)}
                    onDragEnd={handleDragEnd}
                  />
                )
              ))}
            </div>
          </div>
        );
      })}

      <AlertDialog open={!!pendingMove} onOpenChange={(open) => { if (!open) cancelMove(); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <AlertDialogTitle>Confirmar mudança de status</AlertDialogTitle>
            </div>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  Deseja mover a campanha de{' '}
                  <span className="font-semibold text-foreground">
                    {pendingMove ? STATUS_CONFIG[pendingMove.from].label : ''}
                  </span>
                  {' '}para{' '}
                  <span className="font-semibold text-foreground">
                    {pendingMove ? STATUS_CONFIG[pendingMove.to].label : ''}
                  </span>?
                </p>
                <p className="text-xs">
                  Data da alteração: <span className="font-medium">{pendingMove ? new Date().toLocaleString('pt-BR') : ''}</span>
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelMove}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmMove}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function CampaignCard({
  campaign, onEdit, onResults, onView, onDuplicate, onActivate, onCancel, isDragging, onDragStart, onDragEnd,
}: {
  campaign: Campaign; onEdit: () => void; onResults: () => void; onView: () => void; onDuplicate: () => void;
  onActivate?: () => void; onCancel?: () => void;
  isDragging: boolean; onDragStart: (e: React.DragEvent) => void; onDragEnd: () => void;
}) {
  const cfg = STATUS_CONFIG[campaign.status];
  const buttons = getButtons(campaign.status);

  return (
    <div className={`bg-surface-elevated border border-border rounded-xl p-3.5 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card-hover)] transition-all group select-none ${isDragging ? 'opacity-50' : ''}`}>
      <div className="flex items-start justify-between mb-2">
        <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md ${cfg.color} ${cfg.bg}`}>
          {cfg.label}
        </span>
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div draggable onDragStart={onDragStart} onDragEnd={onDragEnd}
                className="cursor-grab active:cursor-grabbing p-1 rounded-md hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground">
                <GripVertical size={14} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">Arraste entre colunas</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <h4 className="text-sm font-medium text-foreground mt-2 mb-1.5 line-clamp-2">{campaign.title}</h4>
      <p className="text-[11px] text-muted-foreground mb-1">
        {formatDate(campaign.startDate)} – {formatDate(campaign.endDate)}
      </p>
      <p className="text-[11px] text-muted-foreground">{campaign.publicoAlvo}</p>
      <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-border flex-wrap">
        {buttons.includes('visualizar') && (
          <button type="button" onClick={onView} title="Visualizar campanha"
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-foreground hover:bg-muted/50 transition-colors">
            <Eye size={13} /> Visualizar
          </button>
        )}
        {buttons.includes('resultado') && (
          <button type="button" onClick={onResults} title="Ver resultados"
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-primary hover:bg-primary/10 transition-colors">
            <BarChart3 size={13} /> Resultado
          </button>
        )}
        {buttons.includes('editar') && (
          <button type="button" onClick={onEdit} title="Editar campanha"
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-foreground hover:bg-muted/50 transition-colors">
            <Pencil size={13} /> Editar
          </button>
        )}
        {buttons.includes('duplicar') && (
          <button type="button" onClick={onDuplicate} title="Duplicar campanha"
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-foreground hover:bg-muted/50 transition-colors">
            <Copy size={13} /> Duplicar
          </button>
        )}
        {buttons.includes('cancelar') && onCancel && (
          <button type="button" onClick={onCancel} title="Cancelar campanha"
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-destructive hover:bg-destructive/10 transition-colors">
            Cancelar
          </button>
        )}
        {onActivate && campaign.status === 'nova' && (
          <button type="button" onClick={onActivate} title="Ativar campanha"
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-green-600 hover:bg-green-500/10 transition-colors ml-auto">
            <Zap size={13} /> Ativar
          </button>
        )}
      </div>
    </div>
  );
}

function ArchivedCard({
  campaign, onView, onResults, onDuplicate, isDragging, onDragStart, onDragEnd,
}: {
  campaign: Campaign; onView: () => void; onResults: () => void; onDuplicate: () => void;
  isDragging: boolean; onDragStart: (e: React.DragEvent) => void; onDragEnd: () => void;
}) {
  return (
    <div className={`bg-surface-elevated border border-border rounded-xl p-2.5 elevation-soft transition-all group select-none ${isDragging ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-medium text-foreground truncate flex-1">{campaign.title}</h4>
        <div draggable onDragStart={onDragStart} onDragEnd={onDragEnd}
          className="cursor-grab active:cursor-grabbing p-0.5 rounded-md hover:bg-surface-overlay transition-colors text-muted-foreground">
          <GripVertical size={12} />
        </div>
      </div>
      <div className="flex items-center gap-1 mt-1.5">
        <button onClick={onView} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors" title="Visualizar">
          <Eye size={12} />
        </button>
        <button onClick={onResults} className="p-1 rounded-md text-primary hover:bg-primary/10 transition-colors" title="Resultado">
          <BarChart3 size={12} />
        </button>
        <button onClick={onDuplicate} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors" title="Duplicar">
          <Copy size={12} />
        </button>
      </div>
    </div>
  );
}
