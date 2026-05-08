import { useState, useMemo, useEffect } from 'react';
import { X, Download, Search, Target, AlertTriangle, Lightbulb, TrendingUp, Users, Building, Briefcase, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable, type Column } from '@/components/common';
import { Campaign, MOCK_AUDIENCE, ITENS_DEMOGRAFICOS_GROUPS, SMART_FILTER_SUGGESTIONS } from '../campaignData';

interface Props {
  data: Omit<Campaign, 'id'>;
  onChange: (updates: Partial<Omit<Campaign, 'id'>>) => void;
  selectedFilters: Record<string, string[]>;
  onToggleFilter: (category: string, value: string) => void;
}

export const FILTER_CATEGORIES = [
  { key: 'localTrabalho', label: 'Local de Trabalho', values: ['UNI I - Alphaville SP', 'UNI II - Paulista SP', 'Curitiba PR', 'Rio de Janeiro RJ', 'Florida USA', 'Lisboa EU'] },
  { key: 'cargo', label: 'Cargo', values: ['Desenvolvedor Backend', 'Desenvolvedor Frontend', 'Tech Lead', 'Product Manager', 'UX Designer', 'DevOps Engineer', 'QA Engineer'] },
  { key: 'genero', label: 'Gênero', values: ['Homem Cisgênero', 'Mulher Cisgênero', 'Transgênero', 'Não Binária'] },
  { key: 'modalidade', label: 'Modalidade', values: ['Remoto', 'Híbrido', 'Presencial'] },
];

const TOTAL_EMPRESA = 146;

type AudienceRow = { nome: string; localTrabalho: string; cargo: string; genero: string; modalidade: string; area?: string };

// Expand mock audience to simulate larger dataset
export const FULL_AUDIENCE = (() => {
  const areas = ['Tecnologia', 'Produto', 'Operações', 'RH', 'Financeiro', 'Comercial'];
  const result = [...MOCK_AUDIENCE];
  while (result.length < TOTAL_EMPRESA) {
    const base = MOCK_AUDIENCE[result.length % MOCK_AUDIENCE.length];
    result.push({
      ...base,
      nome: `${base.nome} ${result.length}`,
      area: areas[result.length % areas.length],
    });
  }
  return result;
})();

