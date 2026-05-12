# Fourmakers – Agente de Autodescoberta (hub + pós-conversa) – Documentação Técnica (Regras de Negócio e Backend)

Documentação **autocontida** para migração do fluxo **Conversa de autodescoberta** (9 etapas) e da experiência **pós-conversa** alinhada ao protótipo **Perfil de Atuação Humano + Agentes** (revisão da análise da IA, composição humano/agentes/híbrido, catálogo de agentes, carreiras potencializadas e vagas). O estado actual no repositório **prototipo-fourmakers** é **protótipo front** com mocks locais (sem chamadas reais à IA no browser).

- **Criado em:** 12/05/2025 — Origem: documentação externa da conversa (Anthropic / artefacto).
- **Última atualização:** 08/05/2026 — Hub `/prototipo/agente-autodescoberta`: mocks de chat, painel pós-conversa (confirmação Perfil de Atuação, composição com sliders, carreiras, vagas), documentação unificada para download na home.

---

## §0. Como usar este documento

| Audiência | Secções prioritárias | Uso |
|-----------|---------------------|-----|
| **Produto / PO** | §1–§3, §4, Bloco A §4–§6 | Jornada, escopo, aceite |
| **Frontend (hub e portal futuro)** | §6, Bloco A §6–§7, §8 | Implementação React, estado, DS |
| **Backend .NET 8** | Bloco A §9–§13, §7, **Sugestões para integração** | Contratos, persistência, IA no servidor |
| **QA / automação** | §8, §9.2 | `data-testid`, casos manuais |
| **UX / Design** | §5, `public/design-toolkit.md` | Tokens, acessibilidade, microcopy |
| **IA (RAG / assistente)** | §10 | Chunking, sinónimos, limitações do mock |

---

## §1. Visão geral no hub de protótipos

| Item | Descrição |
|------|-----------|
| **Rota (protótipo)** | `/prototipo/agente-autodescoberta` (dentro de `MainLayout`; ver `src/prototipo/registry.ts`). |
| **Rota alvo (produto)** | `/autodescoberta` (portal do colaborador) — a definir no app global. |
| **Título UI** | Agente de Autodescoberta / Fourmakers — conversa de autodescoberta. |
| **Descrição** | Chat guiado em 9 etapas com valores fixos (32), devolução com tags `[TECNICAS]`, `[COMPORTAMENTAIS]`, `[CARGOS]`; pós-conversa com confirmação de análise, composição e carreiras. |
| **Registo** | `documentationMarkdownFile`: `FOURMAKERS_AGENTE_DOCUMENTACAO_TECNICA.md`; sync para `public/docs/` via `npm run sync:prototipo-docs`. |

---

## §2. Jornada do utilizador (protótipo actual)

1. Abre a rota do protótipo; vê **PageHeader** e o **card de chat**.
2. Mensagem inicial simulada (mock); responde em texto nas etapas 1–3.
3. Na etapa 4 simulada, o painel muda para **selecção de 10 valores** (lista fixa em `autodescobertaValues.ts`).
4. Continua com mensagens de texto até à **etapa 9**; o mock devolve texto limpo + tags parseadas.
5. Aparece **`AutodescobertaResultadoExpandido`** abaixo do chat (largura `max-w-6xl`):
   - **Fase confirmação:** revisão tipo **passo 2 Perfil de Atuação** — segmentos categorizados, três colunas (Decisões, Rotinas, Entregáveis), confiança, checkboxes e feedback opcional; **Continuar** exige “representa bem” **ou** “faltou algo” + texto ≥ 12 caracteres.
   - **Fase completa:** grelha **8+4** — competências e cargos da conversa | carrossel de **vagas**; depois **coluna única** com composição (barra + anel conic + sliders que mantêm soma 100%), aviso de alto risco humano, **switches** de agentes do catálogo mock, secção **Análise de carreiras** com três carreiras potencializadas.

---

## §3. Checklist de funcionalidades (produto)

