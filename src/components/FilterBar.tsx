import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Settings, X, Check, Search, Columns3, Filter, Plus, Minus, Megaphone } from 'lucide-react';
import { LOCAL_TRABALHO_OPTIONS, EMPRESAS_OPTIONS, FilterPessoas, StatusFilter, Employee, DEMOGRAPHIC_DATA } from '@/data/mockData';

interface FilterBarProps {
  filterPessoas: FilterPessoas;
  setFilterPessoas: (v: FilterPessoas) => void;
  filterStatus: StatusFilter;
  setFilterStatus: (v: StatusFilter) => void;
  filterLocais?: string[];
  setFilterLocais?: (v: string[]) => void;
  filterEmpresas: string[];
  setFilterEmpresas: (v: string[]) => void;
  onOpenModal?: () => void;
  allEmployeesForCount?: number;
  allEmployeesForEmpresaCount?: number;
  hideSettings?: boolean;
  showListToolbar?: boolean;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  visibleColumns?: string[];
  onToggleColumn?: (col: string) => void;
  allColumns?: readonly string[];
  activeFilters?: Record<string, string[]>;
  onToggleFilter?: (category: string, value: string) => void;
  onCreateCampaign?: () => void;
  onClearAllFilters?: () => void;
}

// Categories with 2-level nesting (skill -> level)
const TWO_LEVEL_CATEGORIES = ['Hardskills', 'Softskills', 'Metodologias', 'Idiomas'];

