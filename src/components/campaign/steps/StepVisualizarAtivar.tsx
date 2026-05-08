import { useMemo } from 'react';
import { Check, X, Zap, TrendingUp, Bell, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Campaign, CAMPAIGN_TYPE_OPTIONS, QUESTION_TYPE_OPTIONS, HISTORICAL_RESPONSE_RATES, RECURRENCE_OPTIONS, RecurrenceType } from '../campaignData';

interface Props {
  data: Omit<Campaign, 'id'>;
  onActivate: () => void;
  canActivate: boolean;
  onChange?: (updates: Partial<Omit<Campaign, 'id'>>) => void;
}

function formatBR(d: string) {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

function getRepresentativityStatus(pct: number) {
  if (pct >= 40) return { label: 'Alta representatividade', color: 'text-success', icon: '🟢' };
  if (pct >= 15) return { label: 'Média representatividade', color: 'text-warning', icon: '🟡' };
  return { label: 'Baixa representatividade', color: 'text-destructive', icon: '🔴' };
}

export function StepVisualizarAtivar({ data, onActivate, canActivate, onChange }: Props) {
  const checks = [
    { label: 'Título preenchido', ok: !!data.title },
    { label: 'Período válido', ok: !!(data.startDate && data.endDate && data.endDate >= data.startDate) },
    { label: 'Público > 0', ok: data.totalImpactados > 0 },
    { label: 'Mínimo 1 pergunta', ok: data.questions.length > 0 },
  ];

  const typeName = CAMPAIGN_TYPE_OPTIONS.find(t => t.value === data.tipoCampanha)?.label || data.tipoCampanha || '—';

  // Engagement prediction
  const prediction = useMemo(() => {
    const rate = HISTORICAL_RESPONSE_RATES[data.tipoCampanha] || 0.60;
    const predicted = Math.round(data.totalImpactados * rate);
    return { rate: Math.round(rate * 100), predicted };
  }, [data.tipoCampanha, data.totalImpactados]);

  // Representativity
  const pctEmpresa = Math.round((data.totalImpactados / 146) * 100);
  const repr = getRepresentativityStatus(pctEmpresa);

  return (
    <div className="space-y-6 max-w-2xl">
      <h3 className="text-sm font-semibold text-foreground">Visualizar / Ativar</h3>

      {/* Summary */}
      <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Resumo da campanha</p>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <SummaryField label="Título" value={data.title || '—'} />
          <SummaryField label="Tipo" value={typeName} />
          <SummaryField label="Período" value={`${formatBR(data.startDate)} – ${formatBR(data.endDate)}`} />
          <SummaryField label="Solicitante" value={data.solicitante || '—'} />
          <SummaryField label="Público impactado" value={`${data.totalImpactados} colaboradores`} />
          <SummaryField label="Total de perguntas" value={`${data.questions.length}`} />
        </div>

        {/* Representativity indicator in summary */}
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <span className="text-sm">{repr.icon}</span>
          <span className={cn('text-[11px] font-semibold', repr.color)}>{repr.label}</span>
          <span className="text-[10px] text-muted-foreground">({pctEmpresa}% da empresa)</span>
        </div>
      </div>

      {/* Engagement Prediction */}
      <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={14} className="text-info" />
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Previsão de Engajamento</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-surface-elevated rounded-lg border border-border">
            <p className="text-lg font-bold text-foreground">{data.totalImpactados}</p>
            <p className="text-[10px] text-muted-foreground">Público da campanha</p>
          </div>
          <div className="text-center p-3 bg-info/5 rounded-lg border border-info/20">
            <p className="text-lg font-bold text-info">{prediction.rate}%</p>
            <p className="text-[10px] text-muted-foreground">Taxa média histórica</p>
          </div>
          <div className="text-center p-3 bg-success/5 rounded-lg border border-success/20">
            <p className="text-lg font-bold text-success">{prediction.predicted}</p>
            <p className="text-[10px] text-muted-foreground">Previsão de respostas</p>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground text-center">
          Baseado no histórico de campanhas do tipo "{typeName}"
        </p>
      </div>

      {/* Reminders Config */}
      {onChange && (
        <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Bell size={14} className="text-warning" />
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Lembretes Automáticos</p>
          </div>
          <p className="text-[10px] text-muted-foreground">Enviar lembretes para quem ainda não respondeu após:</p>
          <div className="flex items-center gap-3">
            {[3, 7, 14].map(days => {
              const isSelected = (data.reminderDays || []).includes(days);
              return (
                <label key={days} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {
                      const current = data.reminderDays || [];
                      const next = isSelected ? current.filter(d => d !== days) : [...current, days];
                      onChange({ reminderDays: next });
                    }}
                    className="sr-only"
                  />
                  <span className={cn(
                    'w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px]',
                    isSelected ? 'bg-warning border-warning text-warning-foreground' : 'border-border'
                  )}>
                    {isSelected && '✓'}
                  </span>
                  <span className="text-xs text-foreground">{days} dias</span>
                </label>
              );
            })}
          </div>
          {(data.reminderDays || []).length > 0 && (
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground pt-1 border-t border-border">
              <span>Respondidos: <strong className="text-success">{data.totalRespostas}</strong></span>
              <span>Pendentes: <strong className="text-warning">{data.totalImpactados - data.totalRespostas}</strong></span>
            </div>
          )}
        </div>
      )}

      {/* Recurrence Config */}
      {onChange && (
        <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <RefreshCw size={14} className="text-accent" />
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Campanha Recorrente</p>
          </div>
          <p className="text-[10px] text-muted-foreground">Configure recorrência para duplicação automática:</p>
          <div className="flex items-center gap-2">
            {RECURRENCE_OPTIONS.map(opt => {
              const isSelected = (data.recurrence || 'none') === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => onChange({ recurrence: opt.value })}
                  className={cn(
                    'px-3 py-1.5 text-[11px] font-medium rounded-lg border transition-colors',
                    isSelected
                      ? 'bg-accent/10 text-accent border-accent/30'
                      : 'border-border text-muted-foreground hover:text-foreground hover:bg-surface-overlay'
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Preview */}
      <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Pré-visualização do formulário</p>
        <div className="space-y-3">
          <div className="bg-surface-elevated border border-border rounded-lg p-4">
            <p className="text-base font-bold text-foreground">{data.title || 'Título da campanha'}</p>
            {data.description && <p className="text-xs text-muted-foreground mt-1">{data.description}</p>}
          </div>
          {data.questions.map((q, i) => (
            <div key={q.id} className="bg-surface-elevated border border-border rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-foreground">
                <span className="text-muted-foreground mr-1.5">{i + 1}.</span>
                {q.text}
                {q.required && <span className="text-destructive ml-1">*</span>}
              </p>
              <div className="text-[10px] text-muted-foreground">
                {QUESTION_TYPE_OPTIONS.find(o => o.value === q.type)?.label}
              </div>
              {q.options && q.options.length > 0 && (
                <div className="space-y-1 mt-2">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="w-3 h-3 rounded-full border border-border shrink-0" />
                      {opt}
                    </div>
                  ))}
                </div>
              )}
              {!q.options && (
                <div className="w-full h-10 bg-input border border-border rounded-lg flex items-center px-3 text-[11px] text-muted-foreground">
                  Campo de resposta
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-surface border border-border rounded-xl p-4 space-y-2">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Checklist de ativação</p>
        {checks.map(c => (
          <div key={c.label} className="flex items-center gap-2 text-xs">
            {c.ok ? (
              <span className="w-4 h-4 rounded-full bg-success/20 flex items-center justify-center"><Check size={10} className="text-success" /></span>
            ) : (
              <span className="w-4 h-4 rounded-full bg-destructive/20 flex items-center justify-center"><X size={10} className="text-destructive" /></span>
            )}
            <span className={c.ok ? 'text-foreground' : 'text-muted-foreground'}>{c.label}</span>
          </div>
        ))}
      </div>

      {/* Activate button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onActivate}
          disabled={!canActivate}
          className="flex items-center gap-2 px-6 py-3 bg-success text-success-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Zap size={16} /> Ativar Campanha
        </button>
      </div>

      {/* Governance */}
      <div className="flex flex-wrap gap-4 pt-3 border-t border-border text-[11px] text-muted-foreground">
        <span>Criado por: <strong className="text-foreground">{data.criadoPor}</strong></span>
        <span>Data criação: <strong className="text-foreground">{formatBR(data.createdAt)}</strong></span>
        {data.ativadoPor && <span>Ativado por: <strong className="text-foreground">{data.ativadoPor}</strong></span>}
        {data.dataAtivacao && <span>Data ativação: <strong className="text-foreground">{formatBR(data.dataAtivacao)}</strong></span>}
      </div>
    </div>
  );
}

function SummaryField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-sm text-foreground font-medium mt-0.5">{value}</p>
    </div>
  );
}