| Funcionalidade | Comportamento (protótipo) |
|----------------|---------------------------|
| Chat 9 etapas | Respostas determinísticas por turno (`autodescobertaMockChat.ts`); sem API Anthropic no browser. |
| Valores 10/32 | Confirmação bloqueada até exactamente 10 selecionados. |
| Tags finais | `parseTag` / `stripAgentTags` em `autodescobertaParse.ts`. |
| Confirmação análise | Estado local; não persiste até backend existir. |
| Composição | `humano + agentes + hibrido === 100`; sliders com redistribuição proporcional. |
| Agentes | `available` / `pilot` / `unavailable`; toggle desactivado para `unavailable`. |
| Vagas | Carrossel Embla; dados `MOCK_VAGAS_AUTODESCOBERTA`. |
| Carreiras | Três cards com aderência actual vs. potencializada e agentes mapeados. |

---

## §4. Regras de negócio (cruzamento com Bloco A)

- Regras **conversacionais** (sequência 1–9, `[SHOW_VALUES]`, mensagem sintética de valores, tags na etapa 9): ver **Bloco A §4.1–4.2**.
- Regras **Perfil de Atuação** (composição soma 100, revisão humana obrigatória antes de publicar): ver `docs/PERFIL_DE_ATUACAO_DOCUMENTACAO_TECNICA.md` como referência de produto; neste protótipo só a **UX do passo 2** e **passo 3 composição** estão espelhadas de forma simplificada.

---

## §5. UX, UI e Design System

- **Componentes:** `PageHeader`, `Card`, `Button`, `Badge`, `Textarea`, `Checkbox`, `Switch`, `Slider`, `Carousel`, `Tooltip` (Radix), ícones `lucide-react`.
- **Tokens:** `borderSoft`, `surfaceElevated`, `primarySoft`, `success`, `warning`, `info`, `primaryText`, `secondaryText`, etc. (sem cores hex soltas nas novas áreas).
- **A11y:** `sr-only` no título do chat; `aria-label` no carrossel de vagas e nos switches de agentes; botões com texto explícito na confirmação.
- **Microcopy:** reforçar que sugestões são da IA e sujeitas a revisão (“A IA pode errar…”).

---

## §6. Arquitectura frontend (protótipo)

```
src/prototipo/registry.ts          → entrada PROTOTIPO_REGISTRY
src/prototipo/pages/
  AgenteAutodescobertaPage.tsx     → orquestra chat + estado tecnicas/comportamentais/cargos/flowComplete
src/prototipo/agente-autodescoberta/
  autodescobertaValues.ts          → 32 valores
  autodescobertaParse.ts           → parseTag, stripAgentTags
  autodescobertaMockChat.ts        → mensagens por turno
  autodescobertaAnalisePreviaMock.ts → análise prévia + catálogo agentes (mock)
  autodescobertaResultadoMocks.ts  → vagas + carreiras
  AutodescobertaResultadoExpandido.tsx → UI pós-conversa (fases, grelha, composição, carreiras)
```

**Próximo passo para integração no app principal:** substituir mocks por hooks (`useAutodescobertaSessao`, `useAnalisePrevia`, `useComposicao`) chamando API com envelope padrão; manter parse de tags no backend (preferencial) ou duplicar validação no front apenas para UX.

---

## §7. Integração backend (resumo)

- **Hoje:** nenhum endpoint real no protótipo; conversa e análise são determinísticos.
- **Alvo:** `POST /autodescoberta/sessao`, `POST /autodescoberta/sessao/{sessionId}/mensagem`, `GET /autodescoberta/valores` (ver Bloco A §9); para pós-conversa sugerir `POST .../analise-previa/confirmar`, `PUT .../sessao/{id}/composicao` (detalhe em **Sugestões para integração**).

---

## §8. QA — `data-testid` sugeridos e casos manuais

| Área | `data-testid` sugerido | Caso manual |
|------|------------------------|-------------|
| Chat enviar | `autodescoberta-chat-enviar` | Bloquear com loading; desbloquear após resposta. |
| Valores | `autodescoberta-valor-{id}` | Impedir 11º valor; confirmar com 10. |
| Confirmação | `autodescoberta-confirmar-continuar` | Desabilitado até regra de checkbox/feedback. |
| Slider composição | `autodescoberta-slider-humano` (etc.) | Sempre soma 100 após arrastar cada um. |
| Switch agente | `autodescoberta-agente-{id}` | Indisponível não alterna. |

