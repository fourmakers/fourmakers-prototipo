# Assistente de criação de vaga – Documentação Técnica (Regras de Negócio e Backend)

Documentação **multi-audiência** do protótipo **Assistente de criação de vaga** no hub Fourmakers: criação dinâmica de perfil/vaga com IA (prompt ou formulário), extração estruturada no contrato `perfilExtraido`, preview editável em tempo real (persona **comercial**) e encadeamento opcional para **Análise de aderência** após publicação.

**Criado em:** 02/06/2026  
**Última atualização:** 15/06/2026 — experiência comercial simplificada, contrato API `criar perfil/vaga com prompt`, preview flutuante e refinamento em tempo real.

**Estado:** protótipo front com mocks alinhados ao contrato API alvo; integração .NET 8 **pendente**.

---

## §0. Como usar este documento (mapa de audiências)

| Audiência | Secções prioritárias | Uso |
|-----------|---------------------|-----|
| **Comercial / R&S** | §1–§3, §5, §9 | Criar perfil por prompt, refinar no preview, publicar |
| **Negócio / PO** | §1, §4, Bloco A §2 e §5 | Regras, jornada comercial, aceite |
| **Frontend** | §6, §7, §8, §13 | Implementação no hub |
| **Backend .NET 8** | Bloco A §10–§11, §7, **Sugestões para integração** | Contratos, envelope, DTOs |
| **QA** | §8, §9 | Casos manuais e `data-testid` |
| **UX / Design** | §5 | DS, drawer preview, botão flutuante |
| **IA (RAG)** | §10 | Chunks e sinónimos |
| **Time IA / Triagem (futuro)** | §4.3, §12 | Persona com hierarquia match, critérios e insights |

---

## §1. Visão geral e objetivo

### 1.1 Produto

| Item | Descrição |
|------|-----------|
| **Rota (protótipo)** | `/criacao-vaga-assistente` |
| **Registo hub** | `id: criacao-vaga-assistente` em `src/prototipo/registry.ts` |
| **Título na UI** | Assistente de criação de vaga |
| **Descrição (card)** | Criação dinâmica de perfil/vaga com IA (prompt ou formulário), preview editável e completude do perfil antes da publicação. |
| **Persona actual** | **Comercial** — criação rápida e refinamento; sem exposição de hierarquia de match, insights de triagem nem critérios de aderência na UI |
| **Persona futura** | Recrutador / triagem — activar secções ocultas via `EXPERIENCIA_COMERCIAL` |
| **Objetivo de negócio** | Reduzir tempo de abertura de vaga/perfil, extrair dados estruturados do prompt, permitir refinamento pré-publicação e encadear triagem em **Análise de aderência** quando aplicável |

### 1.2 Objetivos principais (visão de produto)

- Extrair **perfil de atuação** com IA a partir de **prompt** (default) ou **formulário guiado**.
- Exigir **cliente** e **gestor** em qualquer modo de entrada.
- Responder no formato **`CriarPerfilVagaApiResponse`** (`perfilExtraido`, `skillsPropostas`, `validacaoInformacoes`, `metadadosConsulta`).
- Oferecer **preview flutuante** sempre visível após geração — refinamento em tempo real com recálculo de completude e KPIs de mercado.
- Ocultar na persona comercial: hierarquia de match, insights para triagem e critérios de aderência (código mantido para persona futura).
- Simular **publicação** e redirecionar para `/analise-aderencia`.

---

## §2. Jornada do utilizador (persona comercial)

1. Aceder ao hub → card **Assistente de criação de vaga** ou rota `/criacao-vaga-assistente`.
2. **Setup:** selecionar **Cliente** e **Gestor** (obrigatório).
3. Escolher modo (abas):
   - **Prompt com IA** (default): texto ≥ 40 caracteres.
   - **Formulário guiado:** título, modelo de trabalho, contexto breve.
4. Clicar **Gerar perfil com IA**.
5. **Processamento:** 5 etapas simuladas (extração de perfil, skills, validação).
6. **Resultados:** completude do perfil (%), contexto, desafios, objetivos, anti-churn, skills extraídas/propostas. **Não** exibe hierarquia de match, insights de triagem nem tabela de critérios de aderência.
7. **Preview da vaga** (botão **flutuante** fixo canto inferior direito):
   - Exibe prompt original, mensagem de validação (`mensagemUsuario`), KPIs de mercado e completude.
   - Campos editáveis: nome do perfil, custo, ratecard, cidade, estado, CEP, informações relevantes, descrição LinkedIn, desafios.
   - Edições recalculam completude, aderência prevista e banco de talentos (mock).
