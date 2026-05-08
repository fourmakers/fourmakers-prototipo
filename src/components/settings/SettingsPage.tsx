import { useState } from 'react';
import {
  BookOpen, BarChart3, Zap, Shield, Bell, Repeat, GitCompare, Eye,
  Gamepad2, ChevronRight, ChevronDown, Save, RotateCcw, X, Plus, Pencil, Check,
  GripVertical, Trash2, Minus, AlignLeft, CircleDot, CheckSquare, List, Upload,
  MoreHorizontal, Star, LayoutGrid, Grid3X3, Calendar, Clock, type LucideIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { DataTable, type Column } from '@/components/common';
import { useToast } from '@/hooks/use-toast';
import { useExportSettings } from '@/hooks/use-export-settings';
import { cn } from '@/lib/utils';

// ── Tipos de resposta (Biblioteca) ───────────────────────────
const RESPONSE_TYPES: { group: string; items: { value: string; label: string; icon: LucideIcon }[] }[] = [
  { group: 'Texto', items: [{ value: 'resposta-curta', label: 'Resposta curta', icon: Minus }, { value: 'paragrafo', label: 'Parágrafo', icon: AlignLeft }] },
  { group: 'Escolha', items: [{ value: 'multipla-escolha', label: 'Múltipla escolha', icon: CircleDot }, { value: 'caixa-selecao', label: 'Caixa de seleção', icon: CheckSquare }, { value: 'lista-suspensa', label: 'Lista Suspensa', icon: List }] },
  { group: 'Arquivo', items: [{ value: 'upload-arquivo', label: 'Upload de arquivo', icon: Upload }] },
  { group: 'Escala', items: [{ value: 'escala-linear', label: 'Escala Linear', icon: MoreHorizontal }, { value: 'classificacao', label: 'Classificação', icon: Star }, { value: 'grade-multipla', label: 'Grade de Múltiplas escolhas', icon: LayoutGrid }, { value: 'grade-caixa', label: 'Grade de caixa de seleção', icon: Grid3X3 }] },
  { group: 'Data/Hora', items: [{ value: 'data', label: 'Data', icon: Calendar }, { value: 'horario', label: 'Horário', icon: Clock }] },
];

const CHOICE_TYPES = ['multipla-escolha', 'caixa-selecao', 'lista-suspensa', 'grade-multipla', 'grade-caixa'];

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Diversidade': ['diversidade', 'inclusão', 'gênero', 'etnia', 'raça', 'acessibilidade', 'lgbtq', 'equidade', 'representatividade'],
  'Clima organizacional': ['clima', 'ambiente', 'satisfação', 'bem-estar', 'felicidade', 'motivação', 'estresse', 'saúde mental'],
  'Competências técnicas': ['competência', 'técnica', 'habilidade', 'skill', 'conhecimento', 'treinamento', 'capacitação', 'ferramenta'],
  'Engajamento': ['engajamento', 'comprometimento', 'dedicação', 'participação', 'envolvimento', 'produtividade', 'desempenho'],
  'Cultura organizacional': ['cultura', 'valores', 'missão', 'visão', 'propósito', 'identidade', 'princípio', 'ética'],
};

function classifyQuestion(text: string, categories: string[]): string | null {
  const lower = text.toLowerCase();
  for (const cat of categories) {
    const keywords = CATEGORY_KEYWORDS[cat];
    if (keywords && keywords.some((kw) => lower.includes(kw))) return cat;
  }
  return null;
}

interface Question {
  id: string;
  text: string;
  responseType: string;
  options?: string[];
}