---

## §9. FAQ

| # | Pergunta | Resposta |
|---|----------|----------|
| 1 | Porque não há chamada à Anthropic no browser? | Segurança e CORS: a chave fica no backend; o protótipo usa mock. |
| 2 | Onde está a lista de 32 valores? | `autodescobertaValues.ts` (alinhada à doc original da conversa). |
| 3 | Posso saltar a confirmação da análise? | No protótipo não; em produto pode ser política de onboarding. |
| 4 | A composição grava onde? | Ainda não grava; persistir via API sugerida na secção de integração. |
| 5 | As vagas são reais? | Não; `MOCK_VAGAS_AUTODESCOBERTA` para layout de card. |

---

## §10. Consumo por IA (RAG)

- **Chunking:** separar “fluxo conversa 9 etapas”, “contratos API conversa”, “pós-conversa Perfil de Atuação”, “composição”, “carreiras”.
- **Sinónimos:** autodescoberta, autodiscovery, perfil de atuação, composição humano-agente.
- **Limitações:** números de aderência e textos de carreira são ilustrativos; não usar como dados pessoais reais.

---

## §11. Stakeholders e métricas (opcional)

| Stakeholder | Interesse |
|-------------|-----------|
| RH / Talentos | Conclusão do fluxo, taxa de confirmação da análise, tempo médio. |
| Produto | Funil até composição publicada (futuro). |

---

## §12. Evoluções e dívidas

- Persistir sessão e rascunhos; reprocessar análise com feedback (POST com `feedbackReprocessamento`).
- Endpoints reais de vagas e matching com `tecnicas`/`cargos` devolvidos na etapa 9.
- Donut SVG proporcional (opcional); testes E2E Playwright nos `data-testid`.
- Internacionalização (pt-BR primeiro).

---

## §13. Referências (neste repositório)

- `PROTOTIPACAO.md` — convenções do hub.
- `public/design-toolkit.md` — DS.
- `docs/ORIENTACAO_DOCUMENTACAO_TECNICA_PROTOTIPOS_EXTERNOS.md` — guia de estrutura.
- `docs/PERFIL_DE_ATUACAO_DOCUMENTACAO_TECNICA.md` — feature irmã (wizard completo); reutilizar contratos onde fizer sentido.
- `docs/_MODELO_MEUS_TALENTOS_DOCUMENTACAO_TECNICA.md` — modelo multi-audiência.

---

# Bloco A — Alinhamento ao guia externo (estrutura mínima §1–§17)

## 1. Visão geral e objetivo (conversa)

### Objetivos principais

- Conduzir colaboradores por **9 etapas** sequenciais de autodescoberta.
- Colectar **10 valores** entre 32 fixos.
- Devolver **competências técnicas, comportamentais e cargos** ao final, com tags parseáveis no servidor.

### Tabela resumida (conversa — produção)

| Item | Descrição |
|------|-----------|
| **Rota** | `/autodescoberta` (portal) |
| **Autenticação** | Bearer; `codigoInternoColaborador`, `orgId` no token |
| **Escopo** | Fluxo completo + histórico de turnos persistido no servidor |

### Personas

| Persona | Papel |
|---------|--------|
| Colaborador | Usa o chat e confirmações. |
| RH / Gestor (v2) | Consulta perfis gerados. |

---

## 2. Parâmetros de entrada e contexto

- **Headers:** `Authorization: Bearer {token}`.
- **Sessão:** `sessionId` gerado pelo backend ao criar/retomar sessão.
- **Dependências:** perfil colaborador (nome, cargo) para contexto da IA; serviço de IA apenas no backend.

---

## 3. Padrões de contratos do projeto (consistência)

| Aspecto | Padrão |
|---------|--------|
| JSON | camelCase |
| Resposta | `retorno`, `sucesso`, `mensagem`, `erros` |
| Datas | `dataCriacao`, `dataAlteracao` ISO 8601 |
| Colaborador | `codigoInternoColaborador` |

