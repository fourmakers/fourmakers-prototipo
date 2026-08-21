# Showcase – Documentação Técnica (Regras de Negócio e Backend)

Documentação **multi-audiência** do protótipo **Showcase** no hub Fourmakers: experiência em **tela cheia** para demonstração em evento, com cards animados por feature, vídeo em loop e narrativa de negócio (título, resumo, impacto, tags, capabilities e benefícios).

**Criado em:** 18/08/2026  
**Última atualização:** 21/08/2026 — descaracterização da marca de evento (sem nome de feira); inclusão das duas features de **agentes de IA** (`perfil-agentes-ia` e `candidatos-agentes-ia`) como itens 1 e 2 da narrativa.

**Estado:** protótipo front **somente conteúdo estático + mídia local** (sem API). Integração backend **não aplicável** nesta versão; secção de sugestões cobre evolução CMS/config se o conteúdo passar a ser gerido remotamente.

---

## §0. Como usar este documento (mapa de audiências)

| Audiência | Secções prioritárias | Uso |
|-----------|---------------------|-----|
| **Comercial / estande / marketing** | §1–§3, **§4.2 Conteúdo editável**, §9 | Ajustar copy, ordem das features, frases de totem |
| **Negócio / PO** | §1, §4, Bloco A §2 e §5 | Aceite da narrativa do estande |
| **Frontend** | §5, §6, §8, §13 | Layout fullscreen, cards, overlay, assets |
| **Backend .NET 8** | Bloco A §10, **Sugestões para integração** | Só se evoluir para CMS/API de conteúdo |
| **QA** | §8, §9 | Smoke de rota, hover, vídeo, teclado |
| **UX / Design** | §5 | Tokens, animações alinhadas ao site Fourmakers |
| **IA (RAG)** | §10 | Chunks e sinónimos de TA / People Analytics |
| **Edição de copy** | **§4.2** → espelhar em `showcaseContent.ts` | Fonte de verdade documental; sync manual no código |

### Como editar o conteúdo depois

1. Altere os textos na **§4.2 Conteúdo editável das features** (este ficheiro).
2. Replique as mesmas alterações em `src/prototipo/showcase/showcaseContent.ts` (constantes `SHOWCASE_FEATURES`, `SHOWCASE_PLATFORM`, `SHOWCASE_UMBRELLA`, `SHOWCASE_TOTEM_PHRASES`).
3. Se trocar vídeo/poster: substitua ficheiros em `public/showcase/videos/{id}.mp4` e `public/showcase/posters/{id}.jpg` com o **mesmo `id`**.
4. Rode `npm run build:hml` (ou `validate:local`) e valide em `/showcase`.

---

## §1. Visão geral e objetivo

### 1.1 Produto

| Item | Descrição |
|------|-----------|
| **Rota (protótipo)** | `/showcase` |
| **Layout** | `fullscreen` — **fora** do `MainLayout` (sem Header/Sidebar do hub) |
| **Registo hub** | `id: showcase`, `menuGroup: showcase`, `menuLabel: Showcase` |
| **Título na UI** | Showcase · Jornada Inteligente de Atração e Seleção |
| **Descrição (card)** | Experiência em tela cheia para estande: cards animados por feature, vídeo em loop e narrativa de negócio. |
| **Persona** | Visitante de estande / demonstrador comercial / RH-TA em evento |
| **Objetivo de negócio** | Demonstrar know-how e eficiência da plataforma Fourmakers em atração e seleção, com linguagem de People Analytics e ROI narrativo |

### 1.2 Objetivos principais (visão de produto)

- Abrir a demo com o tema de maior impacto no evento: **agentes de IA como superpoderes das pessoas** (composição do perfil híbrido e candidatos com agentes).
- Apresentar a **jornada ponta a ponta** (composição com agentes → perfil → vaga → candidatos → entrevistas → kanban → painel executivo).
- Captar atenção no estande com **frase de impacto** grande e vídeo em preview no hover.
- Estruturar cada feature em: título, resumo, impacto, tags, “o que o cliente recebe”, benefícios esperados.
- Manter **consistência visual** com o site institucional (gradientes `#9A1BFF` / `#4CBFFF` / `#3BFE95`, cards com borda gradiente, reveal no scroll).
- Permitir navegação entre features no overlay (setas / teclado) sem sair da demo.

### 1.3 Mensagem guarda-chuva