8. **Publicar perfil** → confirmação + CTA **Analisar aderentes** → `/analise-aderencia`.
9. **Nova criação** repõe o fluxo.

---

## §3. Funcionalidades detalhadas (checklist de produto)

| Funcionalidade | Comportamento (protótipo) |
|----------------|---------------------------|
| Cliente / gestor | Selects mock; estado `EntradaFormularioVaga`. |
| Aba Prompt com IA | Default; placeholder orienta stack e contexto. |
| Aba Formulário guiado | Título, modelo trabalho, contexto breve. |
| Validação CTA | Prompt: cliente + gestor + ≥40 chars. Form: cliente + gestor + título + modelo. |
| Processamento | Timer simulado; sem HTTP. |
| Mock API | `buildCriarPerfilVagaApiMock` → `mapApiToResultado` → `VagaOtimizadaResultado`. |
| Score UI | **Completude do perfil** (`validacaoInformacoes.completudePercentual`). |
| Secções ocultas (comercial) | `EXPERIENCIA_COMERCIAL`: hierarquia match, insights triagem, critérios aderência. |
| Preview drawer | `Sheet` + campos editáveis + recálculo via `updateResultadoFromPerfil`. |
| Botão flutuante | `fixed bottom-6 right-6 z-50` — sempre visível na view `results`. |
| Recálculo mercado | `recalcularPreviewMercado` + banner informativo 6s. |
| Recálculo completude | `recalcularValidacao` ao editar campos do perfil. |
| Publicar | Simulada; scroll para confirmação; link Análise de aderência. |

---

## §4. Regras de negócio

### 4.1 Críticas

| Regra | Detalhe |
|-------|---------|
| **Cliente obrigatório** | Bloqueia geração sem seleção. |
| **Gestor obrigatório** | Bloqueia geração sem seleção. |
| **Prompt mínimo** | ≥ 40 caracteres no modo prompt. |
| **Formulário mínimo** | Título não vazio + modelo de trabalho selecionado. |
| **Completude** | Calculada sobre 11 campos (`nomePerfil`, `custoPerfil`, `ratecardPerfil`, etc.). |
| **Publicação** | Simulada; não persiste em backend. |

### 4.2 Preview e mercado (protótipo)

- KPIs **simulados**; edições disparam variação em `recalcularPreviewMercado` e `recalcularValidacao`.
- Mensagem de atualização some após 6 segundos.
- Sem persistência de rascunho entre sessões.

### 4.3 Personas e feature flags

| Flag (`experienciaComercial.ts`) | Persona comercial | Persona futura (triagem) |
|----------------------------------|-------------------|--------------------------|
| `ocultarHierarquiaMatch` | `true` (oculto) | `false` |
| `ocultarInsightsTriagem` | `true` (oculto) | `false` |
| `ocultarCriteriosAderencia` | `true` (oculto) | `false` |

Dados de hierarquia, critérios e insights **continuam** no mock (`VagaOtimizadaResultado`) para migração sem refactor.

---

## §5. UX, UI e Design System

- **Layout:** `max-w-5xl`; header com gradiente `analise-brand-gradient` (`analiseAderencia.css`).
- **Tabs:** Prompt (esquerda, default) | Formulário (direita).
- **Botão flutuante:** Preview sempre acessível na fase de resultados.
- **Componentes DS:** `Button`, `Card`, `Badge`, `Select`, `Tabs`, `Sheet`, `ScrollArea`, `Input`, `Textarea`, `Label`.
- **Tokens:** `primaryText`, `secondaryText`, `accent`, `borderSoft`, `successSoft`, `warningSoft`.
- **Acessibilidade:** `SheetTitle`/`SheetDescription`; `aria-label` no botão flutuante; `role="status"` no banner de recálculo.

---

## §6. Arquitetura frontend (protótipo)

