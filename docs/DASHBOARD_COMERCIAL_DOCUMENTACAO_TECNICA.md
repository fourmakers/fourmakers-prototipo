# Dashboard Comercial – Documentação Técnica (Regras de Negócio e Backend)

Documento **único e autocontido** para o protótipo **Dashboard comercial — Qualidade da base** no repositório `prototipo-fourmakers`: alinha **React (mock)**, **backend .NET 8** e **integração futura** no app principal. Não existem anexos obrigatórios nem segundo ficheiro de doc para esta feature.

- **Criado em:** 08/05/2026  
- **Última atualização:** 08/05/2026 (fusão num único Markdown; APIs e modelos completos inline; remoção de doc duplicada)

---

## §0. Como usar este documento

| Audiência | Secções prioritárias | Uso |
|-----------|---------------------|-----|
| Produto / UX | §2, §3, §5 UX, secções 7–9, §9 FAQ | Jornada, estados de UI, tom |
| Frontend (protótipo) | §1, §6, §8, §13 | Rotas, árvore de ficheiros, QA manual |
| Frontend (app principal) | §6, §7, §18, APIs §10 | Contratos, migração DS |
| Backend .NET | §4–§6, §10–§13, §15–§16, **Sugestões para integração** | Envelope, DTOs, fluxos |
| QA / Automação | §8 | `data-testid` e cenários |
| IA / busca | §10 — Consumo por IA | Chunking e sinónimos |

---

## §1. Visão no hub de protótipos

| Campo | Valor |
|-------|--------|
| **Rota (protótipo)** | `/prototipo/dashboard-comercial` |
| **Rota alvo (app principal)** | `/dashboard-comercial` ou equivalente ao módulo comercial (a confirmar com o time) |
| **Registo** | `PROTOTIPO_REGISTRY` → `id`: `dashboard-comercial-qualidade-base`, `routeSlug`: `dashboard-comercial` |
| **Componente de página** | `DashboardComercialQualidadeBasePage` em `src/prototipo/dashboard-comercial/DashboardComercialQualidadeBasePage.tsx` |
| **Mocks / tipos** | `mockQualidadeBase.ts`, `types.ts`, `nivelUi.tsx` |
| **Doc para download na home** | `documentationMarkdownFile`: `DASHBOARD_COMERCIAL_DOCUMENTACAO_TECNICA.md` |

---

## §2. Jornada do utilizador

1. Abre o hub e escolhe o card **Dashboard comercial** (ou menu **Protótipos → Dashboard comercial**).
2. Vê filtros (período, cliente, comercial), KPIs em grid e área para painéis de detalhe e semáforo.
3. Ajusta filtros; a UI simula recarga (~450 ms) e atualiza números (mock).
4. Se **data início > data fim**, mensagem inline de erro e inputs em estado de erro — sem dados até corrigir.
5. Clica num **KPI**: abre painel correspondente; foco no **Fechar painel de detalhe**; outro KPI fecha o anterior.
6. Clica no **semáforo** (segmento ou legenda): lista da faixa; só um painel KPI ou semáforo ativo.
7. **Limpar filtros** repõe período (60 dias → hoje) e "Todos".
8. **Ver perfil** / **Ver todos** são protótipo sem navegação real.

---

## §3. Checklist de funcionalidades (protótipo)

| Funcionalidade | Estado | Notas |
|----------------|--------|--------|
| Filtros data início/fim | Feito | Validação no cliente |
| Filtros cliente / comercial | Feito | Texto perfil comercial vs gestor |
| Cinco KPIs clicáveis | Feito | `aria-expanded`, `aria-controls`, região por painel |
| Painéis de detalhe | Feito | `role="region"`, foco no fechar |
| Semáforo C-Level/Decisor | Feito | Teclado e `aria-pressed` nas legendas |
| Estados loading / vazio / erro período | Feito | Live region, skeleton, mensagem KPI zero |
| URLs com query | Não | §12 |
| API real | Não | §10 sugerido |

