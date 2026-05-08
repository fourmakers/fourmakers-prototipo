# Meus talentos — Documentação técnica e fonte da verdade da feature

Documentação **multi-audiência** da tela **Meus talentos** (`/recrutamento/meustalentos`): treinamento, desenvolvimento front/back, QA, UX, produto, FAQ escalável e consumo por **IA** (respostas contextualizadas).  
Alinhada a `ARCHITECTURE.md`, `public/design-toolkit.md` e à auditoria em `DESIGN_SYSTEM_AUDIT.md` (timeline Mai 2026 — Meus talentos).

**Última atualização:** mai/2026.

---

## 0. Como usar este documento (mapa de audiências)

| Audiência | Secções prioritárias | Uso |
|-----------|---------------------|-----|
| **Usuário final / treinamento** | §1, §3, §9 (FAQ), §5 (UX resumida) | Onboarding, vídeos, base de ajuda in-app |
| **Negócio / PO / SM** | §1, §4, §11 | Regras, jornada, aceite |
| **Frontend** | §6, §7 (contrato consumido), §8 (testids), §12 | Implementação e regressão |
| **Backend** | §7, §4.3, §12 | Endpoint, modelo, evoluções |
| **QA / Automação** | §8 (completa), §9.2, §6.4 | Casos, Playwright, tour |
| **UX / Design** | §5 | Fluxo, interações, a11y |
| **IA (RAG / assistente)** | §10 | Chunks, sinónimos, respostas canónicas |
| **FAQ dinâmica (tela futura)** | §9 | Modelo **ação → pergunta/resposta** filtrável por feature |

---

## 1. Visão geral e objetivo

### 1.1 Produto e negócio

| Item | Descrição |
|------|------------|
| **Rota** | `/recrutamento/meustalentos` |
| **Nome na UI** | Meus talentos |
| **Objetivo** | Permitir ao **recrutador** consultar, num único ecrã, as **candidaturas sob a sua responsabilidade**, com filtro textual, personalização de colunas, ordenação e paginação **no cliente**, e atalhos para **Perfil 360** e **histórico** sem navegação full-page. |
| **Origem principal** | **Gestão de Vagas** (`/recrutamento`) → **Opções de tela** → **Meus Candidatos** (envia `state.fromRecrutamentoKanban` para exibir botão **Voltar**). |
| **Origens secundárias** | URL direta, breadcrumb, futuro item de menu lateral (requer `flutterflowRouteMap` / API de menu). |

### 1.2 Relação com outras telas

- **Banco de Talentos** (`/recrutamento/talentos`): mesma **família de UX** (busca, DataTable, “Mostrar colunas”, paginação); dados e API **diferentes** (banco org-wide vs lista “meus talentos”).
- **Kanban de vagas**: atalho de entrada; **voltar** contextual quando `location.state.fromRecrutamentoKanban === true`.

---

## 2. Jornada do utilizador (fluxo narrativo)

1. Recrutador está em **Gestão de Vagas** e abre **Opções de tela** → **Meus Candidatos**.
2. A app navega para `/recrutamento/meustalentos` com estado opcional do kanban → aparece **seta Voltar** para `/recrutamento`.
3. A página carrega a lista via **`GET /api/Candidatura/ListarMeusTalentos`** (token).
4. Utilizador pode **buscar** (filtro local), **mostrar/ocultar colunas**, **reordenar colunas** (menu + drag nos headers), **ordenar** por coluna (clique no header — âmbito da página atual).
5. Utilizador ajusta **limite de resultados** (após filtro) e **linhas por página**.
6. **Perfil:** ícone “Ver perfil” → `CurriculoSidebar` (Perfil 360).
7. **Histórico:** ícone relógio → `HistoricoUsuarioSidebar` (mesmo padrão que Banco de Talentos).
8. **Tour guiado:** botão **Tour guiado** no cabeçalho; passos de tabela/paginação só existem quando há **pelo menos uma linha** carregada.

---

## 3. Funcionalidades detalhadas (checklist de produto)