```
src/prototipo/registry.ts
  └── CriacaoVagaAssistentePage.tsx
        ├── EntradaCriacaoVagaPanel (+ podeOtimizarVaga)
        ├── ProcessamentoOtimizacaoVaga
        ├── ResultadoVagaOtimizada
        └── VagaPublicaPreviewDrawer (botão flutuante na página)
              └── PreviewEditableSection
config/
  └── experienciaComercial.ts
mocks/
  └── otimizarVagaMock.ts
      ├── buildCriarPerfilVagaApiMock
      └── mapApiToResultado / buildVagaOtimizadaMock
utils/
  ├── linkedinDescricaoVaga.ts
  ├── recalcularPreviewMercado.ts
  ├── recalcularCompletude.ts
  └── updateResultadoFromPerfil.ts
types.ts
```

**Próximo passo integração:** `POST /api/recrutamento/vagas/criar-com-prompt` (ou equivalente) substituindo mocks; alinhar clientes/gestores a APIs reais.

---

## §7. Integração backend (consumida ou sugerida)

| Método | Path (sugerido) | Uso |
|--------|-----------------|-----|
| GET | `/api/recrutamento/clientes` | Lista clientes da org |
| GET | `/api/recrutamento/gestores?clienteId=` | Gestores por cliente |
| POST | `/api/recrutamento/vagas/criar-com-prompt` | IA: prompt/form → `CriarPerfilVagaApiResponse` |
| POST | `/api/recrutamento/vagas/publicar` | Publicação do rascunho refinado |
| POST | `/api/recrutamento/vagas/recalcular-preview` | KPIs após edição (futuro) |

---

## §8. QA

### 8.1 `data-testid` sugeridos

| Elemento | `data-testid` |
|----------|---------------|
| Select cliente | `cv-cliente` |
| Select gestor | `cv-gestor` |
| Tab prompt | `cv-tab-prompt` |
| Textarea prompt | `cv-prompt` |
| CTA gerar | `cv-gerar-ia` |
| Botão preview flutuante | `cv-preview-flutuante` |
| Drawer preview | `cv-preview-drawer` |
| CTA publicar | `cv-publicar` |

### 8.2 Casos manuais

1. Sem cliente → CTA desabilitado + aviso.
2. Prompt &lt; 40 chars → CTA desabilitado.
3. Gerar perfil → completude ~27% no mock default (Tech Lead).
4. Preview → editar custo/cidade → completude e KPIs actualizam.
5. Secções hierarquia/insights/critérios **não** visíveis (comercial).
6. Publicar → link Análise de aderência.

---

## §9. FAQ

| Acção / dúvida | Resposta |
|----------------|----------|
| Por que não vejo critérios de aderência? | Persona **comercial** — secções ocultas via `EXPERIENCIA_COMERCIAL`; serão activadas para persona de triagem. |
| O que é o score %? | **Completude do perfil** — percentual de campos obrigatórios preenchidos (`validacaoInformacoes.completudePercentual`). |
| Posso editar depois de gerar? | Sim — use o **Preview da vaga** (botão flutuante); campos editáveis recalculam completude e match previsto. |
| O mock segue a API real? | Sim — estrutura `perfilExtraido`, `skillsPropostas`, `validacaoInformacoes`, `metadadosConsulta` em camelCase no front. |
| Publicar grava no backend? | Não no protótipo — simulação local; integração futura via `POST .../publicar`. |

---

## §10. Consumo por IA (RAG)

**Chunks sugeridos:** jornada comercial, contrato `CriarPerfilVagaApiResponse`, flags `EXPERIENCIA_COMERCIAL`, campos de completude, preview editável.

**Sinónimos:** criação de vaga = perfil de atuação = abertura de vaga; completude = score do perfil; preview = refinamento pré-publicação.

**Limitações:** KPIs de mercado simulados; critérios de aderência não expostos na UI comercial.

---

## §11. Stakeholders e métricas (opcional)

| Stakeholder | Interesse |
|-------------|-----------|
| Comercial | Tempo até perfil publicável, completude média |
| R&S / Triagem (futuro) | Critérios, hierarquia match, encadeamento aderência |
| Backend | Contrato estável `criar-com-prompt` |

---

## §12. Evoluções e dívidas

- [ ] Incrementar campos do formulário completo de criação vaga/perfil no preview (permanência, localidade ID, etc.).
- [ ] Revisitar quantidade de passos do wizard.
- [ ] Activar persona triagem (`EXPERIENCIA_COMERCIAL` → false).
- [ ] Integrar APIs reais de clientes/gestores e publicação.
- [ ] Job assíncrono para prompts longos (202 + polling).

---

## §13. Referências