### Envelope padrão

```json
{
  "retorno": null,
  "sucesso": true,
  "mensagem": null,
  "erros": null
}
```

---

## 4. Regras de negócio (conversa)

### 4.1 Sequência de 9 etapas

| Etapa | Nome |
|-------|------|
| 1 | Acolhimento |
| 2–3 | Profissão e dia a dia |
| 4 | Transição valores (`[SHOW_VALUES]` só após etapa 3) |
| 5–8 | Situações e tensão |
| 9 | Devolução + `[TECNICAS:]`, `[COMPORTAMENTAIS:]`, `[CARGOS:]` |

### 4.2 Regras críticas

- Não avançar etapa sem resposta válida.
- Exactamente **10 valores** na confirmação.
- Remover tags do texto exibido ao utilizador; persistir `conteudoBruto` no servidor para auditoria.

---

## 5. Fluxos por persona (conversa)

1. `POST /autodescoberta/sessao` → mensagem etapa 1.
2. `POST .../mensagem` por cada resposta.
3. Quando `showValues: true`, UI de valores; após confirmação, enviar mensagem sintética.
4. Etapa 9: resposta com listas `tecnicas`, `comportamentais`, `cargos` no `retorno`.

---

## 6. Funcionalidades, UX e eventos (conversa)

- Loading: input desactivado; indicador “a escrever…”.
- Erro: toast + permitir reenvio.
- Sessão expirada: redireccionar login.

---

## 7. Regras de sucesso, erro e bloqueios (UX)

| Cenário | `mensagem` / `erros` |
|---------|---------------------|
| Etapa inválida | “Não foi possível avançar…” |
| Valores ≠ 10 | `erros`: “Selecione exatamente 10 valores…” |
| IA indisponível | Mensagem amigável; não avançar etapa |

---

## 8. Linguagem e tom

- Português BR, caloroso, sem jargão de RH pesado.
- Evitar “performance”, “fit cultural”; preferir “quem você é”, “o que te move”.

---

## 9. APIs necessárias (backend .NET 8) — conversa

### 9.1 `POST /autodescoberta/sessao`

**Response 200 (exemplo):**

```json
{
  "retorno": {
    "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "etapaAtual": 1,
    "showValues": false,
    "mensagens": [
      {
        "role": "assistant",
        "content": "Olá! Eu sou o agente do Fourmakers...",
        "dataCriacao": "2026-05-08T10:00:00Z"
      }
    ]
  },
  "sucesso": true,
  "mensagem": null,
  "erros": null
}
```

### 9.2 `POST /autodescoberta/sessao/{sessionId}/mensagem`

**Request:**

```json
{
  "conteudo": "Texto da resposta do colaborador."
}
```

**Response 200 (com `showValues`):**

```json
{
  "retorno": {
    "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "etapaAtual": 4,
    "showValues": true,
    "mensagemAgente": {
      "role": "assistant",
      "content": "Faz sentido tudo que você descreveu...",
      "dataCriacao": "2026-05-08T10:10:00Z"
    },
    "tecnicas": null,
    "comportamentais": null,
    "cargos": null
  },
  "sucesso": true,
  "mensagem": null,
  "erros": null
}
```

### 9.3 `GET /autodescoberta/valores`

Lista os 32 valores (ou o front mantém lista estática sincronizada com seed).

---

## 10. Modelos de dados (conversa)

### `SessaoAutodescoberta`

| Propriedade | Tipo | Descrição |
|-------------|------|-------------|
| `id` | string (GUID) | sessionId |
| `codigoInternoColaborador` | string | Do token |
| `orgId` | string | Organização |
| `etapaAtual` | int | 1–9 |
| `status` | string | `em_andamento`, `aguardando_valores`, `concluida` |
| `dataCriacao` | string ISO | |
| `dataFim` | string ISO? | Quando concluída |

### `TurnoSessao`

| Propriedade | Tipo |
|-------------|------|
| `id` | string |
| `sessionId` | string |
| `role` | `user` \| `assistant` |
| `conteudo` | string |
| `conteudoBruto` | string? |
| `etapa` | int |
| `dataCriacao` | string ISO |

