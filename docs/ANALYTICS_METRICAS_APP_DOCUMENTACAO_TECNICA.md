# Métricas APP (Analytics) – Documentação Técnica e integração de dados reais

Documentação para o protótipo **Métricas APP** no hub (`/prototipo/analytics/metricas-app`). O UI actual usa **mocks**; este guia é o passo a passo para o dev substituir mocks por **dados reais** do Firebase Analytics/GA4 (via BigQuery ou API) e do Contentsquare.

- **Handoff para a equipa API (o que falta + o que informar):** [`ANALYTICS_METRICAS_APP_NECESSIDADES_INTEGRACAO_API.md`](./ANALYTICS_METRICAS_APP_NECESSIDADES_INTEGRACAO_API.md)
- **Criado em:** 08/05/2026
- **Última atualização:** 08/05/2026 — Cliente Analytics API (`GET /analytics/app`), React Query, normalizers hub; mocks por defeito.

---

## §0. Estado actual do protótipo

| Item | Valor |
|------|--------|
| **Rota** | `/prototipo/analytics/metricas-app` |
| **Menu** | Grupo **Analytics** → Métricas APP |
| **Fontes na UI** | Tabs: **App — Firebase** \| **App — Contentsquare** |
| **Dados hoje** | **Simulados por defeito**; com API: `src/prototipo/analytics/api/analyticsApiClient.ts` |
| **Ficheiros mock** | `mockFirebaseApp.ts`, `mockContentsquareApp.ts` (fallback / dev offline) |
| **Cliente API** | `api/analyticsApiClient.ts`, `api/analyticsQueries.ts`, `api/analyticsNormalizers.ts` |
| **Tipos/DTO** | `types.ts`, `api/analyticsApiTypes.ts` |
| **Hub (referência dev)** | `fourmakers_analytics_hub_instrucoes.md`, `fourmakers_analytics_hub_prompts.md` |
| **Docs de instrumentação (app Flutter)** | Ver secção §1 (export original FourMakers) |

**Regra:** nunca expor chaves Firebase, service accounts BigQuery nem tokens Contentsquare no browser. Toda agregação sensível corre no **backend** (.NET 8 ou serviço analytics dedicado).

---

## §1. Referências de instrumentação (app mobile)

Antes de consumir métricas no hub, o app Flutter deve estar instrumentado conforme:

| Plataforma | Documento de origem (equipa mobile) |
|------------|-------------------------------------|
| Firebase / GA4 | `fourmakers_firebase_analytics.md` — eventos `AnalyticsEvents`, parâmetros `AnalyticsParams`, DebugView, BigQuery Export |
| Contentsquare | `fourmakers_contentsquare.md` — SDK directo, screen views, replay, masking, fricção, custom variables |

Arquitectura alvo (ambas):

```txt
FourMakers Flutter App
  ├─ Firebase Analytics / GA4  →  BigQuery  →  Analytics API  →  Hub (este protótipo)
  └─ Contentsquare SDK       →  Console/API →  Analytics API  →  Hub (este protótipo)
```

---

## §2. Passo a passo — visão geral (dev backend + front hub)

### Fase 0 — Pré-requisitos

1. Confirmar **GA4 property** ligada ao projecto Firebase do app FourMakers.
2. Activar **BigQuery Export** (Firebase Console → Project Settings → Integrations → BigQuery → Link → Google Analytics).
3. Confirmar **Contentsquare** project/app ID e permissões de API (ou export agendado acordado com CS).
4. Criar **service account** GCP com `BigQuery Data Viewer` + `Job User` (só no backend).
5. Definir **ambientes** `hml` e `prod` (filtros já existem na UI).

### Fase 1 — Contratos API (backend)

1. Implementar endpoints REST (camelCase, envelope padrão Fourmakers) — ver §4.
2. Agregar por `dataInicio`, `dataFim`, `environment`, `platform` (query params).
3. Mapear resultados para os DTOs de `types.ts` (`FirebaseAppDashboardData`, `ContentsquareAppDashboardData`).
4. Cache curto (ex.: 5–15 min) para não bater BigQuery a cada refresh do dashboard.

### Fase 2 — Queries / integrações por fonte

| Fonte | Onde calcular | Secção |
|-------|----------------|--------|
| Firebase | BigQuery `analytics_<PROPERTY_ID>.events_*` ou Reporting API via backend | §3 |
| Contentsquare | API REST Contentsquare ou pipeline ETL acordado | §5 |

### Fase 3 — Front do hub (implementado no protótipo)

1. `src/prototipo/analytics/api/` — cliente, queries, normalizers, config.
2. `AnalyticsMetricasAppPage.tsx` — TanStack Query + estados loading/erro/retry.
3. Variáveis `.env` (ver `.env.example`):
   - `VITE_ANALYTICS_API_BASE_URL` — base da Analytics API
   - `VITE_ANALYTICS_USE_MOCK=true` — só mocks (default sem URL)
   - `VITE_ANALYTICS_USE_MOCK=false` — chama API
   - `VITE_ANALYTICS_FALLBACK_MOCK=true` — se API falhar, usa mocks
   - `VITE_ANALYTICS_API_TOKEN` — Bearer (local/CI, nunca no repo)