- `PROTOTIPACAO.md` — hub de protótipos
- `public/design-toolkit.md` — Design System
- `docs/ORIENTACAO_DOCUMENTACAO_TECNICA_PROTOTIPOS_EXTERNOS.md`
- `src/prototipo/criacao-vaga-assistente/` — código do protótipo

---

# Bloco A — Regras de negócio e backend

## 1. Visão geral e objetivo (Bloco A)

Protótipo de criação dinâmica de perfil/vaga com IA, focado na persona **comercial**: extração estruturada, preview editável e publicação simulada. Backend .NET 8 deve expor endpoint de criação por prompt retornando envelope padrão com `retorno` no formato documentado abaixo.

## 2. Parâmetros de entrada e contexto

- **Auth:** Bearer token (`Authorization: Bearer {token}`).
- **Modo entrada:** `prompt` | `formulario`.
- **Obrigatório:** `clienteId`, `gestorId`.
- **Prompt:** `promptTexto` (≥ 40 caracteres) quando modo prompt.
- **Formulário:** `tituloVaga`, `modeloTrabalho`, `contextoBreve` quando modo formulário.

## 3. Padrões de contratos do projeto (consistência)

| Aspecto | Padrão | Uso |
|---------|--------|-----|
| Nomenclatura JSON | camelCase | `perfilExtraido`, `nomePerfil`, `dataCriacao` |
| Envelope de resposta | `retorno`, `sucesso`, `mensagem`, `erros?` | Todas as APIs |
| Data de criação | `dataCriacao` | Entidades persistidas |
| Identificador colaborador | `codigoInternoColaborador` | Autor da vaga |
| Erros de validação | `erros?: string[] \| null` | Respostas 4xx |

### Envelope padrão

```json
{
  "retorno": {},
  "sucesso": true,
  "mensagem": null,
  "erros": null
}
```

## 4. Regras de negócio (Bloco A)

- Cliente e gestor obrigatórios antes de invocar IA.
- Resposta de criação inclui `validacaoInformacoes` com lista de campos faltantes.
- Backend deve revalidar completude antes de publicar.
- Persona comercial: servidor pode omitir enriquecimento de critérios de aderência até persona triagem estar activa.

## 5. Fluxos por persona

### 5.1 Comercial (actual)

Prompt → extração → preview/refinamento → publicação.

### 5.2 Triagem (futuro)

Mesmo fluxo + exposição de hierarquia match, insights e critérios; encadeamento obrigatório com Análise de aderência.

## 6. Funcionalidades, UX e eventos

| Estado | Comportamento |
|--------|---------------|
| Setup | Validação inline cliente/gestor/prompt |
| Processing | Skeleton etapas; timeout simulado ~4s |
| Results | Completude, contexto, skills; preview flutuante |
| Preview | Edição inline; recálculo; publicar |
| Erro API | Envelope `sucesso: false`; toast + `erros[]` |

## 7. Regras de sucesso, erro e bloqueios (UX)

| Cenário | UX |
|---------|-----|
| Cliente ausente | Aviso amarelo; CTA disabled |
| Prompt curto | Aviso ≥ 40 caracteres |
| IA timeout | Mensagem retry; manter rascunho local |
| Publicar incompleto | Permitir no protótipo; backend deve bloquear ou warn |

## 8. Linguagem e tom

Positivo, operacional, orientado a acção (“Gerar perfil”, “Refine no preview”, “Completude do perfil”).

## 9. APIs necessárias (backend .NET 8)

Ver secção **Sugestões para integração** (final deste documento).

## 10. Modelos de dados

### `EntradaFormularioVaga`

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| cliente | string | Nome ou id |
| gestor | string | Nome ou id |
| tituloVaga | string | Rascunho |
| modeloTrabalho | string | remoto \| hibrido \| presencial |
| contextoBreve | string | Contexto livre |

### `PerfilExtraido`

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| codGestorExterno | string \| null | Gestor externo |
| nomePerfil | string | Título do perfil |
| custoPerfil | number | Remuneração |
| ratecardPerfil | number | Ratecard |
| informacoesRelevantes | string | Descrição / escopo |
| permanenciaId | string \| null | Duração contrato |
| modeloTrabalhoId | string \| null | GUID modelo |
| modeloTrabalhoDescricao | string \| null | Remoto, Híbrido, etc. |
| profissionalLocalidadeId | string \| null | Localidade |
| cidade | string \| null | Cidade |
| estado | string \| null | UF |
| hibridoDias | number | Dias presenciais |
| cep | string \| null | CEP |
| origem | string \| null | prompt_ia \| formulario |
| gestorExternoPerfilSkills | GestorExternoPerfilSkill[] | Skills extraídas |

