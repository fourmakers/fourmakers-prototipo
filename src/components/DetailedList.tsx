import React, { useState, useEffect, useMemo } from 'react';
import { Table2, ChevronLeft, ChevronRight, X, Megaphone, CircleUserRound } from 'lucide-react';
import { filterEmployeesByDemographic, Employee } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable, type Column } from '@/components/common';

type ColumnKey = 'Nome Completo' | 'CV 360' | 'Idade' | 'Tempo de casa' | 'Gêneros' | 'Cor ou Etnia' | 'Visto' | 'Cidadania' | 'Escolaridade' | 'Orientação Sexual' | 'PCD' | 'Hardskills' | 'Softskills' | 'Metodologias' | 'Formações' | 'Idiomas' | 'Local de Trabalho' | 'Cargos' | 'Clientes' | 'Modalidade de trabalho' | 'Certificações' | 'Estado' | 'Cidade';

interface DetailedListProps {
  filterLabel: string;
  filterCount: number;
  filterCategory: string;
  filterRowLabel: string;
  appliedFilters: string[];
  filteredEmployees: Employee[];
  activeFiltersDisplay?: { label: string; value: string; type: string; filterKey?: string }[];
  onRemoveActiveFilter?: (filter: { label: string; value: string; type: string; filterKey?: string }) => void;
  onBack: () => void;
  searchQuery?: string;
  visibleColumns?: ColumnKey[];
  onCreateCampaign?: () => void;
}

const ALL_COLUMNS: ColumnKey[] = ['Nome Completo', 'CV 360', 'Idade', 'Tempo de casa', 'Gêneros', 'Cor ou Etnia', 'Visto', 'Cidadania', 'Escolaridade', 'Orientação Sexual', 'PCD', 'Hardskills', 'Softskills', 'Metodologias', 'Formações', 'Idiomas', 'Local de Trabalho', 'Cargos', 'Clientes', 'Modalidade de trabalho', 'Certificações', 'Estado', 'Cidade'];

/** Mapeia label da coluna para chave em Employee (para ordenação). */
const COLUMN_KEY_TO_DATA_KEY: Record<ColumnKey, keyof Employee | 'cv360'> = {
  'Nome Completo': 'nome', 'CV 360': 'cv360', 'Idade': 'idade', 'Tempo de casa': 'tempoCasa',
  'Gêneros': 'genero', 'Cor ou Etnia': 'corEtnia', 'Visto': 'visto', 'Cidadania': 'cidadania',
  'Escolaridade': 'escolaridade', 'Orientação Sexual': 'orientacaoSexual', 'PCD': 'pcd',
  'Hardskills': 'hardskills', 'Softskills': 'softskills', 'Metodologias': 'metodologias',
  'Formações': 'formacao', 'Idiomas': 'idiomas', 'Local de Trabalho': 'localTrabalho',
  'Cargos': 'cargo', 'Clientes': 'cliente', 'Modalidade de trabalho': 'modalidadeTrabalho',
  'Certificações': 'certificacoes', 'Estado': 'estado', 'Cidade': 'cidade',
};

function renderCellContent(emp: Employee, columnId: string): React.ReactNode {
  switch (columnId) {
    case 'nome':
      return (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-semibold text-primary">
              {(emp.nome || '').split(' ').map((n) => n[0]).slice(0, 2).join('')}
            </span>
          </div>
          <span className="font-medium text-foreground">{emp.nome}</span>
        </div>
      );
    case 'cv360':
      return <CircleUserRound size={18} className="text-info inline-block" />;
    case 'idade': return <span className="text-muted-foreground">{emp.idade}</span>;
    case 'tempoCasa': return <span className="text-muted-foreground">{emp.tempoCasa}</span>;
    case 'genero': return <span className="text-muted-foreground">{emp.genero}</span>;
    case 'corEtnia': return <span className="text-muted-foreground">{emp.corEtnia}</span>;
    case 'visto': return <span className="text-muted-foreground">{emp.visto}</span>;
    case 'cidadania': return <span className="text-muted-foreground">{emp.cidadania}</span>;
    case 'escolaridade': return <span className="text-muted-foreground">{emp.escolaridade}</span>;
    case 'orientacaoSexual': return <span className="text-muted-foreground">{emp.orientacaoSexual}</span>;
    case 'pcd': return <span className="text-muted-foreground">{emp.pcd}</span>;
    case 'hardskills': return <span className="text-muted-foreground">{emp.hardskills.map(h => h.skill).join(', ')}</span>;
    case 'softskills': return <span className="text-muted-foreground">{emp.softskills.map(s => s.softskill).join(', ')}</span>;
    case 'metodologias': return <span className="text-muted-foreground">{emp.metodologias.map(m => m.metodologia).join(', ')}</span>;
    case 'formacao': return <span className="text-muted-foreground">{emp.formacao}</span>;
    case 'idiomas': return <span className="text-muted-foreground">{emp.idiomas.map(i => i.idioma).join(', ')}</span>;
    case 'localTrabalho': return <span className="text-muted-foreground">{emp.localTrabalho}</span>;
    case 'cargo': return <span className="text-muted-foreground">{emp.cargo}</span>;
    case 'cliente': return <span className="text-muted-foreground">{emp.cliente}</span>;
    case 'modalidadeTrabalho': return <span className="text-muted-foreground">{emp.modalidadeTrabalho}</span>;
    case 'certificacoes': return <span className="text-muted-foreground">{emp.certificacoes.join(', ')}</span>;
    case 'estado': return <span className="text-muted-foreground">{emp.estado}</span>;
    case 'cidade': return <span className="text-muted-foreground">{emp.cidade}</span>;
    default: return null;
  }
}