---

## 2. Visão geral e objetivo

### Objetivos principais

- Centralizar indicadores de qualidade do relacionamento comercial com stakeholders de clientes ativos.
- Dar visibilidade a lacunas (orçamento e desafio 2026, visitas em C-Level/Decisor).
- Permitir exploração do agregado ao detalhe **inline** (sem troca de rota no protótipo).

### Tabela resumida

| Item | Descrição |
|------|-----------|
| **Rota (protótipo)** | `/prototipo/dashboard-comercial` |
| **Título** | Dashboard comercial |
| **Descrição (UI)** | Radar de relacionamento — KPIs de saúde, alcance e gráficos |
| **Objetivo de negócio** | Priorizar ações comerciais (risco de esfriamento, gaps cadastrais). |
| **Escopo v1** | Cinco KPIs, semáforo de recência, painéis expansíveis, filtros. Fora: edição inline, push, export CSV (evolução §14). |

### Personas

| Persona | Experiência |
|---------|-------------|
| **Comercial** | Carteira filtrada; identifica visitas e dados em falta. |
| **Gestor** | Visão consolidada; filtra por comercial. |

---

## 3. Parâmetros de entrada e contexto

### Autenticação

`Authorization: Bearer {token}`. Perfil (comercial vs gestor) define visibilidade.

### Query (produção)

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `dataInicio` | string (YYYY-MM-DD) | Não | Default: hoje − 60 dias. |
| `dataFim` | string (YYYY-MM-DD) | Não | Default: hoje. |
| `clienteId` | number \| null | Não | Null = todos. |
| `comercialId` | number \| null | Não | Null = todos (só gestor altera). |

**Validação:** `dataInicio > dataFim` → `sucesso: false` + mensagem alinhada à UX do protótipo.

### Dependências de dados existentes

- Lista de clientes ativos (filtro cliente).
- Colaboradores com perfil comercial (filtro comercial).
- Stakeholders por cliente (níveis, orçamento/desafio 2026).
- Histórico de interações / visitas.

---

## 4. Padrões de contratos do projeto (consistência)

| Aspecto | Padrão | Uso |
|---------|--------|-----|
| **Nomenclatura JSON** | camelCase | `codigoInternoColaborador`, `dataCriacao` |
| **Envelope** | `retorno`, `sucesso`, `mensagem`, `erros` | Todas as respostas |
| **Datas** | `dataCriacao`, `dataAlteracao` | ISO ou YYYY-MM-DD |
| **Colaborador** | `codigoInternoColaborador` | Mapear `codigoColaboradorInterno` legado se existir |
| **Erros** | `erros?: string[] \| null` | Validação |

### Envelope

```json
{
  "retorno": {},
  "sucesso": true,
  "mensagem": null,
  "erros": null
}
```

---

## 5. Regras de negócio

### 5.1 Níveis hierárquicos

| Código | Label UI | Descrição |
|--------|----------|-----------|
| `cLevel` | C-Level | VP, CTO, CIO, CEO, Diretor executivo |
| `decisor` | Decisor | Diretor, Head — autoridade de compra |
| `influenciador` | Influenciador | Gerente sênior |
| `operacional` | Operacional | Coordenador, analista |
| `semClassificacao` | s/ classif. | Sem nível definido |

### 5.2 Semáforo (recência — apenas C-Level / Decisor)

| Faixa | Cor | Significado |
|-------|-----|-------------|
| Até 30 dias | Verde | Relacionamento ativo |
| 31–60 dias | Âmbar | Atenção |
| 61–90 dias | Vermelho | Risco de esfriamento |
| 90+ dias | Vermelho escuro | Risco crítico |

### 5.3 Regras críticas dos KPIs

