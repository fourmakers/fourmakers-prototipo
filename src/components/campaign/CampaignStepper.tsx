import { useState, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Save, Zap, Check, FileText, Users, HelpCircle, Eye, ChevronDown, CircleDot, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Campaign, CampaignStatus, CampaignType } from './campaignData';
import { StepDadosBasicos } from './steps/StepDadosBasicos';
import { StepPublicoAlvo, FILTER_CATEGORIES, FULL_AUDIENCE } from './steps/StepPublicoAlvo';
import { StepPerguntas } from './steps/StepPerguntas';
import { StepVisualizarAtivar } from './steps/StepVisualizarAtivar';
import { useToast } from '@/hooks/use-toast';

const STEPS = [
  { id: 1, label: 'Dados Básicos', description: 'Título, tipo e período', icon: FileText },
  { id: 2, label: 'Público-Alvo', description: 'Segmentação e filtros', icon: Users },
  { id: 3, label: 'Perguntas', description: 'Formulário da campanha', icon: HelpCircle },
  { id: 4, label: 'Visualizar / Ativar', description: 'Revisão e ativação', icon: Eye },
];

interface Props {
  campaign: Campaign | null;
  onSave: (c: Campaign) => void;
  onClose: () => void;
  isDuplicate?: boolean;
}

function createEmptyCampaign(): Omit<Campaign, 'id'> {
  const today = new Date();
  return {
    title: '',
    description: '',
    status: 'rascunho',
    startDate: '',
    endDate: '',
    publicoAlvo: 'Todos os Colaboradores',
    solicitante: '',
    solicitanteCargo: '',
    solicitanteUnidade: '',
    area: '',
    tipoCampanha: '' as CampaignType,
    formato: 'perguntas-aleatorias',
    localDistribuicao: [],
    questions: [],
    itensDemograficos: [],
    createdAt: today.toISOString().split('T')[0],
    criadoPor: 'Gestor Principal',
    totalImpactados: 0,
    totalRespostas: 0,
    respondentes: [],
    stepsCompleted: [],
    recurrence: 'none',
    reminderDays: [],
  };
}