| Funcionalidade | Comportamento |
|----------------|----------------|
| Listagem | Linhas = itens devolvidos pela API; uma linha pode repetir colaborador em vagas distintas (chave composta na UI). |
| Busca | Filtra no **browser** sobre campos agregados (nome, códigos, vaga, status, cliente, gestor, texto de atualizações, etc.). |
| Limite | Corta a lista **após** o filtro; aviso visual se houver truncagem. |
| Paginação | Numérica + anterior/próximo; fatia sobre o conjunto já limitado. |
| Colunas | Persistência em `localStorage` (`fm.recrutamento.meusTalentos.dt`); coluna **Candidato** não ocultável. |
| Ordenação | Por cabeçalho; **apenas sobre dados da página atual** (igual ao Banco de Talentos). |
| Drawers | Perfil 360 e histórico; não substituem rotas `/recrutamento/historico-candidato/...` nesta feature. |
| Voltar | Visível só com `navigate(..., { state: { fromRecrutamentoKanban: true } })`; **perde-se ao refresh**. |
| Tour | `getMeusTalentosTourSteps(includeTableSteps)`; Joyride com locale PT. |

---

## 4. Regras de negócio e dados

### 4.1 Regra de negócio (consolidado)

- **Quem vê:** utilizador autenticado com permissão de aceder ao módulo de recrutamento e ao fluxo que expõe **Opções de tela** no kanban.
- **O que vê:** conjunto definido pelo backend em **`ListarMeusTalentos`** — semanticamente, talentos/candidaturas **sob a responsabilidade** do recrutador logado (detalhe exato de filtro é **regra de servidor**).
- **Consistência:** alterações de estado de candidatura feitas **fora** desta tela refletem-se no próximo **reload** da lista (nova chamada ao sair/voltar ou refresh manual implícito apenas ao reexecutar use case — hoje carrega no mount).

### 4.2 Modelo de domínio (`MeuTalentoItem`)

Fonte: `src/domain/entities/GestaoVagasCandidatos.ts`.

Campos principais expostos na tabela (directamente ou derivados): `nomeColaborador`, `codColaborador`, `codigoVaga`, `nomeVaga`, `statusVaga`, `statusMovimentacao`, `nomeCliente`, `nomeGestor`, `ultimaAlteracao`, `recrutadorUltimaMovimentacao`, `criadoPor`, etc.

### 4.3 Contrato HTTP (referência backend)

| Método | Caminho | Auth |
|--------|---------|------|
| GET | `/api/Candidatura/ListarMeusTalentos` | Bearer token |

**Envelope:** seguir padrão do projeto (`retorno`, `sucesso`, `mensagem`, `erros` quando aplicável). O front espera lista mapeável para `MeuTalentoItem[]` via `CandidaturaRepository` / `CandidaturaApi`.

**Evoluções sugeridas (back):** paginação server-side, filtros (`busca`, `cursor`, `limite`) para volumes grandes; ordenação global antes do slice.

---

## 5. UX, UI e acessibilidade

### 5.1 Princípios

- **Paridade perceptiva** com `/recrutamento/talentos` (toolbar, tabela densa, rodapé de paginação).
- **Feedback:** `Spinner` durante carga; estado vazio legível; toast em falhas de código/ausência de identificador nos drawers.
- **Navegação:** breadcrumb **Recrutamento** sempre leva ao kanban; botão voltar é **atalho** quando há state.

### 5.2 Acessibilidade

- Região da tabela com `role="region"` e `aria-label` descritivo.
- Botões de ícone com `aria-label` (buscar, voltar, paginação).
- Tour: textos em PT; foco gerido pelo Joyride.

### 5.3 Design System (auditoria)

- Componentes `@/components/ui` (Button, Card, Input, Select, Spinner).
- Sem cores Tailwind cruas novas na feature; ícones **`@/components/ui/system-icons`** onde aplicável.
- Sem `fetch` na presentation — apenas Use Case.

---

## 6. Arquitetura frontend

### 6.1 Camadas

```
MeusTalentosOrgPage (página)
  → MeusTalentosPanel (lista + DataTable)
      → ListarMeusTalentosUseCase → CandidaturaRepository → CandidaturaApi → httpClient
  → CurriculoSidebar / HistoricoUsuarioSidebar (componentes existentes)
```

### 6.2 Ficheiros-chave

| Ficheiro | Papel |
|----------|--------|
| `RecrutamentoRoutes.tsx` | Rota `meustalentos`. |
| `MeusTalentosOrgPage.tsx` | Layout, state drawers, tour, voltar condicional. |
| `MeusTalentosPanel.tsx` | Busca, limite, paginação, DataTable, persistência colunas. |
| `GestaoVagas.tsx` | `navigate('/recrutamento/meustalentos', { state })`. |
| `src/shared/tour/steps/meus-talentos.steps.tsx` | Definição dos passos (textos + ícones na lista). |

