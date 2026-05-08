import { useState } from 'react';
import { Plus, Trash2, GripVertical, Copy, ToggleLeft, ToggleRight, BookOpen, Search, X, Pencil, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Campaign, CampaignQuestion, QuestionType, QUESTION_TYPE_OPTIONS, QUESTION_LIBRARY, QUESTION_CATEGORIES, QuestionCategory } from '../campaignData';

interface Props {
  data: Omit<Campaign, 'id'>;
  onChange: (updates: Partial<Omit<Campaign, 'id'>>) => void;
}

export function StepPerguntas({ data, onChange }: Props) {
  const [newText, setNewText] = useState('');
  const [newType, setNewType] = useState<QuestionType>('unica-escolha');
  const [newOptions, setNewOptions] = useState<string[]>(['']);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [libSearch, setLibSearch] = useState('');
  const [libCategory, setLibCategory] = useState<QuestionCategory | ''>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editType, setEditType] = useState<QuestionType>('unica-escolha');
  const [editOptions, setEditOptions] = useState<string[]>([]);

  const startEditing = (q: CampaignQuestion) => {
    setEditingId(q.id);
    setEditText(q.text);
    setEditType(q.type);
    setEditOptions(q.options ? [...q.options] : []);
  };

  const saveEditing = () => {
    if (!editingId || !editText.trim()) return;
    onChange({
      questions: data.questions.map(q =>
        q.id === editingId
          ? { ...q, text: editText.trim(), type: editType, options: needsOptions(editType) ? editOptions.filter(o => o.trim()) : undefined }
          : q
      ),
    });
    setEditingId(null);
  };

  const cancelEditing = () => setEditingId(null);

  const addQuestion = () => {
    if (!newText.trim()) return;
    const q: CampaignQuestion = {
      id: `q${Date.now()}`,
      text: newText.trim(),
      type: newType,
      required: true,
      options: needsOptions(newType) ? newOptions.filter(o => o.trim()) : undefined,
    };
    onChange({ questions: [...data.questions, q] });
    setNewText('');
    setNewOptions(['']);
    setNewType('unica-escolha');
  };

  const removeQuestion = (id: string) => {
    onChange({ questions: data.questions.filter(q => q.id !== id) });
  };

  const cloneQuestion = (q: CampaignQuestion) => {
    const cloned: CampaignQuestion = { ...q, id: `q${Date.now()}`, text: `${q.text} (cópia)` };
    onChange({ questions: [...data.questions, cloned] });
  };

  const toggleRequired = (id: string) => {
    onChange({ questions: data.questions.map(q => q.id === id ? { ...q, required: !q.required } : q) });
  };

  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const items = [...data.questions];
    const [removed] = items.splice(dragIdx, 1);
    items.splice(idx, 0, removed);
    onChange({ questions: items });
    setDragIdx(idx);
  };
  const handleDragEnd = () => setDragIdx(null);

  const importFromLibrary = (libQ: typeof QUESTION_LIBRARY[0]) => {
    const q: CampaignQuestion = {
      id: `q${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      text: libQ.text,
      type: libQ.type,
      required: true,
      options: libQ.options,
    };
    onChange({ questions: [...data.questions, q] });
  };

  const filteredLibrary = QUESTION_LIBRARY.filter(q => {
    if (libCategory && q.category !== libCategory) return false;
    if (libSearch) {
      const s = libSearch.toLowerCase();
      return q.text.toLowerCase().includes(s);
    }
    return true;
  });

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Perguntas</h3>
        <button
          onClick={() => setShowLibrary(!showLibrary)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors',
            showLibrary
              ? 'bg-accent/10 text-accent border-accent/30'
              : 'border-border text-foreground hover:bg-surface-overlay'
          )}
        >
          <BookOpen size={13} /> {showLibrary ? 'Fechar Biblioteca' : 'Importar da Biblioteca'}
        </button>
      </div>

      {data.questions.length === 0 && !showLibrary && (
        <p className="text-xs text-warning">Adicione pelo menos 1 pergunta para poder ativar a campanha.</p>
      )}

      {/* Question Library Modal/Panel */}
      {showLibrary && (
        <div className="bg-surface-elevated border border-accent/20 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen size={14} className="text-accent" />
              <p className="text-xs font-semibold text-foreground">Biblioteca de Perguntas</p>
            </div>
            <button onClick={() => setShowLibrary(false)} className="text-muted-foreground hover:text-foreground">
              <X size={14} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={libSearch}
                onChange={e => setLibSearch(e.target.value)}
                placeholder="Buscar pergunta..."
                className="w-full pl-7 pr-3 py-1.5 text-xs bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <select
              value={libCategory}
              onChange={e => setLibCategory(e.target.value as QuestionCategory | '')}
              className="px-2 py-1.5 text-xs bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
            >
              <option value="">Todas categorias</option>
              {QUESTION_CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-1.5">
            {filteredLibrary.map(q => {
              const alreadyAdded = data.questions.some(dq => dq.text === q.text);
              return (
                <div key={q.id} className="flex items-center gap-2 p-2.5 bg-surface border border-border rounded-lg hover:border-primary/30 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground font-medium truncate">{q.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn('text-[9px] px-1.5 py-0.5 rounded-md font-medium', typeColor(q.type))}>
                        {QUESTION_TYPE_OPTIONS.find(o => o.value === q.type)?.label}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-accent/10 text-accent font-medium">
                        {QUESTION_CATEGORIES.find(c => c.value === q.category)?.label}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => importFromLibrary(q)}
                    disabled={alreadyAdded}
                    className={cn(
                      'px-2.5 py-1 text-[10px] font-medium rounded-md transition-colors',
                      alreadyAdded
                        ? 'bg-success/10 text-success cursor-not-allowed'
                        : 'bg-primary/10 text-primary hover:bg-primary/20'
                    )}
                  >
                    {alreadyAdded ? '✓ Adicionada' : '+ Inserir'}
                  </button>
                </div>
              );
            })}
            {filteredLibrary.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">Nenhuma pergunta encontrada</p>
            )}
          </div>
        </div>
      )}

      {/* Existing questions */}
      <div className="space-y-2">
        {data.questions.map((q, i) => (
          <div
            key={q.id}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={e => handleDragOver(e, i)}
            onDragEnd={handleDragEnd}
            className={cn(
              'flex items-start gap-2 bg-surface border border-border rounded-xl p-3 transition-all group',
              dragIdx === i ? 'opacity-50' : ''
            )}
          >
            <div className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground mt-0.5">
              <GripVertical size={14} />
            </div>
            {editingId === q.id ? (
              <div className="flex-1 min-w-0 space-y-2">
                <input
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  className="w-full px-2 py-1.5 bg-input border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  autoFocus
                />
                <select
                  value={editType}
                  onChange={e => setEditType(e.target.value as QuestionType)}
                  className="px-2 py-1.5 bg-input border border-border rounded-lg text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                >
                  {QUESTION_TYPE_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                {needsOptions(editType) && (
                  <div className="space-y-1">
                    {editOptions.map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-1.5">
                        <input
                          value={opt}
                          onChange={e => {
                            const next = [...editOptions];
                            next[oi] = e.target.value;
                            setEditOptions(next);
                          }}
                          placeholder={`Opção ${oi + 1}`}
                          className="flex-1 px-2 py-1 bg-input border border-border rounded-md text-[11px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        {editOptions.length > 1 && (
                          <button onClick={() => setEditOptions(prev => prev.filter((_, j) => j !== oi))} className="text-muted-foreground hover:text-destructive">
                            <Trash2 size={10} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button onClick={() => setEditOptions(prev => [...prev, ''])} className="text-[10px] text-primary hover:underline">+ Opção</button>
                  </div>
                )}
                <div className="flex items-center gap-1.5 pt-1">
                  <button onClick={saveEditing} className="flex items-center gap-1 px-2.5 py-1 bg-primary text-primary-foreground rounded-md text-[10px] font-medium hover:bg-primary-hover transition-colors">
                    <Check size={11} /> Salvar
                  </button>
                  <button onClick={cancelEditing} className="px-2.5 py-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-muted-foreground">{i + 1}.</span>
                    <span className="text-xs font-medium text-foreground flex-1 truncate">{q.text}</span>
                    <span className={cn('text-[10px] px-1.5 py-0.5 rounded-md font-medium', typeColor(q.type))}>
                      {QUESTION_TYPE_OPTIONS.find(o => o.value === q.type)?.label}
                    </span>
                  </div>
                  {q.options && q.options.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {q.options.map((opt, oi) => (
                        <span key={oi} className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground">{opt}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => startEditing(q)} title="Editar" className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                    <Pencil size={12} />
                  </button>
                  <button onClick={() => toggleRequired(q.id)} title={q.required ? 'Obrigatória' : 'Opcional'} className="text-muted-foreground hover:text-foreground transition-colors">
                    {q.required ? <ToggleRight size={16} className="text-primary" /> : <ToggleLeft size={16} />}
                  </button>
                  <button onClick={() => cloneQuestion(q)} title="Clonar" className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                    <Copy size={12} />
                  </button>
                  <button onClick={() => removeQuestion(q.id)} title="Remover" className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add new question */}
      <div className="border border-border rounded-xl p-4 space-y-3 bg-surface-elevated">
        <p className="text-xs font-medium text-foreground">+ Nova Pergunta</p>
        <input
          value={newText}
          onChange={e => setNewText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addQuestion()}
          placeholder="Digite a pergunta..."
          className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <div className="flex items-center gap-2">
          <select
            value={newType}
            onChange={e => setNewType(e.target.value as QuestionType)}
            className="px-3 py-2 bg-input border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
          >
            {QUESTION_TYPE_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {needsOptions(newType) && (
          <div className="space-y-1.5">
            <p className="text-[10px] text-muted-foreground">Opções de resposta:</p>
            {newOptions.map((opt, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <input
                  value={opt}
                  onChange={e => {
                    const next = [...newOptions];
                    next[i] = e.target.value;
                    setNewOptions(next);
                  }}
                  placeholder={`Opção ${i + 1}`}
                  className="flex-1 px-2 py-1.5 bg-input border border-border rounded-md text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {newOptions.length > 1 && (
                  <button onClick={() => setNewOptions(prev => prev.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive">
                    <Trash2 size={11} />
                  </button>
                )}
              </div>
            ))}
            <button onClick={() => setNewOptions(prev => [...prev, ''])} className="text-[10px] text-primary hover:underline">
              + Adicionar opção
            </button>
          </div>
        )}

        <button
          onClick={addQuestion}
          disabled={!newText.trim()}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary-hover transition-colors disabled:opacity-40"
        >
          <Plus size={13} /> Adicionar Pergunta
        </button>
      </div>
    </div>
  );
}

function needsOptions(type: QuestionType) {
  return type === 'unica-escolha' || type === 'multipla-escolha';
}

function typeColor(type: QuestionType) {
  switch (type) {
    case 'unica-escolha': return 'text-info bg-info/10';
    case 'multipla-escolha': return 'text-accent bg-accent/10';
    case 'texto-curto': return 'text-success bg-success/10';
    case 'texto-longo': return 'text-success bg-success/10';
    case 'numerica': return 'text-warning bg-warning/10';
    case 'data': return 'text-primary bg-primary/10';
    case 'upload': return 'text-destructive bg-destructive/10';
    default: return 'text-muted-foreground bg-muted';
  }
}