const DEFAULT_QUESTIONS: Record<string, Question[]> = {
  'Diversidade': [
    { id: '1', text: 'Você sente que a empresa promove um ambiente diverso e inclusivo?', responseType: 'escala-linear' },
    { id: '2', text: 'Quais iniciativas de diversidade você gostaria de ver?', responseType: 'paragrafo' },
  ],
  'Clima organizacional': [
    { id: '3', text: 'Como você avalia o clima no seu time?', responseType: 'escala-linear' },
    { id: '4', text: 'Você se sente confortável para expressar opiniões?', responseType: 'multipla-escolha', options: ['Sim, sempre', 'Na maioria das vezes', 'Raramente', 'Nunca'] },
  ],
  'Competências técnicas': [
    { id: '5', text: 'Quais treinamentos você gostaria de receber?', responseType: 'caixa-selecao', options: ['Liderança', 'Técnico', 'Comunicação', 'Gestão de tempo'] },
  ],
  'Engajamento': [
    { id: '6', text: 'Em uma escala de 0 a 10, o quanto você recomendaria a empresa?', responseType: 'escala-linear' },
  ],
  'Cultura organizacional': [
    { id: '7', text: 'Você conhece a missão e os valores da empresa?', responseType: 'multipla-escolha', options: ['Sim', 'Parcialmente', 'Não'] },
  ],
};

function getResponseTypeLabel(value: string): string {
  for (const g of RESPONSE_TYPES) {
    for (const item of g.items) {
      if (item.value === value) return item.label;
    }
  }
  return value;
}

// ── Menu Categories ──────────────────────────────────────────
type Category =
  | 'biblioteca' | 'resultados' | 'automacao' | 'governanca';

const MENU_ITEMS: { key: Category; label: string; icon: React.ElementType }[] = [
  { key: 'biblioteca', label: 'Biblioteca de Perguntas', icon: BookOpen },
  { key: 'resultados', label: 'Resultados e Analytics', icon: BarChart3 },
  { key: 'automacao', label: 'Automação', icon: Zap },
  { key: 'governanca', label: 'Governança', icon: Shield },
];

// ── Reusable field wrapper ──────────────────────────────────
function Field({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-border bg-surface-elevated p-4">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SwitchField({ label, desc, checked, onChange }: { label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <Field label={label} desc={desc}>
      <Switch checked={checked} onCheckedChange={onChange} />
    </Field>
  );
}

function SectionCard({ title, desc, icon: Icon, children }: { title: string; desc?: string; icon?: React.ElementType; children: React.ReactNode }) {
  return (
    <Card className="bg-card border-border shadow-[var(--shadow-soft)]">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Icon size={16} className="text-primary" />
            </div>
          )}
          <div>
            <CardTitle className="text-base text-foreground">{title}</CardTitle>
            {desc && <CardDescription className="text-xs">{desc}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">{children}</CardContent>
    </Card>
  );
}

// ── State types ─────────────────────────────────────────────
interface SettingsState {
  // Gerais
  companyName: string;
  totalEmployees: string;
  units: string[];
  language: string;
  archiveDays: string;
  // Campanhas
  minDuration: string;
  maxDuration: string;
  editActive: boolean;
  cancelActive: boolean;
  duplicateCampaign: boolean;
  // Público-Alvo
  minEmployeesPerCampaign: string;
  filterLogicDefault: string;
  allowManualLogic: boolean;
  // Score Representatividade
  highRepAbove: string;
  medRepMin: string;
  medRepMax: string;
  lowRepBelow: string;
  // Viés
  biasMinEmployees: string;
  biasAlertMessage: string;
  // Biblioteca
  questionCategories: string[];
  // Resultados
  exportCsv: boolean;
  exportPdf: boolean;
  crossFilters: boolean;
  autoInsights: boolean;
  // Insights params
  minResponsesInsights: string;
  insightTypes: string[];
  // Automação - Lembretes
  reminderAfterDays: string;
  maxReminders: string;
  reminderMessage: string;
  // Recorrentes
  allowRecurring: boolean;
  recurrenceTypes: string[];
  allowCustomRecurrence: boolean;
  // Histórico
  allowComparison: boolean;
  maxComparisons: string;
  // Governança
  profiles: { name: string; permissions: string[] }[];
  // Integrações
  intHR: boolean;
  intAD: boolean;
  intGoogle: boolean;
  intMS365: boolean;
  intPowerBI: boolean;
  intLooker: boolean;
  intTableau: boolean;
  // Anonimato
  minResponsesAnonymity: string;
  // Gamificação
  gamifProgress: boolean;
  gamifRanking: boolean;
}