### 6.3 Estado de rota (`MeusTalentosLocationState`)

```ts
{ fromRecrutamentoKanban?: boolean }
```

### 6.4 Persistência local

| Chave | Conteúdo |
|-------|-----------|
| `fm.recrutamento.meusTalentos.dt` | Ordem/ocultação colunas DataTable (shared com mecanismo `DataTable`). |
| `fm.recrutamento.meusTalentos.dt:sortState` | Ordenação por coluna (suffixo interno do hook `useColumnReorder`). |

---

## 7. Integração backend (.NET / API)

**Responsabilidades recomendadas:**

1. Filtrar candidaturas/talentos **do recrutador autenticado** (ou política equivalente definida pelo produto).
2. Devolver DTO alinhado a `MeuTalentoItem` (camelCase).
3. Garantir performance para N grande (índices, paginação futura).
4. Mensagens claras em `sucesso: false` para erros de autorização ou lista vazia por política.

---

## 8. QA, tour guiado e `data-testid`

### 8.1 Tour (`react-joyride`)

- **Função:** `getMeusTalentosTourSteps(includeTableSteps)` em `src/shared/tour/steps/meus-talentos.steps.tsx`.
- **Comportamento:** `includeTableSteps` é `true` quando o painel terminou loading **e** `lista.length > 0`. Assim evitam-se alvos inexistentes no DOM.
- **Botão:** `data-testid="recrutamento-meus-talentos-tour-button"`.

### 8.2 Mapa de `data-testid` (prioritário para E2E)

| `data-testid` | Elemento |
|---------------|----------|
| `recrutamento-meus-talentos-page` | Container principal da página |
| `recrutamento-meus-talentos-header` | Cabeçalho (título + tour / voltar) |
| `recrutamento-meus-talentos-voltar` | Botão voltar (só quando veio do kanban) |
| `recrutamento-meus-talentos-icone-grupo` | Ícone quando não há voltar contextual |
| `recrutamento-meus-talentos-tour-button` | Inicia tour |
| `recrutamento-meus-talentos-card` | Card da listagem |
| `recrutamento-meus-talentos-toolbar` | Linha busca + preferências |
| `recrutamento-meus-talentos-busca-input` | Campo de busca |
| `recrutamento-meus-talentos-buscar` | Botão confirmar busca |
| `recrutamento-meus-talentos-colunas-trigger` | Wrapper do menu “Mostrar colunas” |
| `recrutamento-meus-talentos-tabela` | Área scrollável da DataTable |
| `recrutamento-meus-talentos-paginacao` | Rodapé (linhas/página, limite, contador, setas) |

**Nota:** Cabeçalhos arrastáveis e células podem usar seletores `role`/`getByRole` ou nth-child; evitar testids dinâmicos por linha salvo necessidade explícita (ver `common-patterns-to-avoid-testid`).

### 8.3 Casos de teste sugeridos (manuais / regressão)

1. Entrada pelo kanban → voltar presente → regressão ao `/recrutamento`.
2. Refresh na página Meus talentos → voltar ausente; breadcrumb funciona.
3. Busca com 0 resultados → mensagem adequada.
4. Limite &lt; total filtrado → aviso de truncagem.
5. Abrir perfil e histórico → drawers fecham sem erro.
6. Tour com lista vazia → apenas 3 passos; com dados → 5 passos.

---

## 9. FAQ escalável (modelo para tela futura)

### 9.1 Metadados por entrada (filtro de features)

Cada FAQ deve ser serializável como:

```json
{
  "featureId": "recrutamento-meus-talentos",
  "featureLabel": "Meus talentos",
  "acao": "buscar",
  "tags": ["busca", "filtro", "lista"],
  "pergunta": "Como filtrar candidatos na lista?",
  "resposta": "Use o campo de busca na parte superior…",
  "ordem": 10
}
```

- **Filtros de UI futuros:** `featureId`, `acao`, `tags`.
- **Ordenação:** `ordem` crescente dentro do mesmo `acao`.

### 9.2 Banco inicial de perguntas (ação → P/R)