function getRepresentativityStatus(pct: number) {
  if (pct >= 40) return { label: 'Alta representatividade', color: 'text-success', bg: 'bg-success/10', border: 'border-success/30', icon: '🟢' };
  if (pct >= 15) return { label: 'Média representatividade', color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30', icon: '🟡' };
  return { label: 'Baixa representatividade', color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30', icon: '🔴' };
}

export function StepPublicoAlvo({ data, onChange, selectedFilters, onToggleFilter }: Props) {
  const [searchList, setSearchList] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const removeFilter = (category: string, value: string) => {
    onToggleFilter(category, value);
  };

  const filteredAudience = useMemo(() => {
    let result = FULL_AUDIENCE;
    Object.entries(selectedFilters).forEach(([cat, values]) => {
      if (values.length > 0) {
        result = result.filter(p => {
          const row = p as Record<string, string | undefined>;
          const cell = row[cat];
          return cell !== undefined && values.includes(cell);
        });
      }
    });
    if (searchList) {
      const q = searchList.toLowerCase();
      result = result.filter(p => p.nome.toLowerCase().includes(q));
    }
    return result;
  }, [selectedFilters, searchList]);

  const impacted = filteredAudience.length;
  const pct = TOTAL_EMPRESA > 0 ? Math.round((impacted / TOTAL_EMPRESA) * 100) : 0;
  const hasFilters = Object.values(selectedFilters).some(v => v.length > 0);

  // Update parent via effect instead of useMemo to avoid setState during render
  useEffect(() => {
    onChange({ totalImpactados: impacted });
  }, [impacted]);

  // Distribution calculations
  const distributionByArea = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredAudience.forEach(p => {
      const area = p.area || 'Outros';
      counts[area] = (counts[area] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count, pct: Math.round((count / Math.max(impacted, 1)) * 100) }))
      .sort((a, b) => b.count - a.count);
  }, [filteredAudience, impacted]);

  const distributionByLocal = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredAudience.forEach(p => {
      counts[p.localTrabalho] = (counts[p.localTrabalho] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count, pct: Math.round((count / Math.max(impacted, 1)) * 100) }))
      .sort((a, b) => b.count - a.count);
  }, [filteredAudience, impacted]);

  const distributionByCargo = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredAudience.forEach(p => {
      counts[p.cargo] = (counts[p.cargo] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count, pct: Math.round((count / Math.max(impacted, 1)) * 100) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [filteredAudience, impacted]);

  const representativity = getRepresentativityStatus(pct);

  // Smart suggestions
  const smartSuggestions = useMemo(() => {
    const tipo = data.tipoCampanha;
    if (!tipo || !SMART_FILTER_SUGGESTIONS[tipo]) return null;
    const suggestion = SMART_FILTER_SUGGESTIONS[tipo];
    const suggestedFilters = suggestion.filters
      .map(key => FILTER_CATEGORIES.find(c => c.key === key))
      .filter(Boolean);
    // Only show if no filters applied yet
    if (hasFilters) return null;
    return { label: suggestion.label, filters: suggestedFilters };
  }, [data.tipoCampanha, hasFilters]);

  const totalPages = Math.ceil(filteredAudience.length / pageSize);
  const paginatedAudience = filteredAudience.slice((page - 1) * pageSize, page * pageSize);

  const allFilterTags = Object.entries(selectedFilters).flatMap(([cat, vals]) =>
    vals.map(v => ({ category: cat, value: v, label: `${FILTER_CATEGORIES.find(f => f.key === cat)?.label || cat}: ${v}` }))
  );

  const handleExportCSV = () => {
    const header = 'Nome,Local de Trabalho,Cargo,Gênero,Modalidade\n';
    const rows = filteredAudience.map(p => `${p.nome},${p.localTrabalho},${p.cargo},${p.genero},${p.modalidade}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'publico-alvo.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 h-full overflow-y-auto">
      {/* Smart Suggestions */}
      {smartSuggestions && (
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb size={14} className="text-accent" />
            <p className="text-[11px] font-semibold text-accent">Sugestões Inteligentes de Segmentação</p>
          </div>
          <p className="text-[10px] text-muted-foreground mb-2">
            Para campanhas de <strong className="text-foreground">{smartSuggestions.label}</strong>, sugerimos aplicar filtros em:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {smartSuggestions.filters.map(f => f && (
              <button
                key={f.key}
                onClick={() => {
                  // Apply first value as example
                  if (f.values[0]) onToggleFilter(f.key, f.values[0]);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-accent/10 text-accent text-[10px] font-medium hover:bg-accent/20 transition-colors cursor-pointer"
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Simulação de Impacto */}
      <div className="bg-surface border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Target size={14} className="text-primary" />
          <p className="text-[11px] font-semibold text-foreground uppercase tracking-wider">Simulação de Impacto</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 bg-surface-elevated rounded-lg border border-border">
            <p className="text-lg font-bold text-foreground">{TOTAL_EMPRESA}</p>
            <p className="text-[10px] text-muted-foreground">Total empresa</p>
          </div>
          <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-lg font-bold text-primary">{impacted}</p>
            <p className="text-[10px] text-muted-foreground">Impactados</p>
          </div>
          <div className="text-center p-3 bg-surface-elevated rounded-lg border border-border">
            <p className="text-lg font-bold text-foreground">{pct}%</p>
            <p className="text-[10px] text-muted-foreground">Da empresa</p>
          </div>
        </div>

        {/* Score de Representatividade */}
        <div className={cn('flex items-center gap-2 px-3 py-2 rounded-lg border', representativity.bg, representativity.border)}>
          <span className="text-sm">{representativity.icon}</span>
          <div>
            <p className={cn('text-[11px] font-semibold', representativity.color)}>{representativity.label}</p>
            <p className="text-[9px] text-muted-foreground">
              {pct >= 40 ? 'Excelente cobertura para análise estatística' :
               pct >= 15 ? 'Cobertura adequada, considere ampliar para maior confiança' :
               'Público reduzido — considere ampliar os filtros'}
            </p>
          </div>
        </div>

        {/* Bias Alert */}
        {impacted > 0 && impacted < 10 && (
          <div className="flex items-start gap-2 mt-3 px-3 py-2.5 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertTriangle size={14} className="text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-semibold text-destructive">Atenção: público muito pequeno</p>
              <p className="text-[10px] text-muted-foreground">
                O público selecionado ({impacted} colaboradores) pode comprometer o anonimato e a qualidade da análise.
                Considere revisar os filtros aplicados.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Distribution panels */}
      {hasFilters && (
        <div className="grid grid-cols-3 gap-3">
          {/* By Area */}
          <div className="bg-surface border border-border rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Building size={11} className="text-muted-foreground" />
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Por Área</p>
            </div>
            <div className="space-y-1.5">
              {distributionByArea.slice(0, 5).map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="text-[10px] text-foreground flex-1 truncate">{d.name}</span>
                  <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary/60 rounded-full" style={{ width: `${d.pct}%` }} />
                  </div>
                  <span className="text-[9px] text-muted-foreground w-8 text-right">{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* By Local */}
          <div className="bg-surface border border-border rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <MapPin size={11} className="text-muted-foreground" />
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Por Unidade</p>
            </div>
            <div className="space-y-1.5">
              {distributionByLocal.slice(0, 5).map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="text-[10px] text-foreground flex-1 truncate">{d.name}</span>
                  <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-info/60 rounded-full" style={{ width: `${d.pct}%` }} />
                  </div>
                  <span className="text-[9px] text-muted-foreground w-8 text-right">{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* By Cargo */}
          <div className="bg-surface border border-border rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Briefcase size={11} className="text-muted-foreground" />
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Por Cargo</p>
            </div>
            <div className="space-y-1.5">
              {distributionByCargo.map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="text-[10px] text-foreground flex-1 truncate">{d.name}</span>
                  <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-accent/60 rounded-full" style={{ width: `${d.pct}%` }} />
                  </div>
                  <span className="text-[9px] text-muted-foreground w-8 text-right">{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Selected Filters Tags */}
      {allFilterTags.length > 0 && (
        <div className="bg-surface border border-border rounded-xl p-3">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-2">Filtros selecionados</p>
          <div className="flex flex-wrap gap-1.5">
            {allFilterTags.map(tag => {
              const count = filteredAudience.filter(person => {
                const row = person as Record<string, string | undefined>;
                return row[tag.category] === tag.value;
              }).length;
              return (
                <span key={`${tag.category}-${tag.value}`} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-[11px] font-medium">
                  {tag.value}
                  <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[9px] font-bold">{count}</span>
                  <button onClick={() => removeFilter(tag.category, tag.value)} className="hover:text-destructive transition-colors ml-0.5">
                    <X size={11} />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Detailed List */}
      <Card className="rounded-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Lista detalhada</p>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={searchList}
                  onChange={e => { setSearchList(e.target.value); setPage(1); }}
                  placeholder="Buscar..."
                  className="pl-6 pr-2 py-1 text-[11px] bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary w-36"
                />
              </div>
              <button type="button" onClick={handleExportCSV} className="flex items-center gap-1 px-2 py-1 text-[10px] text-primary hover:bg-primary/10 rounded-md transition-colors">
                <Download size={11} /> CSV
              </button>
            </div>
          </div>
          <DataTable<AudienceRow>
            columns={[
              { id: 'nome', label: 'Nome', sortable: true },
              { id: 'localTrabalho', label: 'Local', sortable: true },
              { id: 'cargo', label: 'Cargo', sortable: true },
              { id: 'genero', label: 'Gênero', sortable: true },
              { id: 'modalidade', label: 'Modalidade', sortable: true },
            ]}
            data={paginatedAudience}
            keyExtractor={(p) => p.nome}
            renderCell={(p, columnId) => {
              if (columnId === 'nome') return <span className="text-foreground font-medium">{p.nome}</span>;
              if (columnId === 'localTrabalho') return <span className="text-muted-foreground">{p.localTrabalho}</span>;
              if (columnId === 'cargo') return <span className="text-muted-foreground">{p.cargo}</span>;
              if (columnId === 'genero') return <span className="text-muted-foreground">{p.genero}</span>;
              if (columnId === 'modalidade') return <span className="text-muted-foreground">{p.modalidade}</span>;
              return null;
            }}
            emptyMessage="Nenhum resultado"
            dense
          />
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-3 py-2 border-t border-border mt-4">
              <span className="text-[10px] text-muted-foreground">{filteredAudience.length} resultados</span>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-2 py-1 text-[10px] rounded-md hover:bg-surface-overlay disabled:opacity-30">Anterior</button>
                <span className="text-[10px] text-muted-foreground">{page}/{totalPages}</span>
                <button type="button" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-2 py-1 text-[10px] rounded-md hover:bg-surface-overlay disabled:opacity-30">Próxima</button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