### `GestorExternoPerfilSkill`

| Propriedade | Tipo |
|-------------|------|
| itemPerfil | { descricao, id } |
| skill | { descricao, id } |
| nivel | { descricao, id } |
| relevante | boolean |

### `ValidacaoInformacoes`

| Propriedade | Tipo |
|-------------|------|
| informacoesEncontradas | Record&lt;string, boolean&gt; |
| resumoInformacoes | Record&lt;string, string \| number \| null&gt; |
| informacoesFaltantes | string[] |
| mensagemUsuario | string |
| completudePercentual | number |

### `CriarPerfilVagaApiResponse` (corpo de `retorno`)

| Propriedade | Tipo |
|-------------|------|
| perfilExtraido | PerfilExtraido |
| skillsPropostas | { gestorExternoPerfilSkills: GestorExternoPerfilSkill[] } |
| validacaoInformacoes | ValidacaoInformacoes |
| metadadosConsulta | { tempoProcessamento, numeroTokens, modeloUsado, provedor } |

### `VagaOtimizadaResultado` (estado UI — protótipo)

Inclui `api: CriarPerfilVagaApiResponse`, campos derivados para UI (`contextoCliente`, `desafios`, etc.) e `promptOriginal` opcional.

## 11. Dependências de APIs e dados existentes

- Cadastro clientes/gestores (CRM ou recrutamento).
- Serviço IA (extração perfil + skills).
- Banco de talentos (KPIs preview — futuro).
- Análise de aderência (pós-publicação).

## 12. Fluxo resumido (backend)

1. Validar token e permissão (comercial/recrutador).
2. Validar cliente/gestor e payload conforme `modoEntrada`.
3. Invocar pipeline IA → retornar `CriarPerfilVagaApiResponse` no envelope.
4. Opcional: `POST recalcular-preview` ao editar campos no preview.
5. Publicar → persistir perfil/vaga + `dataCriacao` + autor via token.

## 13. Propostas de melhorias

- Wizard multi-step (contexto → skills → preview → publicar).
- Versionamento de rascunho.
- Faixa salarial sugerida pelo mercado.

## 14. Cenários de erro e pontos de atenção

- Timeout IA → 202 + polling ou mensagem retry.
- Gestor sem vínculo ao cliente → 400 `erros: ["Gestor inválido para o cliente"]`.
- Publicar sem campos mínimos → 400 com `informacoesFaltantes` espelhado.

## 15. Resumo para o time

Protótipo navegável em `/criacao-vaga-assistente` com mock no **contrato API alvo** (`criar perfil/vaga com prompt`). Persona comercial simplificada; preview flutuante com refinamento em tempo real. Documentação pronta para backend implementar endpoints com envelope padrão.

## 16. Rodapé

- **Ficheiro:** `docs/CRIACAO_VAGA_ASSISTENTE_DOCUMENTACAO_TECNICA.md`
- **Encoding:** UTF-8
- **Download hub:** `documentationMarkdownFile` em `registry.ts`; sync via `npm run sync:prototipo-docs`

---

# Sugestões para integração

## POST `/api/recrutamento/vagas/criar-com-prompt` **(sugerido)**

**Auth:** Bearer  
**Body:** `application/json`

```json
{
  "modoEntrada": "prompt",
  "clienteId": "cli-onesys",
  "gestorId": "gest-carlos",
  "tituloVaga": null,
  "modeloTrabalho": null,
  "contextoBreve": null,
  "promptTexto": "Tech Lead Frontend Senior remoto. FlutterFlow, React, Design System..."
}
```

**Resposta 200:**