export function CampaignStepper({ campaign, onSave, onClose, isDuplicate }: Props) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const isNew = !campaign;

  // Track which steps user has visited (for new campaigns, only step 1 is initially accessible)
  const [visitedSteps, setVisitedSteps] = useState<number[]>(() => {
    if (campaign) return [1, 2, 3, 4]; // Editing: all steps accessible
    return [1]; // New: only step 1
  });

  // Filter state lifted from StepPublicoAlvo
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [expandedCategories, setExpandedCategories] = useState<string[]>(FILTER_CATEGORIES.map(c => c.key));

  const toggleCategory = (key: string) => {
    setExpandedCategories(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const toggleFilter = (category: string, value: string) => {
    setSelectedFilters(prev => {
      const current = prev[category] || [];
      const next = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      if (next.length === 0) {
        const { [category]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [category]: next };
    });
  };

  const [formData, setFormData] = useState<Omit<Campaign, 'id'>>(() => {
    if (campaign) {
      const { id, ...rest } = campaign;
      return { ...rest, stepsCompleted: rest.stepsCompleted || [], recurrence: rest.recurrence || 'none', reminderDays: rest.reminderDays || [] };
    }
    return createEmptyCampaign();
  });

  const updateForm = useCallback((updates: Partial<Omit<Campaign, 'id'>>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  // Validation per step
  const step1Valid = useMemo(() => {
    return !!(formData.title && formData.title.length <= 50 && formData.startDate && formData.endDate && formData.solicitante && formData.endDate >= formData.startDate);
  }, [formData.title, formData.startDate, formData.endDate, formData.solicitante]);

  const step2Valid = useMemo(() => {
    return formData.totalImpactados > 0;
  }, [formData.totalImpactados]);

  const step3Valid = useMemo(() => {
    return formData.questions.length > 0;
  }, [formData.questions]);

  const stepValidations = [step1Valid, step2Valid, step3Valid, step1Valid && step3Valid];

  const canGoNext = stepValidations[currentStep - 1];

  // A step is "completed" only if it's valid AND has been visited
  const completedSteps = useMemo(() => {
    const completed: number[] = [];
    if (step1Valid && visitedSteps.includes(1)) completed.push(1);
    if (step2Valid && visitedSteps.includes(2)) completed.push(2);
    if (step3Valid && visitedSteps.includes(3)) completed.push(3);
    if (step1Valid && step2Valid && step3Valid && visitedSteps.includes(4)) completed.push(4);
    return completed;
  }, [step1Valid, step2Valid, step3Valid, visitedSteps]);

  // Determine which steps are accessible (sequential: can only go to step N if step N-1 is valid)
  const isStepAccessible = useCallback((stepId: number): boolean => {
    if (stepId === 1) return true;
    // Can access step N if step N-1 is valid and visited
    const prevStepValid = stepValidations[stepId - 2];
    return prevStepValid && visitedSteps.includes(stepId - 1);
  }, [stepValidations, visitedSteps]);

  const handleStepClick = useCallback((stepId: number) => {
    if (isStepAccessible(stepId)) {
      setCurrentStep(stepId);
      setVisitedSteps(prev => prev.includes(stepId) ? prev : [...prev, stepId]);
    }
  }, [isStepAccessible]);

  const handleNext = useCallback(() => {
    if (currentStep < 4 && canGoNext) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setVisitedSteps(prev => prev.includes(nextStep) ? prev : [...prev, nextStep]);
    }
  }, [currentStep, canGoNext]);

  const canActivate = step1Valid && step2Valid && step3Valid;
  const progressPct = Math.round((completedSteps.length / 4) * 100);

  const handleSaveDraft = () => {
    const saved: Campaign = {
      id: campaign?.id || `c${Date.now()}`,
      ...formData,
      status: 'rascunho',
      stepsCompleted: completedSteps,
    };
    onSave(saved);
    toast({ title: 'Rascunho salvo', description: 'Campanha salva como rascunho.' });
  };

  const handleActivate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(formData.startDate + 'T00:00:00');
    
    let newStatus: CampaignStatus;
    if (startDate <= today) {
      newStatus = 'ativa';
    } else {
      newStatus = 'nova';
    }

    const saved: Campaign = {
      id: isDuplicate ? `c${Date.now()}` : (campaign?.id || `c${Date.now()}`),
      ...formData,
      status: newStatus,
      ativadoPor: 'Gestor Principal',
      dataAtivacao: today.toISOString().split('T')[0],
      stepsCompleted: completedSteps,
    };
    onSave(saved);
    toast({
      title: newStatus === 'ativa' ? 'Campanha ativada' : 'Campanha agendada',
      description: newStatus === 'ativa'
        ? `"${saved.title}" está ativa agora.`
        : `"${saved.title}" será ativada em ${formatDateBR(saved.startDate)}.`
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-primaryBackground">
      <div className="relative w-full h-full max-w-5xl mx-auto flex flex-col flex-1 bg-surface-elevated border-x border-border overflow-hidden">
        {/* Header */}
        <div className="border-b border-border px-6 pt-4 pb-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <ChevronLeft size={14} /> Voltar
              </button>
              <h1 className="page-title">
                {isNew ? 'Nova Campanha' : isDuplicate ? 'Duplicar Campanha' : 'Editar Campanha'}
              </h1>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <span className="font-medium">{completedSteps.length}/4 etapas</span>
              <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${progressPct}%`,
                    background: progressPct === 100
                      ? 'hsl(var(--success))'
                      : 'hsl(var(--primary))'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Modern Step Indicator */}
          <div className="flex items-stretch gap-0 -mx-6 px-6 pb-0">
            {STEPS.map((step, i) => {
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = currentStep === step.id;
              const isPast = completedSteps.includes(step.id) && !isCurrent;
              const Icon = step.icon;

              return (
                <div key={step.id} className="flex items-stretch flex-1 relative">
                  <button
                    onClick={() => handleStepClick(step.id)}
                    disabled={!isStepAccessible(step.id)}
                    className={cn(
                      'flex items-center gap-2.5 w-full px-3 py-3 text-left transition-all relative group',
                      !isStepAccessible(step.id) && 'opacity-40 cursor-not-allowed',
                    )}
                  >
                    {/* Step circle indicator */}
                    <div className={cn(
                      'relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 shrink-0',
                      isCurrent
                        ? 'border-primary bg-primary text-primary-foreground shadow-[0_0_12px_hsl(var(--primary)/0.4)]'
                        : isCompleted
                        ? 'border-success bg-success text-success-foreground'
                        : 'border-border bg-surface text-muted-foreground group-hover:border-muted-foreground'
                    )}>
                      {isCompleted && !isCurrent ? (
                        <Check size={14} strokeWidth={3} />
                      ) : (
                        <span className="text-[11px] font-bold">{step.id}</span>
                      )}
                    </div>

                    {/* Step label */}
                    <div className="min-w-0 hidden sm:block">
                      <p className={cn(
                        'text-[11px] font-semibold truncate transition-colors',
                        isCurrent ? 'text-primary' : isCompleted ? 'text-success' : 'text-muted-foreground group-hover:text-foreground'
                      )}>
                        {step.label}
                      </p>
                      <p className="text-[9px] text-muted-foreground truncate">{step.description}</p>
                    </div>
                  </button>

                  {/* Connector line */}
                  {i < STEPS.length - 1 && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-6 flex items-center z-10">
                      <div className={cn(
                        'w-6 h-0.5 -ml-3 rounded-full transition-all duration-300',
                        isCompleted ? 'bg-success' : 'bg-border'
                      )} />
                    </div>
                  )}

                  {/* Active indicator bar */}
                  {isCurrent && (
                    <div className="absolute bottom-0 left-3 right-3 h-[2px] rounded-t-full bg-primary" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar nav */}
          <nav className="w-56 shrink-0 border-r border-border p-3 space-y-1 hidden md:block overflow-y-auto">
            {STEPS.map(step => {
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = currentStep === step.id;
              const Icon = step.icon;
              const isPublicoAlvo = step.id === 2;
              return (
                <div key={step.id}>
                  <button
                    onClick={() => handleStepClick(step.id)}
                    disabled={!isStepAccessible(step.id)}
                    className={cn(
                      'flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-xs font-medium transition-colors',
                      !isStepAccessible(step.id) && 'opacity-40 cursor-not-allowed',
                      isCurrent ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-surface-overlay'
                    )}
                  >
                    <Icon size={14} />
                    {step.label}
                    {isCompleted && <Check size={12} className="ml-auto text-success" />}
                  </button>

                  {/* Collapsible filters under Público-Alvo, only when on step 2 */}
                  {isPublicoAlvo && currentStep === 2 && (
                    <div className="mt-1 ml-2 space-y-1">
                      {FILTER_CATEGORIES.map(cat => {
                        const isExpanded = expandedCategories.includes(cat.key);
                        const selectedCount = (selectedFilters[cat.key] || []).length;
                        return (
                          <div key={cat.key} className="border border-border rounded-lg overflow-hidden">
                            <button
                              onClick={() => toggleCategory(cat.key)}
                              className="flex items-center justify-between w-full px-2.5 py-1.5 text-[11px] font-medium text-foreground hover:bg-surface-overlay transition-colors"
                            >
                              <span className="flex items-center gap-1.5">
                                {isExpanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                                {cat.label}
                              </span>
                              {selectedCount > 0 && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">{selectedCount}</span>
                              )}
                            </button>
                            {isExpanded && (
                              <div className="px-1.5 pb-1.5 space-y-0.5">
                                {cat.values.map(val => {
                                  const isSelected = (selectedFilters[cat.key] || []).includes(val);
                                  const count = FULL_AUDIENCE.filter(person => {
                                    const row = person as Record<string, string | undefined>;
                                    return row[cat.key] === val;
                                  }).length;
                                  return (
                                    <label key={val} className="flex items-center gap-1.5 px-1.5 py-1 rounded-md hover:bg-surface-overlay cursor-pointer text-[10px] text-foreground">
                                      <input type="checkbox" checked={isSelected} onChange={() => toggleFilter(cat.key, val)} className="sr-only" />
                                      <span className={cn(
                                        'w-3 h-3 rounded border flex items-center justify-center text-[8px]',
                                        isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-border'
                                      )}>
                                        {isSelected && '✓'}
                                      </span>
                                      <span className="flex-1 truncate">{val}</span>
                                      <span className="text-muted-foreground text-[9px]">({count})</span>
                                    </label>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Step content */}
          <div className="flex-1 overflow-y-auto p-6">
            {currentStep === 1 && (
              <StepDadosBasicos data={formData} onChange={updateForm} />
            )}
            {currentStep === 2 && (
              <StepPublicoAlvo data={formData} onChange={updateForm} selectedFilters={selectedFilters} onToggleFilter={toggleFilter} />
            )}
            {currentStep === 3 && (
              <StepPerguntas data={formData} onChange={updateForm} />
            )}
            {currentStep === 4 && (
              <StepVisualizarAtivar data={formData} onActivate={handleActivate} canActivate={canActivate} onChange={updateForm} />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-surface">
          <button
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground rounded-pillToken hover:bg-surface-overlay transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={14} /> Voltar
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveDraft}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium border border-border text-foreground rounded-pillToken hover:bg-surface-overlay transition-colors"
            >
              <Save size={13} /> Salvar Rascunho
            </button>

            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                disabled={!canGoNext}
                className={cn(
                  'flex items-center gap-1.5 px-5 py-2 text-xs font-medium rounded-pillToken transition-all duration-200',
                  canGoNext
                    ? 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-[0_2px_8px_hsl(var(--primary)/0.3)]'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                )}
              >
                Próximo <ChevronRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleActivate}
                disabled={!canActivate}
                className={cn(
                  'flex items-center gap-1.5 px-5 py-2 text-xs font-medium rounded-pillToken transition-all duration-200',
                  canActivate
                    ? 'bg-success text-success-foreground hover:opacity-90 shadow-[0_2px_8px_hsl(var(--success)/0.3)]'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                )}
              >
                <Zap size={13} /> Ativar Campanha
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDateBR(d: string) {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}