> Do briefing ao fill: menos tempo de ciclo, mais aderência e decisões com dados — com agentes de IA que ampliam a capacidade do time e mantêm a decisão com as pessoas.

**Princípio central da abertura (features 1 e 2):** *Agentes são superpoderes das pessoas. A IA amplia — o humano decide.*

---

## §2. Jornada do utilizador (estande)

1. Aceder pelo menu **Showcase**, card na home, ou URL `/showcase`.
2. Ler o **hero** (mensagem guarda-chuva + chips da jornada).
3. Ver o **marquee** de frases de totem (opcional; pausa no hover).
4. Percorrer o **grid de cards** (ordem = fluxo de demo).
5. **Hover** no card → vídeo preview em loop mudo + animação de borda/elevação.
6. **Clique** → overlay de detalhe: vídeo full loop sem controles + textos estruturados.
7. Navegar features com setas do overlay ou teclas ← →; fechar com Esc ou botão.
8. Ler o bloco transversal **Plataforma e know-how**; sair via **Sair do showcase** → `/`.

**Ordem sugerida no estande (igual ao código):**

1. Criação de Perfil Potencializado com Agentes de IA  
2. Acompanhamento de Candidatos com Agentes de IA  
3. Criação de Perfil e Vaga com IA  
4. Gestão de Candidatos + Mapa de Aderência  
5. Gestão de Vagas  
6. Gestão de Perfis  
7. Entrevistas  
8. Kanban Builder  
9. Painel Executivo  

> As duas primeiras features são a **abertura de impacto** do estande: mostram o desenho de trabalho híbrido (humano + agentes) antes de percorrer a jornada operacional de atração e seleção.

---

## §3. Funcionalidades detalhadas (checklist de produto)

| Funcionalidade | Comportamento (protótipo) |
|----------------|---------------------------|
| Layout fullscreen | Rota fora do `MainLayout` via `layout: "fullscreen"` no registry |
| Menu Showcase | Item de 1.º nível no Sidebar (ícone Sparkles), abaixo de Início |
| Hero | Logo invertido, badge Showcase, CTAs “Explorar” e “Iniciar demonstração” |
| Marquee | Frases de totem em loop; `prefers-reduced-motion` desliga animações |
| Cards | Grid 1/2/3 colunas; stagger reveal; hover preview de vídeo |
| Overlay detalhe | Vídeo loop, impacto, tags, delivers, benefits, benefício âncora |
| Navegação overlay | Prev/next cíclico; Esc fecha; `body` overflow hidden |
| Assets | `public/showcase/videos/*.mp4` + `posters/*.jpg`; paths via `showcaseAsset()` + `BASE_URL` |
| Bloco plataforma | Conteúdo transversal (know-how Fourmakers) |

---

## §4. Regras de negócio e conteúdo

### 4.1 Regras críticas

| Regra | Detalhe |
|-------|---------|
| **Conteúdo estático** | Não há persistência nem autenticação nesta tela. |
| **Vídeo sem áudio/controles** | Loop mudo (`muted`, `loop`, `playsInline`, `controls={false}`) para demo contínua. |
| **Um vídeo por feature** | Nome do ficheiro = `id` da feature. |
| **Ordem = narrativa** | Campo `step` define ordem no grid e no overlay. |
| **Copy de negócio** | Linguagem de TA / People Analytics — não jargão técnico de implementação. |

### 4.2 Conteúdo editável das features (fonte documental)

> **Edite aqui e sincronize com `src/prototipo/showcase/showcaseContent.ts`.**  
> Campos por feature: `id`, `step`, `journey`, `title`, `summary`, `impact`, `anchorMetric`, `tags[]`, `delivers[]`, `benefits[]`, ficheiros `videos/{id}.mp4` e `posters/{id}.jpg`.

#### Feature 1 — `perfil-agentes-ia`