const DEFAULT_SETTINGS: SettingsState = {
  companyName: 'Fourmakers',
  totalEmployees: '1.250',
  units: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba'],
  language: 'pt-BR',
  archiveDays: '60',
  minDuration: '3',
  maxDuration: '60',
  editActive: false,
  cancelActive: true,
  duplicateCampaign: true,
  minEmployeesPerCampaign: '10',
  filterLogicDefault: 'AND',
  allowManualLogic: true,
  highRepAbove: '40',
  medRepMin: '15',
  medRepMax: '40',
  lowRepBelow: '15',
  biasMinEmployees: '10',
  biasAlertMessage: 'Atenção: o público selecionado é muito pequeno. Isso pode comprometer anonimato e qualidade da análise.',
  questionCategories: ['Diversidade', 'Clima organizacional', 'Competências técnicas', 'Engajamento', 'Cultura organizacional'],
  exportCsv: true,
  exportPdf: true,
  crossFilters: true,
  autoInsights: true,
  minResponsesInsights: '20',
  insightTypes: ['Distribuição demográfica', 'Diferenças entre unidades', 'Diferenças por senioridade', 'Diferenças por tempo de empresa'],
  reminderAfterDays: '3',
  maxReminders: '2',
  reminderMessage: 'Olá! Sua campanha ainda está aguardando respostas. Participe e contribua com informações importantes.',
  allowRecurring: false,
  recurrenceTypes: ['Trimestral', 'Semestral'],
  allowCustomRecurrence: false,
  allowComparison: true,
  maxComparisons: '5',
  profiles: [
    { name: 'Administrador', permissions: ['Criar campanha', 'Editar campanha', 'Cancelar campanha', 'Visualizar resultados', 'Exportar dados'] },
    { name: 'RH', permissions: ['Criar campanha', 'Editar campanha', 'Visualizar resultados', 'Exportar dados'] },
    { name: 'Gestor', permissions: ['Visualizar resultados'] },
    { name: 'Analista', permissions: ['Visualizar resultados', 'Exportar dados'] },
  ],
  intHR: false,
  intAD: false,
  intGoogle: false,
  intMS365: false,
  intPowerBI: false,
  intLooker: false,
  intTableau: false,
  minResponsesAnonymity: '5',
  gamifProgress: false,
  gamifRanking: false,
};

const ALL_PERMISSIONS = ['Criar campanha', 'Editar campanha', 'Cancelar campanha', 'Visualizar resultados', 'Exportar dados'];