- **C-Level / Decisor sem visita 60+ dias:** só `cLevel` e `decisor`; última interação ou, se ausente, **base em `dataCriacao`**.
- **Sem orçamento 2026:** campo não preenchido (null); **zero explícito** — alinhar com produto se conta como preenchido ou não.
- **Sem desafio 2026:** null ou string vazia.
- **Orçamento total 2026:** soma dos valores preenchidos (parcial na UI); cobertura = com orçamento / total stakeholders do filtro.
- **Visibilidade:** comercial só carteira; gestor vê todos.
- **Auditoria:** ao alterar `orcamento2026` / `desafio2026`, registar `dataAlteracao` e `codigoInternoColaborador` do editor.

### §4. Cruzamento com mocks

Fontes: `MOCK_RESUMO`, `MOCK_POR_CLIENTE`, `MOCK_STAKEHOLDERS_POR_FILTRO`. Alteração de regra ⇒ atualizar tipos, mocks e este documento.

---

## 6. Fluxos por persona

- **Comercial:** dashboard → KPIs → painel → "Ver perfil" (rota real a definir).
- **Gestor:** idem + filtro por `comercialId`.

---

## 7. Funcionalidades, UX e eventos

### 7.1 Filtros

- Abertura: `dataInicio` = hoje − 60 dias, `dataFim` = hoje, cliente e comercial "Todos" (ou comercial fixo ao utilizador).
- Alteração: recalcular resumo (no protótipo: timeout mock).
- Limpar: defaults + recarga.

### 7.2 Cards KPI (cinco)

Um painel de cada vez; clicar no ativo fecha. Ver §3 para mapeamento cartão → painel.

### 7.3 Semáforo

Segmento ou legenda abre painel da faixa; mesmo segmento ativo fecha.

### 7.4 Estados (protótipo vs produção)

| Estado | Comportamento |
|--------|---------------|
| Carregando | Skeleton; live region `aria-busy` |
| Sucesso | Valores e semáforo |
| Período inválido | Banner + inputs erro; sem mock |
| Vazio | Mensagem positiva (KPIs principais zero) |
| Erro API | Toast; cartões "—" (produção) |
| Painel | Um KPI **ou** um semáforo |

### §5. UX, UI e DS (protótipo)

Componentes em `src/components/ui`; tokens apenas. Detalhe de acessibilidade: §8 QA e revisão UX em §3 da checklist.

---

## 8. Regras de sucesso, erro e bloqueios (UX)

### Sucesso

Recarga discreta; limpar filtros idem; navegação futura "Ver perfil" sem toast desnecessário.

### Erros (mensagens sugeridas)

| Cenário | UI | `mensagem` (API) |
|---------|-----|------------------|
| Falha KPIs | Toast; "—" nos cards | "Não foi possível carregar os indicadores. Tente novamente." |
| Falha painel | Inline no painel | "Erro ao carregar detalhes. Tente novamente." |
| Token expirado | Redirect login | — |
| Sem carteira | Estado vazio | "Você ainda não possui clientes vinculados." |

### Bloqueios

Filtro **Comercial** editável só para gestor; comercial com valor fixo ao próprio utilizador.

---

## 9. Linguagem e tom

Tom direto e operacional; positivo. Usar "Stakeholders sem orçamento", "Ação recomendada", "Risco de esfriamento". Números em pt-BR. Labels conforme §5.1.

---

## 10. APIs necessárias (backend .NET 8) — sugeridas

Prefixo exemplo: `/dashboard-comercial/qualidade-base/`. Todas com envelope.

### 10.1 `GET .../resumo`

**Query:** `dataInicio`, `dataFim`, `clienteId?`, `comercialId?`

**200:**

```json
{
  "retorno": {
    "totalStakeholders": 347,
    "totalClientes": 23,
    "semOrcamento2026": { "quantidade": 146, "percentual": 42.1 },
    "semDesafio2026": { "quantidade": 205, "percentual": 59.1 },
    "cLevelDecisorSemVisita60Dias": { "quantidade": 12 },
    "orcamentoTotal2026": {
      "valorMapeadoReais": 80200000,
      "percentualCobertura": 58.0
    },
    "semaforo": {
      "ate30Dias": 38,
      "de31a60Dias": 24,
      "de61a90Dias": 19,
      "acima90Dias": 12
    }
  },
  "sucesso": true,
  "mensagem": null,
  "erros": null
}
```

