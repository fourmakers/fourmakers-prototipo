import { useState, useEffect, useMemo } from 'react';
import { format, parse, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Campaign, CAMPAIGN_TYPE_OPTIONS, MOCK_SOLICITANTES } from '../campaignData';

interface Props {
  data: Omit<Campaign, 'id'>;
  onChange: (updates: Partial<Omit<Campaign, 'id'>>) => void;
}

export function StepDadosBasicos({ data, onChange }: Props) {
  const [solicitanteSearch, setSolicitanteSearch] = useState(data.solicitante || '');
  const [showSolicitanteDropdown, setShowSolicitanteDropdown] = useState(false);
  const [startText, setStartText] = useState(data.startDate ? formatBR(data.startDate) : '');
  const [endText, setEndText] = useState(data.endDate ? formatBR(data.endDate) : '');
  const [dateError, setDateError] = useState('');

  const filteredSolicitantes = useMemo(() => {
    if (solicitanteSearch.length < 3) return [];
    const q = solicitanteSearch.toLowerCase();
    return MOCK_SOLICITANTES.filter(s => s.nome.toLowerCase().includes(q));
  }, [solicitanteSearch]);

  useEffect(() => {
    setStartText(data.startDate ? formatBR(data.startDate) : '');
    setEndText(data.endDate ? formatBR(data.endDate) : '');
  }, [data.startDate, data.endDate]);

  const handleDateInput = (value: string, field: 'startDate' | 'endDate') => {
    const masked = maskDate(value);
    if (field === 'startDate') setStartText(masked);
    else setEndText(masked);

    if (masked.length === 10) {
      const iso = parseBRtoISO(masked);
      if (iso) {
        onChange({ [field]: iso });
        const other = field === 'startDate' ? data.endDate : data.startDate;
        if (other) {
          if (field === 'startDate' && iso > other) setDateError('Data fim deve ser ≥ data início');
          else if (field === 'endDate' && iso < (data.startDate || '')) setDateError('Data fim deve ser ≥ data início');
          else setDateError('');
        }
      }
    } else if (masked.length === 0) {
      onChange({ [field]: '' });
      setDateError('');
    }
  };

  const handleCalendar = (date: Date | undefined, field: 'startDate' | 'endDate') => {
    if (!date) return;
    const iso = format(date, 'yyyy-MM-dd');
    onChange({ [field]: iso });
    if (field === 'startDate') setStartText(format(date, 'dd/MM/yyyy'));
    else setEndText(format(date, 'dd/MM/yyyy'));
    if (field === 'startDate' && data.endDate && iso > data.endDate) setDateError('Data fim deve ser ≥ data início');
    else if (field === 'endDate' && data.startDate && iso < data.startDate) setDateError('Data fim deve ser ≥ data início');
    else setDateError('');
  };

  return (
    <div className="space-y-5 max-w-lg">
      <h3 className="text-sm font-semibold text-foreground">Dados Básicos</h3>

      {/* Título */}
      <Field label="Título da Campanha *">
        <div className="relative">
          <input
            value={data.title}
            onChange={e => {
              if (e.target.value.length <= 50) onChange({ title: e.target.value });
            }}
            placeholder="Ex: Censo Diversidade 2025"
            className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <span className={cn("absolute right-2 top-1/2 -translate-y-1/2 text-[10px]", data.title.length >= 45 ? 'text-warning' : 'text-muted-foreground')}>
            {data.title.length}/50
          </span>
        </div>
      </Field>

      {/* Descrição */}
      <Field label="Descrição curta">
        <div className="relative">
          <input
            value={data.description}
            onChange={e => {
              if (e.target.value.length <= 120) onChange({ description: e.target.value });
            }}
            placeholder="Breve descrição da campanha"
            className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
            {data.description.length}/120
          </span>
        </div>
      </Field>

      {/* Tipo */}
      <Field label="Tipo da Campanha">
        <select
          value={data.tipoCampanha}
          onChange={e => onChange({ tipoCampanha: e.target.value })}
          className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
        >
          <option value="">Selecione</option>
          {CAMPAIGN_TYPE_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </Field>

      {/* Period */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Data Início *">
          <DateInput value={startText} onChange={v => handleDateInput(v, 'startDate')} isoDate={data.startDate} onCalendarSelect={d => handleCalendar(d, 'startDate')} />
        </Field>
        <Field label="Data Fim *">
          <DateInput value={endText} onChange={v => handleDateInput(v, 'endDate')} isoDate={data.endDate} onCalendarSelect={d => handleCalendar(d, 'endDate')} minDate={data.startDate} />
        </Field>
      </div>
      {dateError && <p className="text-xs text-destructive -mt-3">{dateError}</p>}

      {/* Solicitante */}
      <Field label="Solicitante da Campanha *">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            value={solicitanteSearch}
            onChange={e => {
              setSolicitanteSearch(e.target.value);
              setShowSolicitanteDropdown(true);
              if (!MOCK_SOLICITANTES.some(s => s.nome === e.target.value)) {
                onChange({ solicitante: '', solicitanteCargo: '', solicitanteUnidade: '' });
              }
            }}
            onFocus={() => solicitanteSearch.length >= 3 && setShowSolicitanteDropdown(true)}
            placeholder="Digite ao menos 3 letras para buscar..."
            className="w-full pl-8 pr-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {showSolicitanteDropdown && filteredSolicitantes.length > 0 && (
            <div className="absolute z-50 mt-1 w-full bg-surface-elevated border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {filteredSolicitantes.map(s => (
                <button
                  key={s.nome}
                  onClick={() => {
                    onChange({ solicitante: s.nome, solicitanteCargo: s.cargo, solicitanteUnidade: s.unidade });
                    setSolicitanteSearch(s.nome);
                    setShowSolicitanteDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-surface-overlay transition-colors"
                >
                  <p className="text-xs font-medium text-foreground">{s.nome}</p>
                  <p className="text-[10px] text-muted-foreground">{s.cargo} • {s.unidade}</p>
                </button>
              ))}
            </div>
          )}
        </div>
        {data.solicitante && (
          <p className="text-[11px] text-success mt-1">✓ {data.solicitante} — {data.solicitanteCargo} • {data.solicitanteUnidade}</p>
        )}
      </Field>

      {/* Governance info */}
      <div className="flex items-center gap-4 pt-3 border-t border-border text-[11px] text-muted-foreground">
        <span>Criado por: <strong className="text-foreground">{data.criadoPor}</strong></span>
        <span>Data criação: <strong className="text-foreground">{formatBR(data.createdAt)}</strong></span>
        <span>Status: <strong className="text-foreground">Rascunho</strong></span>
      </div>
    </div>
  );
}

// Helpers
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-secondary-text mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function formatBR(d: string) {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

function maskDate(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function parseBRtoISO(str: string): string | undefined {
  if (str.length !== 10) return undefined;
  const parsed = parse(str, 'dd/MM/yyyy', new Date());
  return isValid(parsed) ? format(parsed, 'yyyy-MM-dd') : undefined;
}

function DateInput({ value, onChange, isoDate, onCalendarSelect, minDate }: {
  value: string; onChange: (v: string) => void; isoDate: string;
  onCalendarSelect: (d: Date | undefined) => void; minDate?: string;
}) {
  return (
    <div className="flex items-center gap-1">
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="DD/MM/AAAA"
        maxLength={10}
        className="flex-1 px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
      />
      <Popover>
        <PopoverTrigger asChild>
          <button className="p-2 border border-border rounded-lg hover:bg-surface-overlay transition-colors text-muted-foreground">
            <CalendarIcon size={15} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={isoDate ? new Date(isoDate + 'T12:00:00') : undefined}
            onSelect={onCalendarSelect}
            disabled={minDate ? (date) => date < new Date(minDate + 'T00:00:00') : undefined}
            className={cn("p-3 pointer-events-auto")}
            locale={ptBR}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