// ── Component ───────────────────────────────────────────────
export function SettingsPage() {
  const { toast } = useToast();
  const exportSettings = useExportSettings();
  const [active, setActive] = useState<Category>('biblioteca');
  const [s, setS] = useState<SettingsState>(() => ({
    ...DEFAULT_SETTINGS,
    exportCsv: exportSettings.exportCsv,
    exportPdf: exportSettings.exportPdf,
  }));
  const [newCategory, setNewCategory] = useState('');
  const [questions, setQuestions] = useState<Record<string, Question[]>>({ ...DEFAULT_QUESTIONS });
  const [expandedCats, setExpandedCats] = useState<string[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionType, setNewQuestionType] = useState('');
  const [newQuestionOptions, setNewQuestionOptions] = useState<string[]>([]);
  const [newOptionText, setNewOptionText] = useState('');
  const [draggedQuestion, setDraggedQuestion] = useState<{ questionId: string; fromCat: string } | null>(null);

  const set = <K extends keyof SettingsState>(key: K, val: SettingsState[K]) =>
    setS((prev) => ({ ...prev, [key]: val }));

  const toggleArrayItem = (key: 'insightTypes' | 'recurrenceTypes' | 'questionCategories', item: string) => {
    setS((prev) => {
      const arr = prev[key] as string[];
      return { ...prev, [key]: arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item] };
    });
  };

  const togglePermission = (profileIdx: number, perm: string) => {
    setS((prev) => {
      const profiles = [...prev.profiles];
      const p = { ...profiles[profileIdx] };
      p.permissions = p.permissions.includes(perm) ? p.permissions.filter((x) => x !== perm) : [...p.permissions, perm];
      profiles[profileIdx] = p;
      return { ...prev, profiles };
    });
  };

  const toggleExpanded = (cat: string) => {
    setExpandedCats((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
  };

  const addQuestion = (category?: string) => {
    if (!newQuestionText.trim() || !newQuestionType) return;
    const targetCat = category || classifyQuestion(newQuestionText, s.questionCategories) || s.questionCategories[0];
    const newQ: Question = {
      id: Date.now().toString(),
      text: newQuestionText.trim(),
      responseType: newQuestionType,
      options: CHOICE_TYPES.includes(newQuestionType) && newQuestionOptions.length > 0 ? [...newQuestionOptions] : undefined,
    };
    setQuestions((prev) => ({
      ...prev,
      [targetCat]: [...(prev[targetCat] || []), newQ],
    }));
    if (!expandedCats.includes(targetCat)) setExpandedCats((prev) => [...prev, targetCat]);
    setNewQuestionText('');
    setNewQuestionType('');
    setNewQuestionOptions([]);
    setNewOptionText('');
    const classified = classifyQuestion(newQuestionText, s.questionCategories);
    toast({
      title: 'Pergunta adicionada',
      description: classified ? `Classificada automaticamente em "${targetCat}"` : category ? `Adicionada em "${targetCat}"` : `Adicionada em "${targetCat}" (categoria padrão)`,
    });
  };

  const deleteQuestion = (cat: string, qId: string) => {
    setQuestions((prev) => ({
      ...prev,
      [cat]: (prev[cat] || []).filter((q) => q.id !== qId),
    }));
  };

  const saveEditQuestion = (cat: string, qId: string) => {
    if (!editText.trim()) return;
    setQuestions((prev) => ({
      ...prev,
      [cat]: (prev[cat] || []).map((q) => (q.id === qId ? { ...q, text: editText.trim() } : q)),
    }));
    setEditingQuestion(null);
    setEditText('');
  };

  const handleDragStart = (questionId: string, fromCat: string) => {
    setDraggedQuestion({ questionId, fromCat });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('ring-2', 'ring-primary/50');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('ring-2', 'ring-primary/50');
  };

  const handleDrop = (e: React.DragEvent, toCat: string) => {
    e.preventDefault();
    e.currentTarget.classList.remove('ring-2', 'ring-primary/50');
    if (!draggedQuestion || draggedQuestion.fromCat === toCat) return;
    const { questionId, fromCat } = draggedQuestion;
    const question = (questions[fromCat] || []).find((q) => q.id === questionId);
    if (!question) return;
    setQuestions((prev) => ({
      ...prev,
      [fromCat]: (prev[fromCat] || []).filter((q) => q.id !== questionId),
      [toCat]: [...(prev[toCat] || []), question],
    }));
    if (!expandedCats.includes(toCat)) setExpandedCats((prev) => [...prev, toCat]);
    setDraggedQuestion(null);
    toast({ title: 'Pergunta movida', description: `Movida para "${toCat}"` });
  };

  const addCategory = () => {
    if (!newCategory.trim() || s.questionCategories.includes(newCategory.trim())) return;
    const cat = newCategory.trim();
    set('questionCategories', [...s.questionCategories, cat]);
    setQuestions((prev) => ({ ...prev, [cat]: [] }));
    setNewCategory('');
    setExpandedCats((prev) => [...prev, cat]);
  };

  const deleteCategory = (cat: string) => {
    set('questionCategories', s.questionCategories.filter((c) => c !== cat));
    setQuestions((prev) => {
      const copy = { ...prev };
      delete copy[cat];
      return copy;
    });
  };

  const handleSave = () => {
    toast({ title: 'Configurações salvas', description: 'Todas as configurações foram atualizadas com sucesso.' });
  };

  const handleRestore = () => {
    setS({ ...DEFAULT_SETTINGS });
    exportSettings.setExportCsv(DEFAULT_SETTINGS.exportCsv);
    exportSettings.setExportPdf(DEFAULT_SETTINGS.exportPdf);
    setQuestions({ ...DEFAULT_QUESTIONS });
    toast({ title: 'Padrão restaurado', description: 'Todas as configurações foram restauradas ao padrão.' });
  };

  // ── Section renderers ────────────────────────────────────
  const renderBiblioteca = () => (
    <div className="space-y-4">
      <SectionCard title="Categorias e Perguntas" icon={BookOpen} desc="Gerencie categorias e suas perguntas. Arraste perguntas entre categorias.">
        <div className="space-y-2">
          {s.questionCategories.map((cat) => {
            const catQuestions = questions[cat] || [];
            const isExpanded = expandedCats.includes(cat);
            return (
              <div
                key={cat}
                className="rounded-xl border border-border bg-muted/30 transition-all"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, cat)}
              >
                <button
                  type="button"
                  onClick={() => toggleExpanded(cat)}
                  className="flex items-center justify-between w-full px-4 py-3 hover:bg-muted/40 transition-colors rounded-xl text-left"
                >
                  <div className="flex items-center gap-2.5">
                    {isExpanded ? <ChevronDown size={15} className="text-primary" /> : <ChevronRight size={15} className="text-muted-foreground" />}
                    <span className="text-sm font-semibold text-foreground">{cat}</span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {catQuestions.length} {catQuestions.length === 1 ? 'pergunta' : 'perguntas'}
                    </Badge>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); deleteCategory(cat); }}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                  >
                    <X size={13} />
                  </button>
                </button>
                {isExpanded && (
                  <div className="px-4 pb-3 space-y-1.5 border-t border-border/50">
                    {catQuestions.length === 0 && (
                      <p className="text-xs text-muted-foreground italic py-3 text-center">
                        Nenhuma pergunta nesta categoria. Arraste ou adicione uma nova.
                      </p>
                    )}
                    {catQuestions.map((q) => (
                      <div
                        key={q.id}
                        draggable
                        onDragStart={() => handleDragStart(q.id, cat)}
                        className="flex items-start gap-2 rounded-lg border border-border bg-surface-elevated p-3 cursor-grab hover:shadow-[var(--shadow-soft)] transition-shadow group"
                      >
                        <GripVertical size={14} className="text-muted-foreground mt-0.5 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />
                        <div className="flex-1 min-w-0">
                          {editingQuestion === q.id ? (
                            <div className="flex gap-2">
                              <Input
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="text-sm bg-input border-border flex-1"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && saveEditQuestion(cat, q.id)}
                              />
                              <Button type="button" size="sm" variant="ghost" onClick={() => saveEditQuestion(cat, q.id)}>
                                <Check size={13} />
                              </Button>
                              <Button type="button" size="sm" variant="ghost" onClick={() => setEditingQuestion(null)}>
                                <X size={13} />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <p className="text-sm text-foreground leading-snug">{q.text}</p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-muted-foreground border-border">
                                  {getResponseTypeLabel(q.responseType)}
                                </Badge>
                                {q.options && q.options.length > 0 && (
                                  <span className="text-[10px] text-muted-foreground">{q.options.length} opções</span>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                        {editingQuestion !== q.id && (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <button
                              type="button"
                              onClick={() => { setEditingQuestion(q.id); setEditText(q.text); }}
                              className="p-1 rounded hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Pencil size={12} />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteQuestion(cat, q.id)}
                              className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div className="flex gap-2 mt-3">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Nova categoria..."
              className="bg-input border-border text-sm"
              onKeyDown={(e) => e.key === 'Enter' && addCategory()}
            />
            <Button type="button" size="sm" variant="secondary" onClick={addCategory}>
              Adicionar
            </Button>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Adicionar Pergunta" icon={Plus} desc="A pergunta será classificada automaticamente na categoria mais adequada, ou arraste-a manualmente.">
        <div className="space-y-3">
          <div className="flex gap-3 items-center flex-wrap">
            <div className="min-w-[200px] flex-1">
              <Input
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="Nova pergunta..."
                className="bg-input border-border text-sm w-full"
              />
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs text-muted-foreground whitespace-nowrap">Tipo de resposta</span>
              <Select value={newQuestionType} onValueChange={setNewQuestionType}>
                <SelectTrigger className="bg-input border-border text-sm w-[180px]">
                  <SelectValue placeholder="Selecionar tipo..." />
                </SelectTrigger>
                <SelectContent>
                  {RESPONSE_TYPES.map((group, gi) => (
                    <SelectGroup key={group.group}>
                      <SelectLabel className="text-xs text-muted-foreground">{group.group}</SelectLabel>
                      {group.items.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          <span className="flex items-center gap-2">
                            <item.icon className="h-4 w-4 text-muted-foreground" />
                            {item.label}
                          </span>
                        </SelectItem>
                      ))}
                      {gi < RESPONSE_TYPES.length - 1 && <SelectSeparator />}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {CHOICE_TYPES.includes(newQuestionType) && (
            <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Opções de resposta</p>
              {newQuestionOptions.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-5 text-right">{i + 1}.</span>
                  <span className="text-sm text-foreground flex-1">{opt}</span>
                  <button
                    type="button"
                    onClick={() => setNewQuestionOptions((prev) => prev.filter((_, idx) => idx !== i))}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  value={newOptionText}
                  onChange={(e) => setNewOptionText(e.target.value)}
                  placeholder="Opção de resposta"
                  className="bg-input border-border text-sm flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newOptionText.trim()) {
                      setNewQuestionOptions((prev) => [...prev, newOptionText.trim()]);
                      setNewOptionText('');
                    }
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    if (newOptionText.trim()) {
                      setNewQuestionOptions((prev) => [...prev, newOptionText.trim()]);
                      setNewOptionText('');
                    }
                  }}
                >
                  <Plus size={13} className="mr-1" />
                  Adicionar opção
                </Button>
              </div>
            </div>
          )}
          {newQuestionText.trim() && (() => {
            const detected = classifyQuestion(newQuestionText, s.questionCategories);
            return detected ? (
              <p className="text-xs text-primary flex items-center gap-1.5">
                <Zap size={11} />
                Será classificada automaticamente em: <strong>{detected}</strong>
              </p>
            ) : (
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                Será adicionada à primeira categoria. Arraste para reposicionar.
              </p>
            );
          })()}
          <Button type="button" onClick={() => addQuestion()} disabled={!newQuestionText.trim() || !newQuestionType} className="w-full">
            <Plus size={14} className="mr-1.5" />
            Adicionar Pergunta
          </Button>
        </div>
      </SectionCard>
    </div>
  );

  const renderResultados = () => (
    <div className="space-y-4">
      <SectionCard title="Exportação e Visualização" icon={BarChart3} desc="Defina como os resultados podem ser utilizados">
        <SwitchField label="Permitir exportação CSV" checked={s.exportCsv} onChange={(v) => { set('exportCsv', v); exportSettings.setExportCsv(v); }} />
        <SwitchField label="Permitir exportação PDF" checked={s.exportPdf} onChange={(v) => { set('exportPdf', v); exportSettings.setExportPdf(v); }} />
        <SwitchField label="Permitir cruzamento de filtros nos resultados" checked={s.crossFilters} onChange={(v) => set('crossFilters', v)} />
        <SwitchField label="Mostrar insights automáticos" checked={s.autoInsights} onChange={(v) => set('autoInsights', v)} />
      </SectionCard>

      {s.autoInsights && (
        <SectionCard title="Parâmetros de Insights Automáticos" icon={Zap} desc="Controle o motor de análise inteligente">
          <Field label="Quantidade mínima de respostas para gerar insights">
            <Input type="number" min={1} value={s.minResponsesInsights} onChange={e => set('minResponsesInsights', e.target.value)} className="w-24 bg-input border-border" />
          </Field>
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Tipos de análise permitidos</p>
            {['Distribuição demográfica', 'Diferenças entre unidades', 'Diferenças por senioridade', 'Diferenças por tempo de empresa'].map(type => (
              <label key={type} className="flex items-center gap-3 rounded-lg border border-border bg-surface-elevated p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                <Checkbox checked={s.insightTypes.includes(type)} onCheckedChange={() => toggleArrayItem('insightTypes', type)} />
                <span className="text-sm text-foreground">{type}</span>
              </label>
            ))}
          </div>
        </SectionCard>
      )}

      <SectionCard title="Configuração de Anonimato" icon={Eye} desc="Garantia de privacidade dos respondentes">
        <Field label="Mínimo de respostas para exibir gráfico" desc="Resultados só aparecem quando atingido o mínimo">
          <Input type="number" min={1} value={s.minResponsesAnonymity} onChange={e => set('minResponsesAnonymity', e.target.value)} className="w-24 bg-input border-border" />
        </Field>
      </SectionCard>

      <SectionCard title="Histórico e Comparação" icon={GitCompare} desc="Análise histórica de campanhas">
        <SwitchField label="Permitir comparação entre campanhas" checked={s.allowComparison} onChange={v => set('allowComparison', v)} />
        {s.allowComparison && (
          <Field label="Quantidade máxima de campanhas comparáveis">
            <Input type="number" min={2} max={10} value={s.maxComparisons} onChange={e => set('maxComparisons', e.target.value)} className="w-24 bg-input border-border" />
          </Field>
        )}
      </SectionCard>
    </div>
  );

  const renderAutomacao = () => (
    <div className="space-y-4">
      <SectionCard title="Automação de Lembretes" icon={Bell} desc="Envio automático de lembretes para campanhas ativas">
        <Field label="Enviar lembrete após">
          <Select value={s.reminderAfterDays} onValueChange={v => set('reminderAfterDays', v)}>
            <SelectTrigger className="w-28 bg-input border-border"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 dias</SelectItem>
              <SelectItem value="7">7 dias</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Número máximo de lembretes">
          <Select value={s.maxReminders} onValueChange={v => set('maxReminders', v)}>
            <SelectTrigger className="w-20 bg-input border-border"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-foreground">Mensagem padrão do lembrete</p>
          <Textarea value={s.reminderMessage} onChange={e => set('reminderMessage', e.target.value)} rows={3} className="bg-input border-border text-sm" />
        </div>
      </SectionCard>

      <SectionCard title="Campanhas Recorrentes" icon={Repeat} desc="Criação automática de campanhas recorrentes">
        <SwitchField label="Permitir campanhas recorrentes" checked={s.allowRecurring} onChange={v => set('allowRecurring', v)} />
        {s.allowRecurring && (
          <>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Tipos de recorrência disponíveis</p>
              {['Mensal', 'Trimestral', 'Semestral', 'Anual'].map(type => (
                <label key={type} className="flex items-center gap-3 rounded-lg border border-border bg-surface-elevated p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                  <Checkbox checked={s.recurrenceTypes.includes(type)} onCheckedChange={() => toggleArrayItem('recurrenceTypes', type)} />
                  <span className="text-sm text-foreground">{type}</span>
                </label>
              ))}
            </div>
            <SwitchField label="Permitir personalização da recorrência pelo usuário" checked={s.allowCustomRecurrence} onChange={v => set('allowCustomRecurrence', v)} />
          </>
        )}
      </SectionCard>

      <SectionCard title="Gamificação" icon={Gamepad2} desc="Recursos de engajamento">
        <SwitchField label="Progresso de resposta por equipe" desc="Exibe barra de progresso por equipe" checked={s.gamifProgress} onChange={v => set('gamifProgress', v)} />
        <SwitchField label="Ranking de unidades" desc="Ranking com maior taxa de resposta" checked={s.gamifRanking} onChange={v => set('gamifRanking', v)} />
      </SectionCard>
    </div>
  );

  type ProfileRow = { name: string; permissions: string[]; _index: number };
  const governancaColumns: Column[] = [
    { id: 'perfil', label: 'Perfil', sortable: true },
    ...ALL_PERMISSIONS.map((p) => ({ id: p, label: p, sortable: false as const, align: 'center' as const })),
  ];
  const renderGovernanca = () => (
    <div className="space-y-4">
      <SectionCard title="Perfis e Permissões" icon={Shield} desc="Configure os níveis de acesso ao sistema">
        <Card className="rounded-xl">
          <CardContent className="p-6">
            <DataTable<ProfileRow>
              columns={governancaColumns}
              data={s.profiles.map((p, i) => ({ ...p, _index: i }))}
              keyExtractor={(row) => row.name}
              renderCell={(profile, columnId) => {
                if (columnId === 'perfil') return <span className="font-medium text-foreground">{profile.name}</span>;
                return (
                  <div className="flex justify-center">
                    <Checkbox
                      checked={profile.permissions.includes(columnId)}
                      onCheckedChange={() => togglePermission(profile._index, columnId)}
                      disabled={profile.name === 'Administrador'}
                    />
                  </div>
                );
              }}
              emptyMessage="Nenhum perfil"
            />
          </CardContent>
        </Card>
        <p className="text-xs text-muted-foreground italic mt-2">
          O perfil Administrador possui todas as permissões e não pode ser alterado.
        </p>
      </SectionCard>
    </div>
  );


  const RENDERERS: Record<Category, () => JSX.Element> = {
    'biblioteca': renderBiblioteca,
    'resultados': renderResultados,
    'automacao': renderAutomacao,
    'governanca': renderGovernanca,
  };

  return (
    <div className="flex flex-col gap-4 pb-20">
      {/* Título da página (padrão fourmakers-v2) */}
      <div>
        <h1 className="page-title">Configurações / Parâmetros</h1>
        <p className="page-subtitle mt-0.5">
          Centralize todas as regras de funcionamento do sistema.
        </p>
      </div>

      <div className="flex gap-5 min-h-[600px]">
        {/* Sidebar menu */}
        <nav className="w-56 shrink-0 rounded-xl border border-border bg-card p-2 space-y-0.5 shadow-[var(--shadow-soft)] self-start sticky top-4">
          {MENU_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={cn(
                'flex items-center gap-2.5 w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 text-left',
                active === key
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <Icon size={15} className="shrink-0" />
              <span className="truncate">{label}</span>
              {active === key && <ChevronRight size={13} className="ml-auto shrink-0 text-primary" />}
            </button>
          ))}
        </nav>

        {/* Content area */}
        <div className="flex-1 min-w-0">
          {RENDERERS[active]()}
        </div>
      </div>

      {/* Footer fixo */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-sm px-6 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-end gap-3">
          <Button variant="ghost" onClick={() => setActive('biblioteca')} className="text-muted-foreground">
            Cancelar
          </Button>
          <Button variant="outline" onClick={handleRestore} className="border-border">
            <RotateCcw size={14} className="mr-1.5" />
            Restaurar Padrão
          </Button>
          <Button onClick={handleSave}>
            <Save size={14} className="mr-1.5" />
            Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  );
}