**C# (resumo):**

```csharp
public class QualidadeBaseResumoDto {
    public int TotalStakeholders { get; set; }
    public int TotalClientes { get; set; }
    public KpiContagemDto SemOrcamento2026 { get; set; } = default!;
    public KpiContagemDto SemDesafio2026 { get; set; } = default!;
    public CLevelDecisorAlertaDto CLevelDecisorSemVisita60Dias { get; set; } = default!;
    public KpiOrcamentoDto OrcamentoTotal2026 { get; set; } = default!;
    public SemaforoResumoDto Semaforo { get; set; } = default!;
}
public class CLevelDecisorAlertaDto { public int Quantidade { get; set; } }
public class KpiContagemDto { public int Quantidade { get; set; } public decimal Percentual { get; set; } }
public class KpiOrcamentoDto { public decimal ValorMapeadoReais { get; set; } public decimal PercentualCobertura { get; set; } }
public class SemaforoResumoDto {
    public int Ate30Dias { get; set; }
    public int De31A60Dias { get; set; }
    public int De61A90Dias { get; set; }
    public int Acima90Dias { get; set; }
}
```

### 10.2 `GET .../stakeholders`

**Query:** `dataInicio`, `dataFim`, `clienteId?`, `comercialId?`, `filtro` (`semOrcamento`, `semDesafio`, `semVisita60`, `semaforoVerde`, `semaforoAmbar`, `semaforoVermelho`, `semaforo90mais`), `pagina?`, `tamanhoPagina?`

**200:**

```json
{
  "retorno": {
    "total": 146,
    "pagina": 1,
    "tamanhoPagina": 20,
    "itens": [
      {
        "id": 1021,
        "nomeColaborador": "João Martins",
        "codigoInternoColaborador": "COL-0421",
        "empresa": "Bradesco",
        "cargo": "Diretor de Infraestrutura",
        "nivel": "cLevel",
        "diasSemVisita": 94,
        "orcamento2026": null,
        "desafio2026": null,
        "dataCriacao": "2024-03-10"
      }
    ]
  },
  "sucesso": true,
  "mensagem": null,
  "erros": null
}
```

**C#:**

```csharp
public class StakeholderDetalheDto {
    public int Id { get; set; }
    public string NomeColaborador { get; set; } = "";
    public string CodigoInternoColaborador { get; set; } = "";
    public string Empresa { get; set; } = "";
    public string Cargo { get; set; } = "";
    public string Nivel { get; set; } = "";
    public int? DiasSemVisita { get; set; }
    public decimal? Orcamento2026 { get; set; }
    public string? Desafio2026 { get; set; }
    public string DataCriacao { get; set; } = "";
}
```

### 10.3 `GET .../por-cliente`

**Query:** `dataInicio`, `dataFim`, `comercialId?`

**200:**

```json
{
  "retorno": [
    {
      "clienteId": 10,
      "nomeCliente": "Bradesco",
      "totalStakeholders": 42,
      "porNivel": {
        "cLevel": 6,
        "decisor": 11,
        "influenciador": 9,
        "operacional": 8,
        "semClassificacao": 8
      },
      "orcamentoMapeadoReais": 28400000,
      "percentualCobertura": 71.0,
      "stakeholdersComOrcamento": 30,
      "semDesafio": 15,
      "percentualSemDesafio": 35.7
    }
  ],
  "sucesso": true,
  "mensagem": null,
  "erros": null
}
```

**C#:**

