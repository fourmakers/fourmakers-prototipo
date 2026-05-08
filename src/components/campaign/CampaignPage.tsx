import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { LayoutGrid, List, Plus, X, Search, CalendarIcon } from 'lucide-react';
import { format, parse, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { CampaignKanban } from './CampaignKanban';
import { CampaignList } from './CampaignList';
import { CampaignResultsPage } from './CampaignResultsPage';
import { CampaignResponseModal } from './CampaignResponseModal';
import {
  Campaign,
  CampaignStatus,
  MOCK_CAMPAIGNS,
  STATUS_CONFIG,
  SOLICITANTE_OPTIONS,
} from './campaignData';

type ViewMode = 'kanban' | 'lista';

interface CampaignLocationState {
  savedCampaign?: Campaign;
}

interface CampaignPageProps {
  autoOpenNew?: boolean;
  onAutoOpenConsumed?: () => void;
}

export function CampaignPage({ autoOpenNew, onAutoOpenConsumed }: CampaignPageProps = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [viewingCampaign, setViewingCampaign] = useState<Campaign | null>(null);
  const [resultsPage, setResultsPage] = useState<Campaign | null>(null);

  // Handle saved campaign coming back from stepper page
  useEffect(() => {
    const saved = (location.state as CampaignLocationState | null)?.savedCampaign;
    if (saved) {
      setCampaigns(prev => {
        const exists = prev.find(c => c.id === saved.id);
        if (exists) return prev.map(c => c.id === saved.id ? saved : c);
        return [...prev, saved];
      });
      // Clear the state so it doesn't re-apply
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  // Filters
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterSolicitante, setFilterSolicitante] = useState<string>('');
  const [filterStartDate, setFilterStartDate] = useState<Date | undefined>();
  const [filterEndDate, setFilterEndDate] = useState<Date | undefined>();
  const [searchName, setSearchName] = useState<string>('');

  const hasFilters = filterStatus || filterSolicitante || filterStartDate || filterEndDate || searchName;

  const clearFilters = () => {
    setFilterStatus('');
    setFilterSolicitante('');
    setFilterStartDate(undefined);
    setFilterEndDate(undefined);
    setSearchName('');
  };

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(c => {
      // Hide drafts from kanban/list unless filtering for them
      if (c.status === 'rascunho' && !filterStatus) return false;
      if (filterStatus && c.status !== filterStatus) return false;
      if (filterSolicitante && c.solicitante !== filterSolicitante) return false;
      if (filterStartDate || filterEndDate) {
        const cStart = c.startDate ? new Date(c.startDate + 'T00:00:00') : null;
        const cEnd = c.endDate ? new Date(c.endDate + 'T00:00:00') : null;
        const isStartValid = cStart && !isNaN(cStart.getTime());
        const isEndValid = cEnd && !isNaN(cEnd.getTime());
        if (filterStartDate && isEndValid && cEnd < filterStartDate) return false;
        if (filterEndDate && isStartValid && cStart > filterEndDate) return false;
        if (!isStartValid && !isEndValid) return false;
      }
      if (searchName && !c.title.toLowerCase().includes(searchName.toLowerCase())) return false;
      return true;
    });
  }, [campaigns, filterStatus, filterSolicitante, filterStartDate, filterEndDate, searchName]);

  const handleEdit = (campaign: Campaign) => {
    navigate(`/campanha/editar/${campaign.id}`, { state: { campaign } });
  };

  const handleResults = (campaign: Campaign) => {
    setResultsPage(campaign);
  };

  const handleNewCampaign = () => {
    navigate('/campanha/nova');
  };

  const handleStatusChange = (id: string, newStatus: CampaignStatus) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const handleView = (campaign: Campaign) => {
    setViewingCampaign(campaign);
  };

  const { toast } = useToast();

  const handleActivate = useCallback((campaign: Campaign) => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setCampaigns(prev => prev.map(c =>
      c.id === campaign.id ? { ...c, status: 'ativa' as CampaignStatus, startDate: `${yyyy}-${mm}-${dd}`, ativadoPor: 'Gestor Principal', dataAtivacao: `${yyyy}-${mm}-${dd}` } : c
    ));
    setViewingCampaign(null);
    toast({ title: 'Campanha ativada', description: `"${campaign.title}" foi ativada com sucesso.` });
  }, [toast]);

  const handleDuplicate = (campaign: Campaign) => {
    const duplicated: Campaign = {
      ...campaign,
      id: `c${Date.now()}`,
      title: `${campaign.title} (Cópia)`,
      status: 'rascunho',
      startDate: '',
      endDate: '',
      totalRespostas: 0,
      respondentes: [],
      criadoPor: 'Gestor Principal',
      createdAt: new Date().toISOString().split('T')[0],
      ativadoPor: undefined,
      dataAtivacao: undefined,
    };
    navigate(`/campanha/duplicar/${campaign.id}`, { state: { campaign: duplicated } });
  };

  // Auto-update status based on dates
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setCampaigns(prev => prev.map(c => {
      if (c.status === 'cancelada' || c.status === 'arquivada' || c.status === 'rascunho') return c;
      if (!c.startDate || !c.endDate) return c;
      const start = new Date(c.startDate + 'T00:00:00');
      const end = new Date(c.endDate + 'T00:00:00');
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return c;
      if (end < today && (c.status === 'ativa' || c.status === 'nova')) return { ...c, status: 'concluida' as CampaignStatus };
      if (start <= today && today <= end && c.status === 'nova') return { ...c, status: 'ativa' as CampaignStatus };
      return c;
    }));
  }, []);

  // Auto-open new campaign form when triggered from Lista Combinada
  useEffect(() => {
    if (autoOpenNew) {
      handleNewCampaign();
      onAutoOpenConsumed?.();
    }
  }, [autoOpenNew]);

  // If showing results page, render that instead
  if (resultsPage) {
    return <CampaignResultsPage campaign={resultsPage} onBack={() => setResultsPage(null)} />;
  }

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <section className="bg-surface-elevated border border-border rounded-xl px-4 py-3 elevation-soft">
        <div className="flex items-center gap-3 flex-wrap">
          <FilterSelect label="Status" value={filterStatus} onChange={setFilterStatus}
            options={Object.entries(STATUS_CONFIG).map(([k, v]) => ({ value: k, label: v.label }))} />
          <FilterSelect label="Solicitante" value={filterSolicitante} onChange={setFilterSolicitante}
            options={SOLICITANTE_OPTIONS.map(s => ({ value: s, label: s }))} />

          {/* Período */}
          <DateField value={filterStartDate} onChange={setFilterStartDate} placeholder="Data início" />
          <DateField value={filterEndDate} onChange={setFilterEndDate} placeholder="Data fim" />

          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
              placeholder="Busca por nome..."
              className="h-8 pl-8 pr-2.5 text-xs rounded-lg border border-border bg-surface-elevated text-foreground placeholder:text-muted-foreground hover:border-primary/40 transition-colors focus:outline-none focus:ring-1 focus:ring-primary w-48"
            />
          </div>

          {hasFilters && (
            <button onClick={clearFilters} className="text-xs text-destructive hover:underline flex items-center gap-1 ml-auto">
              <X size={12} /> Limpar filtros
            </button>
          )}
        </div>
      </section>

      {/* Título da página (padrão fourmakers-v2) */}
      <div className="px-1 flex items-center justify-between">
        <div>
          <h1 className="page-title">Campanhas</h1>
          <p className="page-subtitle mt-0.5">Ação estratégica com objetivo claro e foco em resultado.</p>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider delayDuration={300}>
            <div className="flex items-center border border-border rounded-lg p-0.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setViewMode('kanban')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'kanban' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <LayoutGrid size={16} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Kanban</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setViewMode('lista')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'lista' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <List size={16} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Lista</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
          <button
            onClick={handleNewCampaign}
            className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-pillToken text-xs font-medium hover:bg-btnPrimaryHover transition-colors"
          >
            <Plus size={14} /> Nova Campanha
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'kanban' ? (
        <CampaignKanban campaigns={filteredCampaigns} onEdit={handleEdit} onResults={handleResults} onView={handleView} onDuplicate={handleDuplicate} onStatusChange={handleStatusChange} onActivate={handleActivate} />
      ) : (
        <CampaignList campaigns={filteredCampaigns} onEdit={handleEdit} onResults={handleResults} onView={handleView} onDuplicate={handleDuplicate} onActivate={handleActivate} />
      )}




      {viewingCampaign && (
        <CampaignResponseModal
          campaign={viewingCampaign}
          open={!!viewingCampaign}
          onClose={() => setViewingCampaign(null)}
        />
      )}
    </div>
  );
}