4. Endpoints consumidos (ordem de tentativa): `GET {base}/analytics/app?from&to&platform=app&environment&source=firebase|contentsquare&device_platform=…` e legado `GET {base}/api/analytics/app/{source}/dashboard`.
5. Em produção sem fallback: erro visível (não inventar números silenciosamente).

### Fase 4 — Validação

1. Comparar totais de um dia com Firebase Console / DebugView (amostra).
2. Validar top 10 `event_name` com query BigQuery (§3.2).
3. Contentsquare: validar sessões e screen views no console vs. API.
4. QA manual nos `data-testid` da página (`analytics-metricas-app-page`, tabs, filtros).

### Fase 5 — Comparativo Web (futuro)

1. Repetir padrão com GA4 Web + eventual GTM.
2. Nova tab ou secção **Web**; normalizar métricas (sessões, conversões) numa tabela comparativa.

---

## §3. Firebase / GA4 — dados reais

### 3.1 Tabelas BigQuery (após export)

```txt
PROJECT_ID.analytics_PROPERTY_ID.events_YYYYMMDD
PROJECT_ID.analytics_PROPERTY_ID.events_intraday_YYYYMMDD
```

### 3.2 Query base — eventos por dia

```sql
SELECT
  PARSE_DATE('%Y%m%d', event_date) AS eventDay,
  event_name,
  COUNT(*) AS totalEvents,
  COUNT(DISTINCT user_pseudo_id) AS uniqueUsers
FROM
  `PROJECT_ID.analytics_PROPERTY_ID.events_*`
WHERE
  _TABLE_SUFFIX BETWEEN @dataInicioSuffix AND @dataFimSuffix
  AND (@platform IS NULL OR device.operating_system = @platform)
GROUP BY
  eventDay, event_name
ORDER BY
  eventDay DESC, totalEvents DESC;
```

Filtrar `environment` via `user_properties` ou event parameter `environment` se enviado pelo app (`AnalyticsParams.environment`).

### 3.3 KPIs sugeridos (mapeamento → `FirebaseAppDashboardData.kpis`)

| KPI na UI | Origem sugerida |
|-----------|-----------------|
| DAU | `COUNT(DISTINCT user_pseudo_id)` último dia do período |
| MAU | Distinct users nos últimos 30 dias do período |
| Eventos (período) | `COUNT(*)` em `events_*` |
| Screen views | `event_name = 'screen_view'` ou eventos `screen_viewed` do FourMakers |
| Sessões | `COUNT(DISTINCT ga_session_id)` ou métrica GA4 equivalente |
| Taxa login concluído | `login_completed` / `login_started` |

### 3.4 Funis (UI → `funis[]`)

Calcular no backend por sequência de eventos na mesma sessão, por exemplo:

- **Autenticação:** `login_started` → `login_completed` → `sso_microsoft_completed`
- **Jornada:** `jornada_kanban_opened` → `jornada_card_opened` → `acao_marked_as_done`
- **CRM:** screen `crm_leads` → `lead_created` → `lead_stage_changed`

### 3.5 Lista de eventos esperados (validação)

Usar a tabela `AnalyticsEvents` do doc Firebase (ex.: `agenda_created`, `ai_next_steps_failed`, `api_error_shown`). O dashboard de erros deve filtrar pelo subconjunto de fricção/erro.

### 3.6 DebugView (não alimenta o dashboard)

DebugView serve validação em dev/hml no Firebase Console; o hub deve usar **dados exportados** (BigQuery), não o stream de debug.

---

## §4. APIs sugeridas (hub ← backend)

Envelope padrão em todas as respostas:

```json
{
  "retorno": { },
  "sucesso": true,
  "mensagem": null,
  "erros": null
}
```

### 4.1 `GET /analytics/app` (hub — preferencial)

**Query:** `from`, `to`, `platform=app`, `environment`, `source` (`firebase` | `contentsquare`), `device_platform` (`android` | `ios`, omitir se ambos), opcionais `organization_id`, `user_role`, `feature`, `app_version`, `client_id`.

**Response 200 (`retorno`):** `AnalyticsAppRetorno` — `firebase` e/ou `contentsquare` com o mesmo shape dos dashboards UI, ou DTO unificado (normalizer converte).

### 4.2 `GET /api/analytics/app/firebase/dashboard` (legado protótipo)

**Query:** `dataInicio`, `dataFim` (ISO date), `environment` (`hml`|`prod`), `platform` (`all`|`android`|`ios`)

**Response 200 (`retorno`):** estrutura compatível com `FirebaseAppDashboardData` (ver `types.ts`).