| Ação | Pergunta | Resposta (resumo) |
|------|----------|-------------------|
| **aceder** | Como abro Meus talentos? | Gestão de Vagas → Opções de tela → Meus Candidatos; ou aceda diretamente a `/recrutamento/meustalentos`. |
| **voltar** | Por que às vezes não aparece o botão voltar? | Só aparece quando vem do kanban com estado de navegação; após refresh use o breadcrumb **Recrutamento**. |
| **buscar** | Como buscar na lista? | Digite no campo, Enter ou botão da lupa; a filtragem é local sobre os dados já carregados. |
| **colunas** | Como ocultar ou mostrar colunas? | Botão com ícone de filtros → **Mostrar colunas**; marque/desmarque (a coluna Candidato não pode ser ocultada). |
| **reordenar_colunas** | Como mudar a ordem das colunas? | Arraste no menu **Mostrar colunas** ou arraste os cabeçalhos na tabela; a ordem é guardada neste browser. |
| **ordenar_linhas** | Como ordenar as linhas? | Clique no cabeçalho da coluna para alternar ascendente/descendente; aplica-se à **página atual**. |
| **paginar** | Como mudar quantas linhas vejo? | **Linhas por página** no rodapé; use números ou setas para navegar. |
| **limite** | O que é “Limite de resultados”? | Máximo de registros **após** aplicar a busca; útil para listas grandes. |
| **perfil** | Como ver o Perfil 360? | Ícone de **pessoa** na coluna Candidato — abre a vista completa **ao lado da lista**, sem sair da tela. |
| **historico** | Como ver o histórico sem sair da página? | Ícone de **relógio** ao lado do nome — histórico na mesma tela (mesmo fluxo que Banco de Talentos). |
| **tour** | Como rever o tour guiado? | Botão **Tour guiado** no canto do cabeçalho; se a lista estiver vazia, o tour omite passos da tabela. |

*(Expandir esta tabela conforme feedback de suporte.)*

---

## 10. Consumo por IA (produto / assistente)

**Objetivo:** permitir que um assistente responda com base **canónica** neste doc.

**Instruções recomendadas para indexação / RAG:**

1. **Chunking:** por secções §1–§4 (negócio), §6 (front), §7–§8 (API/QA), §9 (FAQ).
2. **Sinónimos:** “Meus Candidatos” (menu) = tela **Meus talentos**; “minha lista de talentos”; “candidaturas sob minha responsabilidade”.
3. **Limitações a comunicar:** ordenação só na página atual; busca só em memória após um GET único; voltar depende de state de router.
4. **Não inferir:** regras exatas de quem entra na lista — remeter ao backend/`ListarMeusTalentos`.

**Resposta tipo (few-shot para modelo):**  
*Pergunta:* “Consigo ordenar toda a lista?”  
*Resposta:* “Na tela Meus talentos a ordenação pelo cabeçalho aplica-se aos registos da **página atual**, como no Banco de Talentos. Para ordenar todo o conjunto seria necessário evolução de produto/back-end.”

---

## 11. Stakeholders, comunicação e métricas

| Stakeholder | Interesse |
|-------------|-----------|
| **RH / Recrutamento** | Visibilidade rápida das próprias candidaturas |
| **Produto** | Paridade com Banco de Talentos, redução de fricção vs modal |
| **Engenharia** | Contrato estável, performance, testabilidade |

**Métricas possíveis (definir com dados):** visitas à rota, cliques histórico/perfil, uso do tour, tempo médio na página.

---

## 12. Evoluções e dívidas técnicas

- Item de **menu lateral** (`flutterflowRouteMap` + permissão API).
- **Paginação / filtro server-side** em `ListarMeusTalentos`.
- Ordenação **global** antes da paginação (se produto exigir).
- **sessionStorage** opcional para preservar “voltar” após refresh (debater UX).
- Testids em botões de linha (perfil/histórico) se QA solicitar âncoras estáveis sem depender de ordem.

---

## 13. Referências

- `ARCHITECTURE.md` — Dependency Rule, Use Cases.
- `DESIGN_SYSTEM_AUDIT.md` — Timeline Mai 2026 (Meus talentos).
- `docs/ORIENTACAO_DOCUMENTACAO_TECNICA_FEATURES.md` — orientação geral.
- `docs/AUDITORIA_feat-meus-talentos_f7df14a6a.md` — auditoria de merge da entrega inicial.
- Tour: `src/shared/tour/steps/meus-talentos.steps.tsx`, `GuideTour.tsx`.

---

*Documento pensado como **fonte única** para derivar: wiki interna, slides de treinamento, casos de teste, prompts de IA e catálogo FAQ filtrável por `featureId` + `acao`.*
