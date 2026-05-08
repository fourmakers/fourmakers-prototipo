import { X, Zap } from 'lucide-react';
import { Campaign, DEMOGRAPHIC_RESPONSE_OPTIONS } from './campaignData';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

interface Props {
  campaign: Campaign;
  open: boolean;
  onClose: () => void;
  onActivate?: (campaign: Campaign) => void;
}

function formatDate(d: string) {
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

export function CampaignResponseModal({ campaign, open, onClose, onActivate }: Props) {
  if (!open) return null;

  const isQuestions = campaign.formato === 'perguntas-aleatorias';
  const demographicItems = campaign.itensDemograficos.filter(item => DEMOGRAPHIC_RESPONSE_OPTIONS[item]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-surface-elevated border border-border rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col elevation-soft mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <span className="text-base font-bold text-foreground tracking-tight">
            <span className="text-accent">four</span>makers
          </span>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-surface-overlay transition-colors text-muted-foreground">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Block 1 — General Info */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField label="Solicitante" value={campaign.solicitante} />
              <InfoField label="Área" value={campaign.area} />
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Título da Campanha</span>
              <p className="text-lg font-bold text-foreground mt-0.5">{campaign.title}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField label="Objetivo" value="Coletar dados estratégicos para tomada de decisão e planejamento organizacional." />
              <InfoField label="Descrição" value="Esta campanha visa obter informações relevantes dos colaboradores para fortalecer políticas internas e promover ações de melhoria contínua." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField label="Data Início" value={formatDate(campaign.startDate)} />
              <InfoField label="Data Fim" value={formatDate(campaign.endDate)} />
            </div>
          </div>

          <div className="border-t border-border" />

          {/* Block 2 — Campaign Type */}
          <div>
            <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Tipo de Campanha</span>
            <div className="mt-1.5">
              <span className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-md ${
                isQuestions ? 'text-info bg-info/10' : 'text-accent bg-accent/10'
              }`}>
                {isQuestions ? 'Perguntas Aleatórias' : 'Itens Demográficos'}
              </span>
            </div>
          </div>

          <div className="border-t border-border" />

          {/* Scenario 1 — Questions (read-only) */}
          {isQuestions && (
            <div className="space-y-4">
              <span className="text-sm font-semibold text-foreground">Perguntas da campanha</span>
              {campaign.questions.map((q, i) => (
                <div key={q.id} className="bg-surface-subtle border border-border rounded-xl p-4 space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    <span className="text-muted-foreground mr-1.5">{i + 1}.</span>
                    {q.text}
                  </p>
                  <Textarea
                    disabled
                    placeholder="Resposta do colaborador..."
                    className="text-sm bg-muted cursor-not-allowed"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Scenario 2 — Demographics (read-only) */}
          {!isQuestions && (
            <div className="space-y-4">
              <span className="text-sm font-semibold text-foreground">Itens demográficos da campanha</span>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {demographicItems.map(item => {
                  const options = DEMOGRAPHIC_RESPONSE_OPTIONS[item] || [];
                  return (
                    <div key={item} className="bg-surface-subtle border border-border rounded-xl p-4 space-y-3">
                      <p className="text-sm font-bold text-foreground">{item}</p>
                      <RadioGroup disabled className="space-y-1.5">
                        {options.map(opt => (
                          <div key={opt} className="flex items-center space-x-2">
                            <RadioGroupItem value={opt} id={`${item}-${opt}`} disabled />
                            <Label htmlFor={`${item}-${opt}`} className="text-xs text-muted-foreground cursor-not-allowed">{opt}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-pillToken border border-border text-foreground hover:bg-surface-overlay transition-colors"
          >
            Fechar
          </button>
          {onActivate && (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onActivate(campaign)}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-pillToken bg-primary text-primary-foreground hover:bg-btnPrimaryHover transition-colors"
                  >
                    <Zap size={14} />
                    Ativar campanha
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Inicia a campanha antes da data programada.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">{label}</span>
      <p className="text-sm text-foreground mt-0.5">{value}</p>
    </div>
  );
}