```json
{
  "retorno": {
    "periodoLabel": "2026-05-01 → 2026-05-25 · HML · Android + iOS",
    "kpis": [{ "id": "dau", "label": "Utilizadores activos (dia)", "value": "420", "trendPct": 4.2, "variant": "info" }],
    "eventosPorDia": [{ "data": "2026-05-25", "valor": 8200 }],
    "topEventos": [{ "eventName": "screen_viewed", "totalEvents": 1200, "uniqueUsers": 400, "feature": "core" }],
    "screenViews": [{ "screenName": "home", "views": 1800, "uniqueUsers": 380 }],
    "funis": [{ "id": "login", "titulo": "Autenticação", "etapas": [{ "nome": "login_started", "usuarios": 520 }] }],
    "userProperties": [{ "name": "user_role", "value": "gestor", "usuarios": 280 }],
    "erros": [{ "eventName": "api_error_shown", "totalEvents": 186, "uniqueUsers": 94, "feature": "core" }],
    "integracao": {
      "bigQueryExportAtivo": true,
      "debugViewAtivo": false,
      "ultimaSyncBigQuery": "2026-05-25T06:00:00Z"
    }
  },
  "sucesso": true,
  "mensagem": null,
  "erros": null
}
```

### 4.3 `GET /api/analytics/app/contentsquare/dashboard` (legado)

Mesmos query params; `retorno` compatível com `ContentsquareAppDashboardData`.

### 4.3 Erros

| HTTP | `mensagem` exemplo |
|------|-------------------|
| 400 | Período inválido (data início > fim) |
| 401/403 | Token inválido ou sem permissão analytics |
| 503 | BigQuery ou Contentsquare indisponível |

---

## §5. Contentsquare — dados reais

### 5.1 O que o backend deve agregar

| Secção UI | Fonte Contentsquare |
|-----------|---------------------|
| Sessões por dia | Métrica de sessões no período |
| Screen views prioritários | Lista de ecrãs do doc §8 (`home`, `jornada_comercial`, …) |
| Conversões | Eventos `login_completed`, `agenda_created`, `acao_marked_as_done`, etc. |
| Fricção | `form_validation_failed`, `upload_failed`, `api_error_shown`, … |
| Custom variables | Apenas variáveis **seguras** (`environment`, `user_role`, `app_version`, `feature`) |
| Masking por tela | Config estática + flag replay do projecto (pode vir de config interna, não PII) |
| Jornadas frequentes | API de journeys / path analysis |

### 5.2 Privacidade (obrigatório)

Não agregar nem expor no hub: CPF, e-mail, telefone, nome, conteúdo de reunião, descrição de lead, documentos, prompts. IDs pseudonimizados apenas se política interna permitir.

### 5.3 SDK vs GTM

O app deve usar **SDK directo** como principal; GTM é complementar. O dashboard reflecte dados do SDK/projecto CS configurado em hml/prod.

---

## §6. Alterações no código do hub (checklist)

```txt
[x] analyticsApiClient.ts + analyticsQueries.ts + analyticsNormalizers.ts
[x] Variáveis .env (.env.example)
[x] AnalyticsMetricasAppPage com React Query + erro/retry
[x] Badge conforme modo: mock | api | api-fallback-mock
[ ] Backend Analytics API em produção (BigQuery + Contentsquare providers)
[ ] VITE_ANALYTICS_USE_MOCK=false em ambiente com API
[ ] Testes E2E opcionais nos data-testid analytics-*
```

**Substituição directa dos mocks:**

| Mock | Substituir por |
|------|----------------|
| `getMockFirebaseAppDashboard(...)` | `GET /api/analytics/app/firebase/dashboard` |
| `getMockContentsquareAppDashboard(...)` | `GET /api/analytics/app/contentsquare/dashboard` |

---

## §7. QA — data-testid

| Área | `data-testid` |
|------|----------------|
| Página | `analytics-metricas-app-page` |
| Tab Firebase | `analytics-tab-firebase` |
| Tab Contentsquare | `analytics-tab-contentsquare` |
| Filtros | `analytics-filtro-data-inicio`, `analytics-filtro-data-fim`, `analytics-filtro-ambiente`, `analytics-filtro-plataforma` |
| Dashboard Firebase | `analytics-firebase-dashboard` |
| Dashboard CS | `analytics-contentsquare-dashboard` |

---

## §8. FAQ

| Pergunta | Resposta |
|----------|----------|
| Os números actuais são reais? | **Não.** São mocks até o backend expor as APIs §4. |
| Porque BigQuery e não GA4 Data API só? | BigQuery dá flexibilidade para funis e eventos custom FourMakers; Reporting API pode complementar KPIs simples. |
| Posso ligar o front directo ao Firebase? | **Não** no protótipo de produção — credenciais e PII. Use backend. |
| Quando entra o comparativo Web? | Fase 5; mesma API com `canal=web` ou endpoints paralelos. |

---

## §9. Referências neste repositório

- `PROTOTIPACAO.md` — convenções do hub
- `src/prototipo/analytics/types.ts` — contrato UI
- `src/prototipo/registry.ts` — entrada `analytics-metricas-app`
- `public/design-toolkit.md` — design system

---

*Documento único: `docs/ANALYTICS_METRICAS_APP_DOCUMENTACAO_TECNICA.md` — sincronizado para `public/docs/` no build.*