| Campo | Valor |
|-------|--------|
| **step / journey** | 1 · Composição · Capacidade ampliada |
| **title** | Criação de Perfil Potencializado com Agentes de IA |
| **summary** | O perfil deixa de ser lista de requisitos e passa a ser composição: a IA decompõe o papel em desafios com peso, mostra o que agentes resolvem e o que exige julgamento humano, abre o custo de cada arranjo e conduz a jornada até o perfil híbrido aprovado — que evolui em ciclos. |
| **impact** | Agentes são superpoderes das pessoas. A IA amplia — o humano decide. |
| **anchorMetric** | Mais capacidade dentro do mesmo orçamento |
| **tags** | Perfil Híbrido · Humano × Agentes · Cartão de Composição · Resíduo Humano-Crítico · Orçamento de Capacidade · Governança de IA · Nexus IA |
| **delivers** | Decomposição do papel em desafios com peso e o porquê de cada split; Split humano × agentes por desafio em duas estratégias (melhor capacidade / adequação ao orçamento); Custo mensal aberto (pessoa + cada agente) com status de orçamento; Override supervisionado pelo gestor; Cartão de composição por profissional (núcleo humano, superpoderes, % do papel); Roteiro de entrevista a partir do resíduo humano-crítico; Perfil híbrido com agentes ativos no dia 1 e alerta de recomposição |
| **benefits** | Mais capacidade no mesmo orçamento de headcount; Custo e cobertura visíveis antes de abrir a vaga; Ampliação do pool (perfis júniores viabilizados por agentes); Escopo explícito humano × IA; Rastreabilidade e revogação de cada agente; Mobilidade interna antes da busca externa (68% → 85%) |
| **vídeo origem** | `recrutamento_perfil_agente.mov` → `perfil-agentes-ia.mp4` |
| **base do conteúdo** | Jornada `Novo perfil com agentes` (5 etapas: Composição · Match · Seleção · Perfil híbrido · Evolução) — orçamento R$ 12.000/mês, 6 desafios com peso, agentes de Triagem de PRs / Testes-QA / Documentação / Observabilidade |

#### Feature 2 — `candidatos-agentes-ia`

| Campo | Valor |
|-------|--------|
| **step / journey** | 2 · Talento · Capacidade com agentes |
| **title** | Acompanhamento de Candidatos com Agentes de IA |
| **summary** | O funil da vaga mostra, em cada card, os agentes de IA que a pessoa já opera — ao lado do mapa de aderência e do match. O dossiê completo abre em drawer, com completude de perfil, trilha profissional e acesso a dados sensíveis governado por permissão. |
| **impact** | Não é só quem a pessoa é. É o que ela entrega com os agentes que domina. |
| **anchorMetric** | Capacidade real do candidato: pessoa + agentes |
| **tags** | Agentes do Candidato · Mapa de Aderência · Kanban de Candidatos · Dossiê do Candidato · Completude de Perfil · Governança de Dados · Nexus IA |
| **delivers** | Funil em kanban e lista, com etapas configuráveis e arraste; Agentes de IA declarados por candidato no card, com contagem e expansão; Mapa de aderência e match por etapa; Origem da candidatura, tempo decorrido e histórico; Dossiê em drawer (perfil, experiências, certificações, educação, habilidades); Completude do perfil com dados críticos e reconhecimentos; Acesso a remuneração e dados sensíveis por permissão |
| **benefits** | Leitura de capacidade ampliada (pessoa + agentes); Triagem mais rápida com aderência e match no card; Menos abas e planilhas; Decisão com evidência e governança de dados; Priorização clara por etapa; Conversa de contratação alinhada ao perfil híbrido |
| **vídeo origem** | `recrutamento_candidato_agente.mov` → `candidatos-agentes-ia.mp4` |
| **base do conteúdo** | Tela `Gestão de Candidatos` da vaga com secção **Agentes** por card (ex.: GPT Codex, Cursor, Claude Video, Gemini Studio), mapa de aderência (94 / 92 / 65), match (40 / 19,17 / 45,83) e pocket de aderentes |

#### Feature 3 — `perfil-vaga-ia`

| Campo | Valor |
|-------|--------|
| **step / journey** | 3 · Atração · Time-to-post |
| **title** | Criação de Perfil de Atuação e Vaga com IA |
| **summary** | Do prompt de negócio ao perfil publicado: a IA estrutura o perfil profissional, lê sinais de mercado, sugere remuneração e contexto, adequa os textos por canal e permite criar a vaga na sequência — com confirmação clara de tudo o que foi gerado. |
| **impact** | Briefing em linguagem natural. Perfil e vaga prontos para atrair o talento certo. |
| **anchorMetric** | Redução do time-to-post |
| **tags** | Perfil de Atuação · Job Description com IA · Análise de Mercado · SEO de Vagas · Canais de Publicação · Employer Branding · Nexus IA |
| **delivers** | Criação inteligente de perfil a partir de prompt e detalhes de negócio; Panorama de mercado do perfil; Sugestão e enriquecimento de detalhes com IA; Adequação SEO por canal; Integração com canais (LinkedIn e portais); Fluxo perfil → vaga opcional; Pré-visualização completa antes de gravar |
| **benefits** | Redução drástica do tempo entre demanda e publicação; Padronização de qualidade; Descrições mais atrativas; Menos idas e vindas RH/gestor/comunicação; Escala sem perder marca empregadora |
| **vídeo origem** | `recrutamento-perfil_inteligente.mov` → `perfil-vaga-ia.mp4` |