```csharp
public class StakeholderPorClienteDto {
    public int ClienteId { get; set; }
    public string NomeCliente { get; set; } = "";
    public int TotalStakeholders { get; set; }
    public NivelBreakdownDto PorNivel { get; set; } = default!;
    public decimal OrcamentoMapeadoReais { get; set; }
    public decimal PercentualCobertura { get; set; }
    public int StakeholdersComOrcamento { get; set; }
    public int SemDesafio { get; set; }
    public decimal PercentualSemDesafio { get; set; }
}
public class NivelBreakdownDto {
    public int CLevel { get; set; }
    public int Decisor { get; set; }
    public int Influenciador { get; set; }
    public int Operacional { get; set; }
    public int SemClassificacao { get; set; }
}
```

---

## 11. Modelos de dados (domínio stakeholder)

| Propriedade | Tipo | Obrigatório | Descrição |
|-------------|------|-------------|-----------|
| `id` | number | Sim | Identificador |
| `nomeColaborador` | string | Sim | Nome |
| `codigoInternoColaborador` | string | Sim | Código único |
| `empresa` | string | Sim | Cliente |
| `cargo` | string | Não | Cargo |
| `nivel` | enum string | Não | Ver §5.1 |
| `orcamento2026` | decimal? | Não | Null = não preenchido |
| `desafio2026` | string? | Não | Null/vazio = não preenchido |
| `diasSemVisita` | number? | Não | Calculado no servidor |
| `dataCriacao` | string | Sim | YYYY-MM-DD |
| `dataAlteracao` | string? | Não | Auditoria |

Espelho TypeScript: `src/prototipo/dashboard-comercial/types.ts`.

---

## 12. Dependências e fluxo backend (resumo)

1. `GET .../resumo` com filtros default.  
2. Validar token; comercial ⇒ ignorar `comercialId` externo e aplicar carteira.  
3. Agregar stakeholders + interações; semáforo só C-Level/Decisor.  
4. Painéis: `GET .../stakeholders?filtro=...` com ordenação (ex.: `semVisita60` por `diasSemVisita` DESC).  
5. "Ver todos": listagem do produto com mesma API e paginação.

---

## 13. Propostas de melhoria e evolução

- Paginação server-side nos painéis; filtros na URL.  
- Exportação CSV/Excel; notificações aos 45 dias sem visita.  
- Edição inline orçamento/desafio; drill-down por nível; ordenação em tabelas; meta de cobertura configurável.

---

## 14. Cenários de erro e pontos de atenção

| Cenário | Tratamento |
|---------|------------|
| Sem interação nunca | Base em `dataCriacao`; opcional flag `semInteracaoRegistrada` |
| Cliente com 0 stakeholders | Percentuais 0; sem divisão por zero |
| `comercialId` por não-gestor | Servidor ignora e usa token |
| Orçamento zero vs null | Decisão de produto obrigatória |
| Volume alto | Índices em `clienteId`, `nivel`, última interação |
| Período amplo | Limite (ex.: 12 meses) + erro claro |

---

## 15. Resumo para o time

**Uma frase:** Qualidade da base no Dashboard comercial — cinco KPIs, semáforo de visitas (C-Level/Decisor), painéis inline; protótipo com mocks em `src/prototipo/dashboard-comercial/`.

**APIs a implementar:** `resumo`, `stakeholders`, `por-cliente` (§10).

**Contratos:** camelCase; envelope padrão; `codigoInternoColaborador`; `dataCriacao` / `dataAlteracao`.

---

## 16. Rodapé do documento

- **Ficheiro canónico (único):** `docs/DASHBOARD_COMERCIAL_DOCUMENTACAO_TECNICA.md`  
- **Encoding:** UTF-8  
- **Exportação para outros projetos:** download na home do hub (`documentationMarkdownFile` no `registry`) ou cópia deste ficheiro.

---

## §6. Arquitetura frontend (protótipo)

```
registry.ts (PROTOTIPO_REGISTRY)
  └── DashboardComercialQualidadeBasePage.tsx
        ├── nivelUi.tsx
        ├── types.ts
        └── mockQualidadeBase.ts
```

Integração futura: cliente HTTP + hooks alinhados ao app principal.