```json
{
  "retorno": {
    "perfilExtraido": {
      "codGestorExterno": null,
      "nomePerfil": "Tech Lead Frontend Senior",
      "custoPerfil": 0.0,
      "ratecardPerfil": 0.0,
      "informacoesRelevantes": "Desenvolver e manter aplicações web e mobile no FlutterFlow...",
      "permanenciaId": null,
      "modeloTrabalhoId": "18a53d58-b3cd-11ef-9eb3-0e1e12942759",
      "modeloTrabalhoDescricao": "Remoto",
      "profissionalLocalidadeId": null,
      "cidade": null,
      "estado": null,
      "hibridoDias": 0,
      "cep": null,
      "origem": "prompt_ia",
      "gestorExternoPerfilSkills": [
        {
          "itemPerfil": { "descricao": "COMPETENCIA", "id": 1 },
          "skill": { "descricao": "FLUTTER FLOW", "id": 599 },
          "nivel": { "descricao": "Senior", "id": 4 },
          "relevante": true
        }
      ]
    },
    "skillsPropostas": {
      "gestorExternoPerfilSkills": [
        {
          "itemPerfil": { "descricao": "COMPETENCIA", "id": 1 },
          "skill": { "descricao": "TypeScript", "id": 331 },
          "nivel": { "descricao": "Senior", "id": 4 },
          "relevante": true
        }
      ]
    },
    "validacaoInformacoes": {
      "informacoesEncontradas": {
        "nomePerfil": true,
        "custoPerfil": false,
        "ratecardPerfil": false,
        "informacoesRelevantes": true,
        "permanencia": false,
        "modeloTrabalho": true,
        "localidade": false,
        "cidade": false,
        "estado": false,
        "hibridoDias": false,
        "cep": false
      },
      "resumoInformacoes": {
        "nomePerfil": "Tech Lead Frontend Senior",
        "custoPerfil": null,
        "ratecardPerfil": null,
        "informacoesRelevantes": "Desenvolver e manter aplicações...",
        "permanencia": null,
        "modeloTrabalho": "Remoto",
        "localidade": null,
        "cidade": null,
        "estado": null,
        "hibridoDias": null,
        "cep": null
      },
      "informacoesFaltantes": [
        "custoPerfil",
        "ratecardPerfil",
        "permanencia",
        "localidade",
        "cidade",
        "estado",
        "hibridoDias",
        "cep"
      ],
      "mensagemUsuario": "Para melhorar sua vaga, inclua: remuneração, ratecard, duração do contrato, localidade, cidade, estado e CEP.",
      "completudePercentual": 27.3
    },
    "metadadosConsulta": {
      "tempoProcessamento": 28.34,
      "numeroTokens": 5897,
      "modeloUsado": "gpt-4o-mini",
      "provedor": "openai"
    }
  },
  "sucesso": true,
  "mensagem": null,
  "erros": null
}
```

**Nota:** Chaves em **camelCase** na integração front/back Fourmakers. O exemplo de stakeholder pode usar snake_case na origem — mapear na camada API.

### DTOs C# sugeridos

```csharp
public sealed record CriarVagaComPromptRequest(
    string ModoEntrada,
    string ClienteId,
    string GestorId,
    string? TituloVaga,
    string? ModeloTrabalho,
    string? ContextoBreve,
    string? PromptTexto);

public sealed record PerfilExtraidoDto(
    string? CodGestorExterno,
    string NomePerfil,
    decimal CustoPerfil,
    decimal RatecardPerfil,
    string InformacoesRelevantes,
    string? PermanenciaId,
    string? ModeloTrabalhoId,
    string? ModeloTrabalhoDescricao,
    string? ProfissionalLocalidadeId,
    string? Cidade,
    string? Estado,
    int HibridoDias,
    string? Cep,
    string? Origem,
    IReadOnlyList<GestorExternoPerfilSkillDto> GestorExternoPerfilSkills);

public sealed record CriarPerfilVagaRetornoDto(
    PerfilExtraidoDto PerfilExtraido,
    SkillsPropostasDto SkillsPropostas,
    ValidacaoInformacoesDto ValidacaoInformacoes,
    MetadadosConsultaDto MetadadosConsulta);
```

### Erros UX

| HTTP | mensagem | erros |
|------|----------|-------|
| 400 | Dados inválidos | `["PromptTexto deve ter no mínimo 40 caracteres"]` |
| 403 | Sem permissão | `["Usuário não autorizado a criar vagas"]` |
| 404 | Cliente não encontrado | `["ClienteId inválido"]` |
| 504 | Timeout IA | `["Processamento excedeu o tempo limite. Tente novamente."]` |

## POST `/api/recrutamento/vagas/publicar` **(sugerido)**

**Body:** perfil refinado + `vagaRascunhoId` (opcional)

**Resposta 201:** envelope com `retorno: { vagaId, dataCriacao, status: "publicada" }`.

---

*Documento único da feature — sem ficheiros complementares.*
