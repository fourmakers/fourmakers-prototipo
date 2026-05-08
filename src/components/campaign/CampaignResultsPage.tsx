import { useState, useMemo } from 'react';
import { ArrowLeft, Download, Search, Lightbulb, GitCompare, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/common';
import { Campaign, STATUS_CONFIG, QUESTION_TYPE_OPTIONS, MOCK_CAMPAIGNS } from './campaignData';
import { Progress } from '@/components/ui/progress';

interface Props {
  campaign: Campaign;
  onBack: () => void;
}

function formatBR(d: string) {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

// Generate mock insights based on campaign data
function generateInsights(campaign: Campaign): string[] {
  const insights: string[] = [];
  const { respondentes, totalImpactados, totalRespostas } = campaign;
  const taxa = totalImpactados > 0 ? Math.round((totalRespostas / totalImpactados) * 100) : 0;

  if (taxa >= 70) {
    insights.push(`A taxa de adesão de ${taxa}% indica alto engajamento dos colaboradores nesta campanha.`);
  } else if (taxa < 40) {
    insights.push(`A taxa de adesão de ${taxa}% está abaixo do esperado. Considere enviar lembretes ou ampliar o período.`);
  }

  // Analyze by area
  const areaCounts: Record<string, number> = {};
  respondentes.forEach(r => { areaCounts[r.area] = (areaCounts[r.area] || 0) + 1; });
  const topArea = Object.entries(areaCounts).sort((a, b) => b[1] - a[1])[0];
  if (topArea) {
    insights.push(`A área de ${topArea[0]} teve a maior participação com ${topArea[1]} respostas.`);
  }

  // Analyze by location
  const localCounts: Record<string, number> = {};
  respondentes.forEach(r => { localCounts[r.localTrabalho] = (localCounts[r.localTrabalho] || 0) + 1; });
  const topLocal = Object.entries(localCounts).sort((a, b) => b[1] - a[1])[0];
  if (topLocal) {
    insights.push(`A unidade ${topLocal[0]} teve a maior taxa de resposta da campanha.`);
  }

  // Tempo de empresa insight
  const tempoResps = respondentes.filter(r => r.tempoEmpresa);
  if (tempoResps.length > 0) {
    const tempoCounts: Record<string, number> = {};
    tempoResps.forEach(r => { tempoCounts[r.tempoEmpresa!] = (tempoCounts[r.tempoEmpresa!] || 0) + 1; });
    const topTempo = Object.entries(tempoCounts).sort((a, b) => b[1] - a[1])[0];
    if (topTempo) {
      insights.push(`Colaboradores com ${topTempo[0].toLowerCase()} de empresa representam a maior participação.`);
    }
  }

  // Gender insight
  const genderCounts: Record<string, number> = {};
  respondentes.forEach(r => { if (r.genero) genderCounts[r.genero] = (genderCounts[r.genero] || 0) + 1; });
  const genderEntries = Object.entries(genderCounts);
  if (genderEntries.length >= 2) {
    insights.push(`Participação por gênero: ${genderEntries.map(([g, c]) => `${g} (${c})`).join(', ')}.`);
  }

  if (insights.length === 0) {
    insights.push('Dados insuficientes para gerar insights automáticos. Aguarde mais respostas.');
  }

  return insights;
}

export function CampaignResultsPage({ campaign, onBack }: Props) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'nome' | 'area' | 'localTrabalho' | 'dataResposta'>('dataResposta');
  const [sortAsc, setSortAsc] = useState(false);

  // Analytical filters
  const [filterLocal, setFilterLocal] = useState('');
  const [filterGenero, setFilterGenero] = useState('');
  const [filterArea, setFilterArea] = useState('');
  const [filterTempo, setFilterTempo] = useState('');

  // Comparison
  const [compareCampaignId, setCompareCampaignId] = useState('');

  const taxa = campaign.totalImpactados > 0 ? Math.round((campaign.totalRespostas / campaign.totalImpactados) * 100) : 0;
  const cfg = STATUS_CONFIG[campaign.status];

  const daysRemaining = useMemo(() => {
    if (campaign.status !== 'ativa') return null;
    const end = new Date(campaign.endDate);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, [campaign]);

  // Get unique values for analytical filters
  const uniqueLocals = useMemo(() => [...new Set(campaign.respondentes.map(r => r.localTrabalho))], [campaign.respondentes]);
  const uniqueGeneros = useMemo(() => [...new Set(campaign.respondentes.filter(r => r.genero).map(r => r.genero!))], [campaign.respondentes]);
  const uniqueAreas = useMemo(() => [...new Set(campaign.respondentes.map(r => r.area))], [campaign.respondentes]);
  const uniqueTempos = useMemo(() => [...new Set(campaign.respondentes.filter(r => r.tempoEmpresa).map(r => r.tempoEmpresa!))], [campaign.respondentes]);

  const filteredRespondentes = useMemo(() => {
    let list = campaign.respondentes;
    if (filterLocal) list = list.filter(r => r.localTrabalho === filterLocal);
    if (filterGenero) list = list.filter(r => r.genero === filterGenero);
    if (filterArea) list = list.filter(r => r.area === filterArea);
    if (filterTempo) list = list.filter(r => r.tempoEmpresa === filterTempo);
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(r => r.nome.toLowerCase().includes(s) || r.area.toLowerCase().includes(s) || r.localTrabalho.toLowerCase().includes(s));
    }
    return list;
  }, [campaign.respondentes, search, filterLocal, filterGenero, filterArea, filterTempo]);

  const handleExportCSV = () => {
    const header = 'Nome,Área,Local,Cargo,Gênero,Modalidade,Tempo Empresa,Data Resposta\n';
    const rows = filteredRespondentes.map(r =>
      `${r.nome},${r.area},${r.localTrabalho},${r.cargo || ''},${r.genero || ''},${r.modalidade || ''},${r.tempoEmpresa || ''},${formatBR(r.dataResposta)}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resultados-${campaign.title.replace(/\s+/g, '-').toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Mock chart data per question (updated with filters)
  const questionCharts = campaign.questions.map(q => {
    const options = q.options || ['Sim', 'Não', 'N/A'];
    const total = filteredRespondentes.length || campaign.totalRespostas;
    const values = options.map((_, i) => Math.max(1, Math.round(total / options.length + (i % 2 === 0 ? 5 : -3))));
    return { question: q, options, values };
  });

  // Insights
  const insights = useMemo(() => generateInsights(campaign), [campaign]);

  // Historical comparison
  const comparableCampaigns = useMemo(() => {
    return MOCK_CAMPAIGNS.filter(c =>
      c.id !== campaign.id &&
      c.tipoCampanha === campaign.tipoCampanha &&
      (c.status === 'concluida' || c.status === 'arquivada' || c.status === 'ativa')
    );
  }, [campaign]);

  const compareCampaign = compareCampaignId ? MOCK_CAMPAIGNS.find(c => c.id === compareCampaignId) : null;

  const hasAnalyticalFilters = filterLocal || filterGenero || filterArea || filterTempo;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-surface-overlay transition-colors text-muted-foreground">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="page-title">Resultados: {campaign.title}</h1>
          <p className="page-subtitle mt-0.5">Análise completa da campanha</p>
        </div>
        <span className={`ml-auto inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md ${cfg.color} ${cfg.bg}`}>
          {cfg.label}
        </span>
      </div>

      {/* Progress */}
      <div className="bg-surface-elevated border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-foreground">Progresso da Campanha</span>
          <span className="text-sm font-semibold text-primary">{taxa}%</span>
        </div>
        <Progress value={taxa} className="h-2.5" />
        <div className="flex items-center justify-between mt-3 text-[11px] text-muted-foreground">
          <span>Início: {formatBR(campaign.startDate)}</span>
          <span>Fim: {formatBR(campaign.endDate)}</span>
        </div>
        {daysRemaining !== null && (
          <p className="text-[11px] text-warning mt-1 text-center">{daysRemaining} dias restantes</p>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <SummaryCard label="Público Impactado" value={campaign.totalImpactados} />
        <SummaryCard label="Total Respondentes" value={campaign.totalRespostas} />
        <SummaryCard label="Adesão" value={`${taxa}%`} />
      </div>

      {/* Insights */}
      <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb size={14} className="text-accent" />
          <p className="text-xs font-semibold text-foreground">Insights Automáticos</p>
        </div>
        <div className="space-y-2">
          {insights.map((insight, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-accent text-[10px] mt-0.5">▸</span>
              <p className="text-[11px] text-foreground leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Analytical Filters */}
      <div className="bg-surface-elevated border border-border rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Filter size={14} className="text-primary" />
          <p className="text-xs font-semibold text-foreground">Cruzamento Analítico</p>
          {hasAnalyticalFilters && (
            <button
              onClick={() => { setFilterLocal(''); setFilterGenero(''); setFilterArea(''); setFilterTempo(''); }}
              className="ml-auto text-[10px] text-destructive hover:underline"
            >
              Limpar filtros
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <AnalyticalSelect label="Unidade" value={filterLocal} onChange={setFilterLocal} options={uniqueLocals} />
          <AnalyticalSelect label="Gênero" value={filterGenero} onChange={setFilterGenero} options={uniqueGeneros} />
          <AnalyticalSelect label="Área" value={filterArea} onChange={setFilterArea} options={uniqueAreas} />
          {uniqueTempos.length > 0 && (
            <AnalyticalSelect label="Tempo de empresa" value={filterTempo} onChange={setFilterTempo} options={uniqueTempos} />
          )}
        </div>
        {hasAnalyticalFilters && (
          <p className="text-[10px] text-muted-foreground">
            Mostrando {filteredRespondentes.length} de {campaign.respondentes.length} respondentes
          </p>
        )}
      </div>

      {/* Charts per question */}
      {questionCharts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Gráficos por pergunta</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {questionCharts.map(({ question, options, values }) => {
              const max = Math.max(...values);
              return (
                <div key={question.id} className="bg-surface-elevated border border-border rounded-xl p-4">
                  <p className="text-xs font-medium text-foreground mb-3">{question.text}</p>
                  <div className="space-y-2">
                    {options.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground w-24 truncate">{opt}</span>
                        <div className="flex-1 h-4 bg-muted rounded-md overflow-hidden">
                          <div
                            className="h-full bg-primary/60 rounded-md transition-all"
                            style={{ width: `${max > 0 ? (values[i] / max) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-foreground font-medium w-8 text-right">{values[i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Historical Comparison */}
      {comparableCampaigns.length > 0 && (
        <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <GitCompare size={14} className="text-info" />
            <p className="text-xs font-semibold text-foreground">Evolução Histórica</p>
          </div>
          <p className="text-[10px] text-muted-foreground">Compare com campanhas anteriores do mesmo tipo:</p>
          <select
            value={compareCampaignId}
            onChange={e => setCompareCampaignId(e.target.value)}
            className="px-3 py-1.5 text-xs bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
          >
            <option value="">Selecionar campanha para comparar</option>
            {comparableCampaigns.map(c => (
              <option key={c.id} value={c.id}>{c.title} ({formatBR(c.startDate)})</option>
            ))}
          </select>

          {compareCampaign && (
            <div className="grid grid-cols-2 gap-3 mt-2">
              <CompareCard
                label="Campanha Atual"
                campaign={campaign}
                highlight
              />
              <CompareCard
                label={compareCampaign.title}
                campaign={compareCampaign}
              />
            </div>
          )}
        </div>
      )}

      {/* Respondentes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Respondentes</span>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..."
                className="pl-7 pr-3 py-1.5 text-xs bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary w-48" />
            </div>
            <button onClick={handleExportCSV} className="flex items-center gap-1 px-3 py-1.5 text-xs text-primary hover:bg-primary/10 rounded-lg transition-colors border border-border">
              <Download size={13} /> Exportar CSV
            </button>
          </div>
        </div>

        <Card className="rounded-xl">
          <CardContent className="p-6">
            <DataTable<typeof campaign.respondentes[0]>
              columns={[
                { id: 'nome', label: 'Nome', sortable: true },
                { id: 'area', label: 'Área', sortable: true },
                { id: 'localTrabalho', label: 'Local', sortable: true },
                { id: 'genero', label: 'Gênero', sortable: true },
                { id: 'dataResposta', label: 'Data', sortable: true },
              ]}
              data={filteredRespondentes}
              keyExtractor={(r) => `${r.nome}-${r.dataResposta}`}
              renderCell={(r, columnId) => {
                if (columnId === 'nome') return <span className="text-foreground font-medium">{r.nome}</span>;
                if (columnId === 'area') return <span className="text-muted-foreground">{r.area}</span>;
                if (columnId === 'localTrabalho') return <span className="text-muted-foreground">{r.localTrabalho}</span>;
                if (columnId === 'genero') return <span className="text-muted-foreground">{r.genero || '—'}</span>;
                if (columnId === 'dataResposta') return <span className="text-muted-foreground">{formatBR(r.dataResposta)}</span>;
                return null;
              }}
              emptyMessage="Nenhum respondente encontrado"
              defaultSort={{ columnId: 'dataResposta', direction: 'desc' }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-surface-elevated border border-border rounded-xl p-3.5 text-center">
      <p className="text-lg font-bold text-foreground">{value}</p>
      <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}

function AnalyticalSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="h-7 px-2 text-[11px] rounded-lg border border-border bg-surface text-foreground appearance-none cursor-pointer hover:border-primary/40 transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
    >
      <option value="">{label}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function CompareCard({ label, campaign, highlight }: { label: string; campaign: Campaign; highlight?: boolean }) {
  const taxa = campaign.totalImpactados > 0 ? Math.round((campaign.totalRespostas / campaign.totalImpactados) * 100) : 0;
  return (
    <div className={cn(
      'rounded-lg border p-3 space-y-2',
      highlight ? 'bg-primary/5 border-primary/20' : 'bg-surface-elevated border-border'
    )}>
      <p className="text-[11px] font-semibold text-foreground truncate">{label}</p>
      <div className="space-y-1 text-[10px]">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Impactados</span>
          <span className="text-foreground font-medium">{campaign.totalImpactados}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Respostas</span>
          <span className="text-foreground font-medium">{campaign.totalRespostas}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Adesão</span>
          <span className={cn('font-semibold', taxa >= 60 ? 'text-success' : taxa >= 40 ? 'text-warning' : 'text-destructive')}>{taxa}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Período</span>
          <span className="text-foreground">{formatBR(campaign.startDate)} – {formatBR(campaign.endDate)}</span>
        </div>
      </div>
    </div>
  );
}