---

## §7. Integração backend (responsabilidades)

| Área | Servidor |
|------|----------|
| Escopo | Carteira e perfil |
| KPIs | Mesmas regras nos cards e nos painéis |
| Listas | Paginação e filtros consistentes |
| Auditoria | Alterações em campos 2026 |

---

## §8. QA — `data-testid`

| `data-testid` | Elemento |
|---------------|----------|
| `prototipo-dashboard-comercial-page` | Raiz |
| `dashboard-comercial-card-filtros` | Filtros |
| `dashboard-comercial-filtro-data-inicio` | Data início |
| `dashboard-comercial-filtro-data-fim` | Data fim |
| `dashboard-comercial-filtro-cliente` | Cliente |
| `dashboard-comercial-filtro-comercial` | Comercial |
| `dashboard-comercial-limpar-filtros` | Limpar |
| `dashboard-comercial-kpi-grid` | Grelha KPIs |
| `dashboard-comercial-kpi-{id}` | Cada KPI |
| `dashboard-comercial-semaforo` | Semáforo |
| `dashboard-comercial-ver-perfil-{id}` | Ver perfil |
| `dashboard-comercial-ver-todos-{entidade}` | Ver todos |

---

## §9. FAQ

| Pergunta | Resposta |
|----------|----------|
| Foco no "Fechar"? | Acessibilidade — saída explícita do painel. |
| Comercial escolhe outro comercial? | Protótipo sim; produção deve bloquear no backend. |
| Números reais? | Não; mocks locais. |
| Semáforo inclui Influenciador? | Não. |
| "Ver perfil" funciona? | Placeholder até haver rota. |

---

## §10 — Consumo por IA

Chunk por secção; sinónimos: "qualidade da base", "semáforo visitas", "orçamento 2026". Limitação: mocks e rotas `/prototipo/*`.

---

## §11. Métricas (opcional)

Tempo até abrir primeiro painel; uso do filtro comercial por gestores.

---

## §12. Dívidas técnicas

URL state; toast de API real; E2E; política do zero em orçamento.

---

## §13. Referências no repositório

- `PROTOTIPACAO.md`, `public/design-toolkit.md`  
- `docs/ORIENTACAO_DOCUMENTACAO_TECNICA_PROTOTIPOS_EXTERNOS.md`  
- `docs/_MODELO_MEUS_TALENTOS_DOCUMENTACAO_TECNICA.md` (guia de formato, não é doc da feature)  
- `src/prototipo/registry.ts`, `src/prototipo/dashboard-comercial/*`

---

## §18. Notas de migração para o projeto principal

### Design System

- Cards KPI: componente de métrica do DS; cores semânticas (alerta, atenção, neutro, teal).  
- Semáforo: barra segmentada proporcional (componente DS se existir).  
- Painéis: Accordion/Collapse se aplicável.  
- Avatar iniciais, Badge de nível, barras de cobertura com Progress do DS.

### Estado e URL

- Painel ativo em estado local (ou padrão do app).  
- Refletir filtros em query params para partilha e histórico.

### Posicionamento

- Secção "Qualidade da Base" entre KPIs de Saúde/Alcance existentes e gráficos, quando integrado no dashboard completo.

---

## Sugestões para integração (lacunas)

### Condicionais

- Gestor: pode usar `comercialId`.  
- Comercial: servidor ignora `comercialId` externo.  
- Período máximo sugerido (ex.: 12 meses):

```json
{
  "retorno": null,
  "sucesso": false,
  "mensagem": "Período máximo permitido é de 12 meses.",
  "erros": ["dataInicio", "dataFim"]
}
```

### Validação BMAD (síntese)

| Critério | Estado |
|----------|--------|
| Regras + contratos neste ficheiro | OK |
| Doc único por protótipo | OK |
| API implementada | Pendente |

---

*Projeto **prototipo-fourmakers**. Documentação técnica autocontida — sem dependência de segundo `.md` para esta feature.*