#### Feature 4 — `candidatos-aderencia`

| Campo | Valor |
|-------|--------|
| **step / journey** | 4 · Seleção · Quality of hire |
| **title** | Gestão de Candidatos · Match e Aderência Inteligente |
| **summary** | Acompanhamento do candidato no funil da vaga com geração de mapa de aderência por IA, ranking de aderentes, análise de mercado e leitura de trilha profissional — para montar shortlist com critério e velocidade. |
| **impact** | Menos feeling. Mais match. Shortlist com evidência. |
| **anchorMetric** | Shortlist com qualidade comprovável |
| **tags** | Mapa de Aderência · Match com IA · Shortlist · Ranking de Candidatos · Trilha Profissional · People Screening · Quality of Hire |
| **delivers** | Funil/kanban da vaga; Mapa de aderência inteligente; Ranking de aderentes; Análise de mercado; Trilha profissional possível; Drawer com radar e insights; Pocket de ranking e ações |
| **benefits** | Menos tempo de triagem; Melhor qualidade do match; Menos viés na pré-seleção; Argumentação clara para o gestor; Menor falso positivo na entrevista |
| **vídeo origem** | `recrutamento_gestao_vagas_big.mov` (corte a partir de ~72s) → `candidatos-aderencia.mp4` |

#### Feature 5 — `gestao-vagas`

| Campo | Valor |
|-------|--------|
| **step / journey** | 5 · Operação · Previsibilidade de fill |
| **title** | Gestão Inteligente de Vagas |
| **summary** | Operação completa das vagas em lista e kanban: status, priorização, acompanhamento do funil por posição e ações rápidas — do rascunho ao preenchimento. |
| **impact** | Cada vaga sob controle: status, prioridade e progresso no mesmo olhar. |
| **anchorMetric** | Previsibilidade de preenchimento |
| **tags** | Kanban de Vagas · Pipeline de Recrutamento · Priorização · Fill Rate · Operação de TA · Visibilidade de Status |
| **delivers** | Lista e kanban; Acompanhamento por status; Ações rápidas; Integração com perfis/candidatos/banco; Continuidade com criação assistida por IA |
| **benefits** | Maior previsibilidade de fill; Priorização alinhada à capacidade; Menos vagas esquecidas; Operação mais enxuta |
| **vídeo origem** | `recrutamento_gestao_vagas.mov` (primeiros ~62s) → `gestao-vagas.mp4` |

#### Feature 6 — `gestao-perfis`

| Campo | Valor |
|-------|--------|
| **step / journey** | 6 · Governança · Reuso |
| **title** | Gestão de Perfis de Atuação |
| **summary** | Biblioteca viva dos perfis criados pela organização: consulta, reuso, origem das vagas e rastreabilidade do que foi gerado com apoio de IA. |
| **impact** | Seu catálogo de perfis vira ativo estratégico de atração. |
| **anchorMetric** | Reuso e padronização de requisitos |
| **tags** | Catálogo de Perfis · Reuso de Perfil · Padronização · Governança de Vagas · Talent Acquisition · Perfil × Vaga |
| **delivers** | Lista e detalhe; Reuso sem reescrever; Rastreio perfil→vaga; Continuidade com criação inteligente |
| **benefits** | Menos retrabalho; Padronização entre unidades; Kick-off mais rápido; Base para auditoria de TA |
| **vídeo origem** | `recrutamento_gestao_perfis.mov` → `gestao-perfis.mp4` |

#### Feature 7 — `entrevistas`

| Campo | Valor |
|-------|--------|
| **step / journey** | 7 · Avaliação · Equidade |
| **title** | Builder e Parametrização de Entrevistas |
| **summary** | Estruture roteiros de entrevista alinhados ao perfil e à etapa do funil: perguntas, critérios e experiência consistente entre recrutadores. |
| **impact** | Entrevista padronizada. Avaliação comparável. Decisão mais justa. |
| **anchorMetric** | Avaliação estruturada e justa |
| **tags** | Roteiro de Entrevista · Avaliação Estruturada · Competências · Consistência de Processo · Candidate Experience · Entrevista por Competências |
| **delivers** | Parametrização por contexto; Builder de roteiros; Padronização entre times; Base objetiva e auditável |
| **benefits** | Consistência na experiência do candidato; Comparabilidade entre entrevistadores; Menos ruído no feedback; Compliance e equidade; Menos dependência de conhecimento tácito |
| **vídeo origem** | `recrutamento_entrevistas.mov` → `entrevistas.mp4` |