export function DetailedList({
  filterLabel,
  filterCount,
  filterCategory,
  filterRowLabel,
  appliedFilters,
  filteredEmployees,
  activeFiltersDisplay = [],
  onRemoveActiveFilter,
  onBack,
  searchQuery = '',
  visibleColumns,
  onCreateCampaign,
}: DetailedListProps) {
  const cols = visibleColumns ?? ALL_COLUMNS;

  const nonSortableKeys = ['cv360', 'hardskills', 'softskills', 'metodologias', 'idiomas', 'certificacoes'];
  const dataTableColumns: Column[] = useMemo(
    () =>
      cols.map((c) => ({
        id: COLUMN_KEY_TO_DATA_KEY[c],
        label: c,
        sortable: !nonSortableKeys.includes(COLUMN_KEY_TO_DATA_KEY[c]),
      })),
    [cols]
  );

  const baseEmployees =
    filterCategory === 'Geral'
      ? filteredEmployees
      : filterEmployeesByDemographic(filterCategory, filterRowLabel, filteredEmployees);

  const employees = searchQuery
    ? baseEmployees.filter(emp => emp.nome.toLowerCase().includes(searchQuery.toLowerCase()))
    : baseEmployees;

  const ITEMS_PER_PAGE = 7;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(employees.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEmployees = employees.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [employees.length, cols, searchQuery]);

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      {/* Título da página (padrão fourmakers-v2) */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="page-title">Lista Combinada</h1>
          <p className="page-subtitle mt-0.5">
            {filterCategory === 'Geral' ? 'É a integração estratégica de informações em um único lugar, ideal para tomada de decisões.' : `${filterCategory} · ${filterRowLabel}`}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {onCreateCampaign && (
            <button
              onClick={onCreateCampaign}
              disabled={!visibleColumns || visibleColumns.length === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium transition-colors ${
                !visibleColumns || visibleColumns.length === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-primary/90'
              }`}
            >
              <Megaphone size={15} />
              Criar Campanha
            </button>
          )}
          <div className="bg-primary/10 border border-primary/20 rounded-lg px-3 py-1">
            <span className="text-xs font-semibold text-primary">{employees.length} colaboradores</span>
          </div>
        </div>
      </div>

      {/* Applied Filters */}
      {(activeFiltersDisplay.length > 0 || filterCategory !== 'Geral') && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground font-medium">Filtros ativos:</span>
          {activeFiltersDisplay.map((f, i) => (
            <span key={i} className="inline-flex items-center gap-1 text-xs bg-muted border border-border rounded-full px-2.5 py-1 text-foreground font-medium">
              {f.label}: {f.value}
              {(f.type === 'column' || f.type === 'filter') && onRemoveActiveFilter && (
                <button
                  onClick={() => onRemoveActiveFilter(f)}
                  className="ml-0.5 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                >
                  <X size={10} />
                </button>
              )}
            </span>
          ))}
          {filterCategory !== 'Geral' && (
            <span className="text-xs bg-primary/10 border border-primary/20 rounded-md px-2 py-1 text-primary font-medium">
              {filterCategory}: {filterRowLabel}
            </span>
          )}
        </div>
      )}

      {/* Table */}
      {cols.length === 0 ? (
        <Card className="rounded-xl">
          <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
            <Table2 size={36} className="text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground font-medium">Selecione as colunas desejadas no botão <span className="font-semibold text-foreground">Colunas</span> para montar a tabela.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-xl">
          <CardContent className="p-6">
            <DataTable<Employee>
              columns={dataTableColumns}
              data={paginatedEmployees.filter((e) => e && e.nome)}
              keyExtractor={(item) => item.id}
              renderCell={renderCellContent}
              emptyMessage="Nenhum registro encontrado"
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border mt-4">
              <span className="text-xs text-muted-foreground">
                Página {currentPage} de {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-border bg-surface-elevated text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                >
                  <ChevronLeft size={14} />
                  Anterior
                </button>
                {getPageNumbers().map((page, i) =>
                  page === 'ellipsis' ? (
                    <span key={`e${i}`} className="px-1.5 text-xs text-muted-foreground">…</span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 text-xs font-medium rounded-lg border transition-colors ${
                        currentPage === page
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-border bg-surface-elevated text-muted-foreground hover:text-foreground hover:border-primary/40'
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-border bg-surface-elevated text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                >
                  Próxima
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