// ── Inline Filter Select ──────────────────────────────────────
function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="h-8 px-2.5 text-xs rounded-lg border border-border bg-surface-elevated text-foreground appearance-none cursor-pointer hover:border-primary/40 transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
    >
      <option value="">{label}</option>
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

// ── Helpers de máscara e parse de data BR ──────────────────────
function maskDateInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function parseBRDate(str: string): Date | undefined {
  if (str.length !== 10) return undefined;
  const parsed = parse(str, 'dd/MM/yyyy', new Date());
  return isValid(parsed) ? parsed : undefined;
}

// ── DateField: ícone calendário | input digitável ─────────────
function DateField({
  value,
  onChange,
  placeholder,
}: {
  value: Date | undefined;
  onChange: (d: Date | undefined) => void;
  placeholder: string;
}) {
  const [text, setText] = useState(value ? format(value, 'dd/MM/yyyy') : '');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setText(value ? format(value, 'dd/MM/yyyy') : '');
  }, [value]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskDateInput(e.target.value);
    setText(masked);
    if (masked.length === 10) {
      const d = parseBRDate(masked);
      if (d) onChange(d);
    } else if (masked.length === 0) {
      onChange(undefined);
    }
  };

  const handleCalendarSelect = (d: Date | undefined) => {
    onChange(d);
    setOpen(false);
  };

  return (
    <div className="flex items-center h-8 rounded-lg border border-border bg-surface-elevated overflow-hidden hover:border-primary/40 transition-colors focus-within:ring-1 focus-within:ring-primary">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button type="button" className="flex items-center justify-center w-8 h-full text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <CalendarIcon size={14} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={value} onSelect={handleCalendarSelect} initialFocus locale={ptBR} className="p-3 pointer-events-auto" />
        </PopoverContent>
      </Popover>
      <div className="w-px h-4 bg-border shrink-0" />
      <input
        type="text"
        value={text}
        onChange={handleInput}
        placeholder={placeholder}
        maxLength={10}
        className="h-full px-2 text-xs bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none w-28"
      />
    </div>
  );
}