#### Feature 8 — `kanban-builder`

| Campo | Valor |
|-------|--------|
| **step / journey** | 8 · Processo · Adaptabilidade |
| **title** | Kanban Builder · Funil sob Medida |
| **summary** | Monte e personalize o fluxo do kanban: colunas, regras, notificações e dados do card alinhados ao processo da empresa. |
| **impact** | Seu processo. Seu funil. Configurado em minutos. |
| **anchorMetric** | Processo adaptável sem customização de TI |
| **tags** | Kanban Builder · Workflow de Recrutamento · Customização de Funil · Operação Adaptável · Governança de Processo · Low-code RH |
| **delivers** | Builder visual; Configuração de etapas/regras/dados; Notificações por movimentação; Alinhamento com gestão de vagas/candidatos |
| **benefits** | Adoção rápida; Menos customização de TI; Autonomia do RH; Escala multiunidade; Menos fricção de mudança |
| **vídeo origem** | `recrutamento_kanban_builder.mov` → `kanban-builder.mp4` |

#### Feature 9 — `painel-executivo`

| Campo | Valor |
|-------|--------|
| **step / journey** | 9 · Liderança · People Analytics |
| **title** | Painel Executivo de Atração e Seleção |
| **summary** | Visão consolidada de demanda, funil, desempenho do time, qualidade e projeção — com leitura executiva assistida por IA. |
| **impact** | Do relatório ao board: KPIs de recrutamento que a liderança entende em segundos. |
| **anchorMetric** | Decisão de liderança com People Analytics |
| **tags** | People Analytics · Painel Executivo · Funil de Seleção · SLA de Recrutamento · Insights com IA · Time-to-Hire · Fill Rate |
| **delivers** | Dashboard com Resumo/Demanda/Funil/Time/Qualidade/Projeção; Upload CSV; Cards de KPI; Gráficos; Insights Nexus; Projeção trimestral; Personalização de cards |
| **benefits** | Menos tempo de reporte; Visibilidade de gargalos de SLA; Capacity com evidência; Menos planilhas manuais; Narrativa pronta para stakeholders |
| **vídeo origem** | `recrutamento_dashboard.mov` → `painel-executivo.mp4` |

#### Bloco transversal — plataforma (`SHOWCASE_PLATFORM`)

| Campo | Valor |
|-------|--------|
| **title** | Tecnologia com Know-how de Recrutamento |
| **summary** | IA aplicada com método: agentes que ampliam a capacidade das pessoas, skills especializadas em mercado, perfil, canais, aderência e insights de painel; experiência desenhada para o dia a dia de TA; governança alinhada à operação de RH. |
| **impact** | Modernidade com resultado: processo, dado e decisão no mesmo lugar. |
| **tags** | Agentes de IA · IA Generativa aplicada · Nexus · People Tech · Talent Acquisition · Eficiência Operacional · Experiência do Recrutador · Digitalização de RH |
| **delivers** | Agentes de IA como superpoderes do time, com governança e override do gestor; IA contextualizada ao domínio; Jornada ponta a ponta (composição → perfil → vaga → candidato → entrevista → painel); Experiência moderna (drawers, kanbans, insights); Plataforma em evolução contínua |
| **benefits** | Posicionamento de inovação; Eficiência mensurável; Menos suporte/processos manuais; Melhor fill com menor custo de ciclo; Tecnologia que fala a língua do RH |

#### Frases de totem / LED (`SHOWCASE_TOTEM_PHRASES`)

- Agentes são superpoderes das pessoas.
- A IA amplia. O humano decide.
- 68% da pessoa + agentes = 95% do papel.
- Match com evidência.
- Do prompt à shortlist.
- Funil sob medida. Decisão com dados.
- Menos ciclo. Mais aderência.
- IA que fala a língua do RH.
- People Analytics na operação — não só no relatório.

### 4.3 Mapa Feature → Benefício âncora