// ── FiltersDropdown ─────────────────────────────────────────
function FiltersDropdown({
  activeFilters = {},
  onToggleFilter,
  filterStatus,
  setFilterStatus,
  filterEmpresas,
  setFilterEmpresas,
}: {
  activeFilters: Record<string, string[]>;
  onToggleFilter?: (category: string, value: string) => void;
  filterStatus?: StatusFilter;
  setFilterStatus?: (v: StatusFilter) => void;
  filterEmpresas?: string[];
  setFilterEmpresas?: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedSubItems, setExpandedSubItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  };

  const toggleSubItem = (key: string) => {
    setExpandedSubItems(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const demographicCount = Object.values(activeFilters).reduce((sum, arr) => sum + arr.length, 0);
  const statusCount = filterStatus && filterStatus !== 'todos' ? 1 : 0;
  const empresasCount = filterEmpresas ? filterEmpresas.length : 0;
  const totalActiveCount = demographicCount + statusCount + empresasCount;

  const categories = Object.keys(DEMOGRAPHIC_DATA);

  const statusOpts: { value: StatusFilter; label: string }[] = [
    { value: 'ativos', label: 'Ativos' },
    { value: 'inativos', label: 'Inativos' },
    { value: 'todos', label: 'Todos' },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (!next) setSearchTerm('');
        }}
        className="flex items-center gap-2 px-3 py-2 rounded-full border border-border bg-surface-elevated text-sm font-medium text-foreground hover:border-primary/50 hover:bg-surface-overlay transition-all duration-150"
      >
        <Filter size={15} />
        Filtrar itens
        {totalActiveCount > 0 && (
          <span className="bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5 font-semibold leading-none">
            {totalActiveCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute z-50 top-full mt-1 min-w-[280px] bg-popover border border-border rounded-lg shadow-modal py-1 animate-fade-in max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          {/* ── Campo de busca ── */}
          <div className="px-2 pt-1 pb-2 sticky top-0 bg-popover z-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar filtro..."
                className="w-full pl-9 pr-3 py-2 bg-input rounded-xl border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                autoFocus
              />
            </div>
          </div>
          {/* ── Colaboradores ── */}
          {(() => {
            const term = searchTerm.toLowerCase();
            const colabLabel = 'Colaboradores (Status)';
            const statusLabels = statusOpts.map(o => o.label);
            const colabMatch = !term || colabLabel.toLowerCase().includes(term) || statusLabels.some(l => l.toLowerCase().includes(term));
            if (!colabMatch) return null;
            return (
          <div>
            <button
              onClick={() => toggleCategory('__colaboradores')}
              className={`flex items-center gap-2 w-full px-3 py-2 text-sm font-medium hover:bg-surface-overlay transition-colors ${filterStatus !== 'todos' ? 'text-info' : 'text-foreground'}`}
            >
              {expandedCategories.has('__colaboradores') ? <Minus size={14} className="shrink-0 text-muted-foreground" /> : <Plus size={14} className="shrink-0 text-muted-foreground" />}
              Colaboradores (Status)
            </button>
            {expandedCategories.has('__colaboradores') && setFilterStatus && (
              <div>
                {statusOpts.map(opt => {
                  const isChecked = filterStatus === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setFilterStatus(opt.value)}
                      className="flex items-center gap-2 w-full pl-7 pr-3 py-1.5 text-sm text-foreground hover:bg-surface-overlay transition-colors"
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isChecked ? 'bg-primary border-primary' : 'border-border'}`}>
                        {isChecked && <Check size={10} className="text-primary-foreground" />}
                      </div>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
            );
          })()}

          {/* ── Banco de Talentos ── */}
          {(() => {
            const term = searchTerm.toLowerCase();
            const btLabel = 'Banco de Talentos (Origens)';
            const empresaLabels = EMPRESAS_OPTIONS.map(o => o.label);
            const btMatch = !term || btLabel.toLowerCase().includes(term) || empresaLabels.some(l => l.toLowerCase().includes(term));
            if (!btMatch) return null;
            return (
          <div>
            <button
              onClick={() => toggleCategory('__banco-talentos')}
              className={`flex items-center gap-2 w-full px-3 py-2 text-sm font-medium hover:bg-surface-overlay transition-colors ${filterEmpresas && filterEmpresas.length > 0 ? 'text-info' : 'text-foreground'}`}
            >
              {expandedCategories.has('__banco-talentos') ? <Minus size={14} className="shrink-0 text-muted-foreground" /> : <Plus size={14} className="shrink-0 text-muted-foreground" />}
              Banco de Talentos (Origens)
            </button>
            {expandedCategories.has('__banco-talentos') && setFilterEmpresas && filterEmpresas && (
              <div>
                {EMPRESAS_OPTIONS.filter(opt => !term || opt.label.toLowerCase().includes(term) || btLabel.toLowerCase().includes(term)).map(opt => {
                  const isChecked = filterEmpresas.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      onClick={() => {
                        const next = isChecked
                          ? filterEmpresas.filter(v => v !== opt.value)
                          : [...filterEmpresas, opt.value];
                        setFilterEmpresas(next);
                      }}
                      className="flex items-center gap-2 w-full pl-7 pr-3 py-1.5 text-sm text-foreground hover:bg-surface-overlay transition-colors"
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isChecked ? 'bg-primary border-primary' : 'border-border'}`}>
                        {isChecked && <Check size={10} className="text-primary-foreground" />}
                      </div>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
            );
          })()}

          {/* ── Separator ── */}
          <div className="border-t border-border my-1" />

          {/* ── Demographic filters (grouped) ── */}
          {(() => {
            const term = searchTerm.toLowerCase();
            const filterGroups: { title: string; keys: string[] }[] = [
              { title: 'Dados Pessoais', keys: ['Idade', 'Tempo de Casa', 'Gênero', 'Cor ou Etnia', 'Orientação Sexual', 'PCD'] },
              { title: 'Documentação', keys: ['Visto', 'Cidadania'] },
              { title: 'Formação', keys: ['Escolaridade', 'Formações', 'Certificações'] },
              { title: 'Competências', keys: ['Hardskills', 'Softskills', 'Metodologias', 'Idiomas'] },
              { title: 'Localização', keys: ['Estado', 'Cidade'] },
            ];

            return filterGroups.map((fg, gi) => {
              const availableKeys = fg.keys.filter(k => categories.includes(k));
              if (availableKeys.length === 0) return null;

              // Filter keys by search term
              const filteredKeys = term
                ? availableKeys.filter(k => {
                    const group = DEMOGRAPHIC_DATA[k];
                    if (!group) return false;
                    if (group.category.toLowerCase().includes(term)) return true;
                    if (fg.title.toLowerCase().includes(term)) return true;
                    return group.rows.some(r => r.label.toLowerCase().includes(term) || (r.children && r.children.some(c => c.label.toLowerCase().includes(term))));
                  })
                : availableKeys;

              if (filteredKeys.length === 0) return null;
              const groupHasActive = filteredKeys.some(k => (activeFilters[k] || []).length > 0);

              return (
                <div key={fg.title}>
                  {gi > 0 && <div className="h-px bg-border mx-2 my-1" />}
                  <div className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider ${groupHasActive ? 'text-info' : 'text-muted-foreground'}`}>
                    {fg.title}
                  </div>
                  {filteredKeys.map(catKey => {
                    const group = DEMOGRAPHIC_DATA[catKey];
                    if (!group) return null;
                    const isTwoLevel = TWO_LEVEL_CATEGORIES.includes(catKey);
                    const isExpanded = expandedCategories.has(catKey);

                    return (
                      <div key={catKey}>
                        <button
                          onClick={() => toggleCategory(catKey)}
                          className={`flex items-center gap-2 w-full px-3 py-2 text-sm font-medium hover:bg-surface-overlay transition-colors ${(activeFilters[catKey] || []).length > 0 ? 'text-info' : 'text-foreground'}`}
                        >
                          {isExpanded ? <Minus size={14} className="shrink-0 text-muted-foreground" /> : <Plus size={14} className="shrink-0 text-muted-foreground" />}
                          {group.category}
                        </button>

                        {isExpanded && (
                          <div>
                            {isTwoLevel ? (
                              group.rows.map(row => {
                                const subKey = `${catKey}::${row.label}`;
                                const isSubExpanded = expandedSubItems.has(subKey);
                                return (
                                  <div key={row.label}>
                                    <button
                                      onClick={() => toggleSubItem(subKey)}
                                      className="flex items-center gap-2 w-full pl-7 pr-3 py-1.5 text-sm text-foreground hover:bg-surface-overlay transition-colors"
                                    >
                                      {isSubExpanded ? <Minus size={12} className="shrink-0 text-muted-foreground" /> : <Plus size={12} className="shrink-0 text-muted-foreground" />}
                                      {row.label}
                                    </button>
                                    {isSubExpanded && row.children && row.children.map(child => {
                                      const filterValue = `${row.label}::${child.label}`;
                                      const isChecked = (activeFilters[catKey] || []).includes(filterValue);
                                      return (
                                        <button
                                          key={child.label}
                                          onClick={() => onToggleFilter?.(catKey, filterValue)}
                                          className="flex items-center gap-2 w-full pl-12 pr-3 py-1.5 text-sm text-foreground hover:bg-surface-overlay transition-colors"
                                        >
                                          <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isChecked ? 'bg-primary border-primary' : 'border-border'}`}>
                                            {isChecked && <Check size={10} className="text-primary-foreground" />}
                                          </div>
                                          {child.label}
                                        </button>
                                      );
                                    })}
                                  </div>
                                );
                              })
                            ) : (
                              group.rows.map(row => {
                                const isChecked = (activeFilters[catKey] || []).includes(row.label);
                                return (
                                  <button
                                    key={row.label}
                                    onClick={() => onToggleFilter?.(catKey, row.label)}
                                    className="flex items-center gap-2 w-full pl-7 pr-3 py-1.5 text-sm text-foreground hover:bg-surface-overlay transition-colors"
                                  >
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isChecked ? 'bg-primary border-primary' : 'border-border'}`}>
                                      {isChecked && <Check size={10} className="text-primary-foreground" />}
                                    </div>
                                    {row.label}
                                  </button>
                                );
                              })
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            });
          })()}
        </div>
      )}
    </div>
  );
}

// ── Single-select ComboBox ──────────────────────────────────
function SingleSelect<T extends string>({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        disabled={disabled}
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-150
          bg-surface-elevated border-border text-foreground
          hover:border-primary/50 hover:bg-surface-overlay
          focus:outline-none focus:ring-1 focus:ring-primary/50
          disabled:opacity-40 disabled:cursor-not-allowed
          min-w-[160px] justify-between`}
      >
        <span className="truncate">{selected?.label ?? label}</span>
        <ChevronDown size={14} className={`shrink-0 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-50 top-full mt-1 min-w-full bg-popover border border-border rounded-lg shadow-modal py-1 animate-fade-in">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-colors
                ${value === opt.value ? 'text-primary bg-primary/10' : 'text-foreground hover:bg-surface-overlay'}`}
            >
              {value === opt.value && <Check size={12} className="shrink-0" />}
              {value !== opt.value && <span className="w-3" />}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Multi-select ComboBox ───────────────────────────────────
function MultiSelect({
  label,
  values,
  options,
  onChange,
  totalCount,
}: {
  label: string;
  values: string[];
  options: { value: string; label: string }[];
  onChange: (v: string[]) => void;
  totalCount?: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (v: string) => {
    onChange(values.includes(v) ? values.filter((x) => x !== v) : [...values, v]);
  };

  const displayLabel =
    values.length === 0
      ? label
      : values.length === 1
      ? options.find((o) => o.value === values[0])?.label ?? label
      : `${values.length} selecionados`;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-150
          bg-surface-elevated border-border text-foreground
          hover:border-primary/50 hover:bg-surface-overlay
          focus:outline-none focus:ring-1 focus:ring-primary/50
          min-w-[180px] justify-between"
      >
        <span className="truncate">{displayLabel}</span>
        <div className="flex items-center gap-1">
          {totalCount == null && values.length > 0 && (
            <span className="bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5 font-semibold leading-none">
              {values.length}
            </span>
          )}
          {totalCount != null && totalCount > 0 && (
            <span className="bg-info text-info-foreground text-[10px] rounded-full px-1.5 py-0.5 font-bold leading-none">
              {totalCount}
            </span>
          )}
          <ChevronDown size={14} className={`shrink-0 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>
      {open && (
        <div className="absolute z-50 top-full mt-1 min-w-full bg-popover border border-border rounded-lg shadow-modal py-1 animate-fade-in max-h-64 overflow-y-auto">
          {options.map((opt) => {
            const selected = values.includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => toggle(opt.value)}
                className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-colors
                  ${selected ? 'text-primary bg-primary/10' : 'text-foreground hover:bg-surface-overlay'}`}
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0
                  ${selected ? 'bg-primary border-primary' : 'border-border'}`}>
                  {selected && <Check size={10} className="text-primary-foreground" />}
                </div>
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── FilterBar ───────────────────────────────────────────────
export function FilterBar({
  filterPessoas,
  setFilterPessoas,
  filterStatus,
  setFilterStatus,
  filterLocais,
  setFilterLocais,
  filterEmpresas,
  setFilterEmpresas,
  onOpenModal,
  allEmployeesForCount = 0,
  allEmployeesForEmpresaCount,
  hideSettings = false,
  showListToolbar = false,
  searchQuery = '',
  onSearchChange,
  visibleColumns = [],
  onToggleColumn,
  allColumns = [],
  activeFilters = {},
  onToggleFilter,
  onCreateCampaign,
  onClearAllFilters,
}: FilterBarProps) {

  const [showTooltip, setShowTooltip] = useState(false);
  const [colDropdownOpen, setColDropdownOpen] = useState(false);
  const colDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showListToolbar) return;
    const handler = (e: MouseEvent) => {
      if (colDropdownRef.current && !colDropdownRef.current.contains(e.target as Node)) {
        setColDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showListToolbar]);
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* ── Filtros do Mapa ── */}
      {!showListToolbar && (
        <>
          <SingleSelect
            label="Filtrar Pessoas"
            value={filterPessoas}
            options={[
              { value: 'colaboradores' as FilterPessoas, label: 'Colaboradores' },
              { value: 'banco-talentos' as FilterPessoas, label: 'Banco de Talentos' },
            ]}
            onChange={setFilterPessoas}
          />

          {filterPessoas === 'colaboradores' && (
            <SingleSelect
              label="Status"
              value={filterStatus}
              options={[
                { value: 'ativos' as StatusFilter, label: 'Ativos' },
                { value: 'inativos' as StatusFilter, label: 'Inativos' },
                { value: 'todos' as StatusFilter, label: 'Todos' },
              ]}
              onChange={setFilterStatus}
            />
          )}

          {filterPessoas === 'colaboradores' && filterLocais && setFilterLocais && (
            <MultiSelect
              label="Local de Trabalho"
              values={filterLocais}
              options={LOCAL_TRABALHO_OPTIONS}
              onChange={setFilterLocais}
              totalCount={allEmployeesForCount}
            />
          )}

          {filterPessoas === 'banco-talentos' && (
            <MultiSelect
              label="Origem"
              values={filterEmpresas}
              options={EMPRESAS_OPTIONS}
              onChange={setFilterEmpresas}
              totalCount={allEmployeesForEmpresaCount}
            />
          )}
        </>
      )}

      {/* ── Toolbar da Lista ── */}
      {showListToolbar && (
        <>

          {/* Colunas */}
          <div ref={colDropdownRef} className="relative">
            <button
              onClick={() => setColDropdownOpen(prev => !prev)}
              className="flex items-center gap-2 px-3 py-2 rounded-full border border-border bg-surface-elevated text-sm font-medium text-foreground hover:border-primary/50 hover:bg-surface-overlay transition-all duration-150"
            >
              <Columns3 size={15} />
              Selecionar colunas
              {visibleColumns.length > 0 && (
                <span className="ml-1 bg-primary text-primary-foreground text-[10px] rounded-full px-1.5 py-0.5 font-semibold leading-none">
                  {visibleColumns.length}
                </span>
              )}
            </button>
            {colDropdownOpen && (
              <div className="absolute z-50 top-full mt-1 min-w-[220px] max-h-[360px] overflow-y-auto bg-popover border border-border rounded-lg shadow-modal py-1 animate-fade-in scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                {(() => {
                  const columnGroups: { title: string; columns: string[] }[] = [
                    { title: 'Perfil', columns: ['Nome Completo', 'CV 360'] },
                    { title: 'Dados Pessoais', columns: ['Idade', 'Tempo de casa', 'Gêneros', 'Cor ou Etnia', 'Orientação Sexual', 'PCD'] },
                    { title: 'Documentação', columns: ['Visto', 'Cidadania'] },
                    { title: 'Formação', columns: ['Escolaridade', 'Formações', 'Certificações'] },
                    { title: 'Competências', columns: ['Hardskills', 'Softskills', 'Metodologias', 'Idiomas'] },
                    { title: 'Empresa', columns: ['Local de Trabalho', 'Cargos', 'Clientes', 'Modalidade de trabalho'] },
                    { title: 'Localização', columns: ['Estado', 'Cidade'] },
                  ];
                  return columnGroups.map((group, gi) => {
                    const availableCols = group.columns.filter(c => allColumns.includes(c));
                    if (availableCols.length === 0) return null;
                    const hasSelected = availableCols.some(c => visibleColumns.includes(c));
                    return (
                      <div key={group.title}>
                        {gi > 0 && <div className="h-px bg-border mx-2 my-1" />}
                        <div className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider ${hasSelected ? 'text-info' : 'text-muted-foreground'}`}>
                          {group.title}
                        </div>
                        {availableCols.map(col => {
                          const selected = visibleColumns.includes(col);
                          return (
                            <button
                              key={col}
                              onClick={() => onToggleColumn?.(col)}
                              className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-colors
                                ${selected ? 'text-primary bg-primary/10' : 'text-foreground hover:bg-surface-overlay'}`}
                            >
                              <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0
                                ${selected ? 'bg-primary border-primary' : 'border-border'}`}>
                                {selected && <Check size={10} className="text-primary-foreground" />}
                              </div>
                              {col}
                            </button>
                          );
                        })}
                      </div>
                    );
                  });
                })()}
              </div>
            )}
          </div>

          {/* Filtros */}
          <FiltersDropdown
            activeFilters={activeFilters || {}}
            onToggleFilter={onToggleFilter}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterEmpresas={filterEmpresas}
            setFilterEmpresas={setFilterEmpresas}
          />

          {/* Separador */}
          <div className="w-px h-6 bg-border self-center" />

          {/* Limpar filtros */}
          {(() => {
            const hasActive = filterStatus !== 'todos' || (filterEmpresas && filterEmpresas.length > 0) || Object.values(activeFilters || {}).some(v => v.length > 0) || (searchQuery && searchQuery.length > 0) || (visibleColumns && visibleColumns.length > 0);
            return (
              <button
                onClick={onClearAllFilters}
                disabled={!hasActive}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-border bg-surface-elevated transition-all duration-150 ${hasActive ? 'text-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30' : 'opacity-40 cursor-not-allowed text-muted-foreground'}`}
              >
                <X size={13} />
                Limpar filtros
              </button>
            );
          })()}

          {/* Separador */}
          <div className="w-px h-6 bg-border self-center" />

          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Busca por nome..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all duration-150"
            />
          </div>
        </>
      )}

      {!hideSettings && !showListToolbar && (
        <div className="relative ml-auto">
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={onOpenModal}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-border
              bg-surface-elevated text-muted-foreground
              hover:border-primary/50 hover:text-primary hover:bg-primary/10
              transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-primary/50"
          >
            <Settings size={16} />
          </button>
          {showTooltip && (
            <div className="absolute right-0 top-full mt-1.5 bg-popover border border-border rounded-md px-2.5 py-1 text-xs text-foreground shadow-card whitespace-nowrap animate-fade-in z-50">
              Mapa Personalizado
            </div>
          )}
        </div>
      )}
    </div>
  );
}