---

## 11. Dependências de APIs e dados existentes

- Token JWT com `codigoInternoColaborador` e `orgId`.
- Perfil colaborador para enriquecimento do prompt.
- **IA:** apenas no servidor (`ANTHROPIC_API_KEY` ou equivalente).

---

## 12. Fluxo resumido (backend — conversa)

1. Validar token e posse da sessão.
2. Persistir turno do utilizador.
3. Chamar LLM com histórico + system prompt versionado.
4. Detectar tags; limpar texto; actualizar `etapaAtual`.
5. Na etapa 9: persistir `PerfilAutodescoberta` e marcar sessão concluída.

---

## 13. Propostas de melhorias

- Histórico de sessões; exportação PDF; matching com vagas reais; painel RH.

---

## 14. Cenários de erro e pontos de atenção

- API IA indisponível: 503, não avançar etapa.
- `sessionId` de outro colaborador: 403/422.
- Nunca expor chave de IA ao front.

---

## 15. Resumo para o time

**Uma frase:** Chat de autodescoberta em 9 etapas com persistência e IA no servidor; no hub, mocks + pós-conversa alinhada a **Perfil de Atuação** (confirmação, composição 100%, agentes, carreiras e vagas).

**APIs conversa:** `POST /autodescoberta/sessao`, `POST .../mensagem`, `GET /autodescoberta/valores`.

**APIs pós-conversa (a especificar):** ver secção seguinte.

---

## 16. Rodapé

Documento único em `docs/FOURMAKERS_AGENTE_DOCUMENTACAO_TECNICA.md`, UTF-8, para o protótipo no repositório **prototipo-fourmakers**.

---

## Sugestões para integração (pós-conversa e Perfil de Atuação)

### Endpoints sugeridos (camelCase + envelope)

**1) `POST /api/autodescoberta/sessao/{sessionId}/analise-previa` (sugerido)**  
Gera a interpretação categorizada a partir do histórico + tags finais (equivalente a `POST /api/perfis-atuacao/analisar` do doc Perfil, mas contextualizado à sessão).

**Response 200:**

```json
{
  "retorno": {
    "confianca": "high",
    "segmentos": [
      { "texto": "Facilitação de workshops...", "categoria": "deliverable" }
    ],
    "decisoes": [{ "id": "d1", "texto": "Priorizar iniciativas...", "categoria": "decision" }],
    "rotinas": [],
    "entregaveis": [],
    "composicaoSugerida": { "humano": 58, "agentes": 27, "hibrido": 15 }
  },
  "sucesso": true,
  "mensagem": null,
  "erros": null
}
```

**2) `POST /api/autodescoberta/sessao/{sessionId}/confirmar-analise` (sugerido)**  
Corpo: `{ "representaPerfil": true, "feedbackAjuste": null }` ou feedback para reprocessamento.

**3) `PUT /api/autodescoberta/sessao/{sessionId}/composicao` (sugerido)**  
Corpo: `{ "composicao": { "humano": 55, "agentes": 30, "hibrido": 15 }, "agentesSelecionados": ["ag1", "ag2"] }`  
Validação: soma 100; agentes existem e `status !== "unavailable"`.

**422 exemplo:**

```json
{
  "retorno": null,
  "sucesso": false,
  "mensagem": "A soma da composição deve ser 100.",
  "erros": ["composicao.invalida"]
}
```

### Condicionais

- Só mostrar **vagas** e **carreiras** após `confirmar-analise` com sucesso (espelha o protótipo).
- Reprocessamento: novo `analise-previa` com `feedbackReprocessamento` (ver `PERFIL_DE_ATUACAO` §9.1).

### DTO C# (exemplo)

```csharp
public sealed record ComposicaoDto(int Humano, int Agentes, int Hibrido);

public sealed record ConfirmarAnaliseRequestDto(bool RepresentaPerfil, string? FeedbackAjuste);
```

---

## 17. Nome sugerido após importação

Manter: `docs/FOURMAKERS_AGENTE_DOCUMENTACAO_TECNICA.md`.