| Feature (`id`) | Benefício âncora |
|----------------|------------------|
| `perfil-agentes-ia` | Mais capacidade dentro do mesmo orçamento |
| `candidatos-agentes-ia` | Capacidade real do candidato: pessoa + agentes |
| `perfil-vaga-ia` | Redução do time-to-post |
| `candidatos-aderencia` | Shortlist com qualidade comprovável |
| `gestao-vagas` | Previsibilidade de preenchimento |
| `gestao-perfis` | Reuso e padronização de requisitos |
| `entrevistas` | Avaliação estruturada e justa |
| `kanban-builder` | Processo adaptável sem customização de TI |
| `painel-executivo` | Decisão de liderança com People Analytics |

---

## §5. UX, UI e acessibilidade

### 5.1 Princípios

- **Tela cheia de evento:** contraste alto, tipografia display, impacto legível à distância.
- **Um job por secção:** hero → marquee → grid → bloco plataforma.
- **Cards interativos:** hover = preview; clique = detalhe (padrão Portal de Vagas / site).
- **Tokens DS** onde coincidem com a marca (`accent` = `#9A1BFF`, `accentSecondary` = `#3BFE95`); ciano/índigo em CSS local do showcase.

### 5.2 Componentes e ficheiros

| Peça | Ficheiro |
|------|----------|
| Página | `src/prototipo/showcase/ShowcasePage.tsx` |
| Card | `ShowcaseFeatureCard.tsx` |
| Overlay | `ShowcaseFeatureDetail.tsx` |
| Conteúdo | `showcaseContent.ts` |
| Estilos/animações | `showcase.css` |
| Reveal scroll | `useScrollReveal.ts` |
| Mídia | `public/showcase/videos/`, `public/showcase/posters/` |

### 5.3 Acessibilidade

- Overlay: `role="dialog"`, `aria-modal`, foco no botão fechar, Esc fecha.
- Botões de ícone com `aria-label`.
- `prefers-reduced-motion: reduce` desliga animações do showcase.
- Vídeos decorativos nos cards: `aria-hidden` no preview; no detalhe, `aria-label` descritivo.

---

## §6. Arquitetura frontend (protótipo)

```text
registry.ts (layout: fullscreen, menuGroup: showcase)
  └─ App.tsx → Route fora do MainLayout
       └─ ShowcasePage
            ├─ showcaseContent.ts (copy + ids)
            ├─ ShowcaseFeatureCard (hover video)
            ├─ ShowcaseFeatureDetail (overlay)
            ├─ useScrollReveal
            └─ public/showcase/{videos,posters}
```

- **Sem** HTTP / React Query / UseCase nesta feature.
- `showcaseAsset(path)` prefixa `import.meta.env.BASE_URL` (compatível com GitHub Pages em subpasta).

---

## Bloco A — Alinhamento ao guia externo

### A.2 Visão geral (tabela)

| Item | Descrição |
|------|-----------|
| **Rota(s)** | `/showcase` |
| **Título** | Showcase |
| **Objetivo de negócio** | Demo de jornada de atração e seleção em evento |
| **Escopo atual** | Conteúdo estático + vídeos locais; sem backend |
| **Fora de escopo** | Auth, analytics de estande, CMS remoto (sugerido abaixo) |

### A.3 Parâmetros de entrada e contexto

- **Autenticação:** não exigida no protótipo.
- **Query/rota:** nenhum parâmetro; futuro opcional `?feature={id}` para deep-link no overlay.
- **Dependências:** assets estáticos em `public/showcase/`.

### A.4 Padrões de contratos do projeto (consistência)

| Aspecto | Padrão | Uso |
|---------|--------|-----|
| **Nomenclatura JSON** | camelCase | Ex.: `codigoInternoColaborador`, `dataCriacao` |
| **Envelope de resposta** | `retorno`, `sucesso`, `mensagem`, `erros?` | Todas as APIs (quando existirem) |
| **Data de criação** | `dataCriacao` | Entidades |
| **Identificador de colaborador** | `codigoInternoColaborador` | Contratos de domínio |
| **Auth** | `Authorization: Bearer {token}` | APIs autenticadas |

Envelope de exemplo:

```json
{
  "retorno": null,
  "sucesso": true,
  "mensagem": null,
  "erros": null
}
```

### A.5–A.9 Regras, fluxos, UX, erros, tom

- Ver §2–§5 deste documento.
- **Tom:** positivo, operacional, linguagem de RH/TA (People Analytics, time-to-hire, fill rate, quality of hire).
- **Erros UX:** se vídeo falhar a carregar, o poster permanece; sem toast obrigatório nesta versão.

### A.10 APIs necessárias (backend .NET 8)

**Nenhuma API obrigatória** na versão atual. Ver **Sugestões para integração**.

### A.11 Modelos de dados (conteúdo)

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `id` | string | Slug estável (= nome do ficheiro de mídia) |
| `step` | number | Ordem na narrativa |
| `journey` | string | Chip de etapa |
| `title` | string | Headline |
| `summary` | string | Texto auxiliar |
| `impact` | string | Frase grande de atenção |
| `anchorMetric` | string | Benefício âncora |
| `tags` | string[] | Palavras-chave |
| `delivers` | string[] | O que o cliente recebe |
| `benefits` | string[] | Benefícios esperados |
| `videoUrl` | string | Path relativo do vídeo (sugerido em API) |
| `posterUrl` | string | Path relativo do poster (sugerido) |
| `dataCriacao` | string | ISO (se persistido) |
| `dataAlteracao` | string | ISO (se persistido) |

### A.12–A.17 Dependências, fluxo backend, melhorias, erros, resumo

- Dependências: DS do hub + assets locais.
- Fluxo backend: N/A (estático).
- Melhorias: deep-link `?feature=`, analytics de clique no estande, CMS.
- Resumo: tela de demo para evento com 9 features + bloco de plataforma; copy editável na §4.2 e em `showcaseContent.ts`.

---

## Sugestões para integração

Se o conteúdo passar a ser gerido fora do código (CMS / admin):

### Endpoint sugerido

`GET /api/Showcase/ListarFeatures?evento=`

**Resposta 200 (envelope):**

```json
{
  "retorno": {
    "mensagemGuardaChuva": "Do briefing ao fill: menos tempo de ciclo, mais aderência e decisões com dados — com IA aplicada de ponta a ponta na atração e seleção.",
    "frasesTotem": [
      "Match com evidência.",
      "Do prompt à shortlist."
    ],
    "features": [
      {
        "id": "perfil-vaga-ia",
        "step": 1,
        "journey": "Atração · Time-to-post",
        "title": "Criação de Perfil de Atuação e Vaga com IA",
        "summary": "…",
        "impact": "…",
        "anchorMetric": "Redução do time-to-post",
        "tags": ["Perfil de Atuação", "Nexus IA"],
        "delivers": ["…"],
        "benefits": ["…"],
        "videoUrl": "https://cdn.example/showcase/perfil-vaga-ia.mp4",
        "posterUrl": "https://cdn.example/showcase/perfil-vaga-ia.jpg",
        "dataCriacao": "2026-08-18T00:00:00Z",
        "dataAlteracao": "2026-08-18T00:00:00Z"
      }
    ],
    "plataforma": {
      "title": "Tecnologia com Know-how de Recrutamento",
      "summary": "…",
      "impact": "…",
      "tags": ["People Tech"],
      "delivers": ["…"],
      "benefits": ["…"]
    }
  },
  "sucesso": true,
  "mensagem": null,
  "erros": null
}
```

### DTO C# sugerido

```csharp
public sealed class ShowcaseResponseDto
{
    public string MensagemGuardaChuva { get; set; } = "";
    public List<string> FrasesTotem { get; set; } = new();
    public List<ShowcaseFeatureDto> Features { get; set; } = new();
    public ShowcasePlataformaDto? Plataforma { get; set; }
}

public sealed class ShowcaseFeatureDto
{
    public string Id { get; set; } = "";
    public int Step { get; set; }
    public string Journey { get; set; } = "";
    public string Title { get; set; } = "";
    public string Summary { get; set; } = "";
    public string Impact { get; set; } = "";
    public string AnchorMetric { get; set; } = "";
    public List<string> Tags { get; set; } = new();
    public List<string> Delivers { get; set; } = new();
    public List<string> Benefits { get; set; } = new();
    public string VideoUrl { get; set; } = "";
    public string PosterUrl { get; set; } = "";
    public string DataCriacao { get; set; } = "";
    public string? DataAlteracao { get; set; }
}
```

### Condicionais e erros

| Cenário | `sucesso` | `mensagem` / `erros` |
|---------|-----------|----------------------|
| Evento inexistente | false | `"Evento de showcase não encontrado."` |
| Sem features publicadas | true | `retorno.features = []` + UI estado vazio |
| URL de mídia inválida | true (lista) | Front faz fallback para poster / placeholder |

---

## §7. Integração backend

- **Consumido hoje:** nenhum.
- **Responsabilidade futura do servidor:** publicar features ordenadas, URLs de mídia versionadas, flags de publicação por evento.

---

## §8. QA

### 8.1 `data-testid` sugeridos (futuro E2E)

| Elemento | `data-testid` |
|----------|----------------|
| Página | `showcase-page` |
| Card feature | `showcase-feature-card-{id}` |
| Overlay | `showcase-feature-detail` |
| Botão fechar | `showcase-detail-close` |
| CTA sair | `showcase-exit` |

### 8.2 Casos manuais

1. Abrir `/showcase` — hero e 9 cards visíveis; sem sidebar do hub. Os dois primeiros cards são `perfil-agentes-ia` e `candidatos-agentes-ia`.
2. Menu **Showcase** e card na home navegam para `/showcase`.
3. Hover no card — vídeo inicia; sair do hover — pausa.
4. Clique — overlay com vídeo em loop sem controles; textos da §4.2 presentes.
5. ← → / Esc — navegação e fecho.
6. `prefers-reduced-motion` — sem animações contínuas.
7. GitHub Pages: vídeos carregam com `BASE_URL` correcto (`/fourmakers-prototipo/showcase/...`).

---

## §9. FAQ

| Ação | Pergunta | Resposta |
|------|----------|----------|
| Editar texto | Onde mudo o copy de uma feature? | §4.2 deste doc + `showcaseContent.ts`. |
| Trocar vídeo | Como substituo a demo? | Substitua `public/showcase/videos/{id}.mp4` e o poster; mantenha o `id`. |
| Ordem | Como reordeno as features? | Altere `step` e a ordem do array `SHOWCASE_FEATURES`. |
| Menu | Por que não aparece sob Protótipos? | Grupo `showcase` é item de 1.º nível no Sidebar. |
| Fullscreen | Por que não tem Header? | `layout: "fullscreen"` no registry. |
| API | Há backend? | Não nesta versão; ver Sugestões para integração. |

---

## §10. Consumo por IA (RAG)

**Chunks sugeridos:** §1 (visão), §2 (jornada), §4.2 (cada feature isolada), §4.3 (âncoras), Sugestões API.

**Sinónimos:** showcase / estande / demo; mapa de aderência / match / shortlist; time-to-post / time-to-hire / fill rate; People Analytics / painel executivo; agentes de IA / superpoderes / composição híbrida / núcleo humano / resíduo humano-crítico / Orchestra.

**Limitações:** copy no doc pode divergir do código se não sincronizar §4.2 ↔ `showcaseContent.ts`.

---

## §11. Stakeholders / métricas (opcional)

| Métrica de evento | Como observar |
|-------------------|---------------|
| Tempo no card / overlay | Futuro: analytics de clique |
| Features mais abertas | Contagem de `openId` |
| Feedback qualitativo | Pós-demo no estande |

---

## §12. Evoluções e dívidas

- Deep-link `?feature={id}` ao abrir overlay.
- Sincronização automática doc ↔ `showcaseContent.ts` (script).
- Hosting de vídeo em CDN se o repo crescer.
- Toggle de áudio opcional (hoje sempre mudo).
- Tradução EN para estandes internacionais.

---

## §13. Referências

- `PROTOTIPACAO.md` — hub, registry, `layout: fullscreen`
- `public/design-toolkit.md` — DS
- `docs/ORIENTACAO_DOCUMENTACAO_TECNICA_PROTOTIPOS_EXTERNOS.md`
- `src/prototipo/registry.ts`
- `src/prototipo/showcase/*`
- `public/showcase/*`
- Conteúdo de origem: material de recrutamento (features de atração e seleção)
- Features de agentes: jornada `Novo perfil com agentes` (app Fourmakers v2) e protótipo externo `jornada-recrutamento-hibrido`

---

## Resumo para o time

Showcase em `/showcase` (tela cheia) com 9 features + bloco de plataforma, vídeos locais e copy de negócio. A demo abre com as duas features de **agentes de IA** (perfil híbrido e candidatos com agentes) e segue para a jornada operacional de atração e seleção. **Edite o conteúdo na §4.2 e em `showcaseContent.ts`.** Sem API nesta versão; CMS opcional documentado nas sugestões.

---

*Documento UTF-8 · `docs/SHOWCASE_DOCUMENTACAO_TECNICA.md` · hub prototipo-fourmakers*
