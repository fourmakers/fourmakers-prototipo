# Analytics Hub FourMakers — cenário completo: o que temos e o que falta

**Data:** 2026-05-25  
**Cenário:** transformar o protótipo de métricas num **Analytics Hub** (app + web) com Firebase/GA4, BigQuery, Hotjar e Contentsquare, **sem secrets no frontend** — tudo via **Analytics API** segura.  
**Repositórios envolvidos:**

| Repo / pasta | Papel |
|--------------|--------|
| `fourmakers_app` (Flutter) | Envio de eventos, crashes, performance |
| `fourflow/.../fourmakers-prototipo` (React/Vite) | Protótipo web (hub a integrar) |
| `documentation/poc/` | Especificação e estado (este ficheiro) |
| **Analytics API** (Node) | **Ainda não existe** como repositório/pasta no monorepo consultado |

**Documentos relacionados:**

- [`fourmakers_analytics_hub_instrucoes.md`](./fourmakers_analytics_hub_instrucoes.md) — arquitectura alvo, endpoints, SQL, fases  
- [`fourmakers_analytics_estado_completo.md`](./fourmakers_analytics_estado_completo.md) — Firebase, app, handoff P0  
- [`fourmakers_firebase_analytics.md`](./fourmakers_firebase_analytics.md) — instrumentação Flutter (guia alvo)  
- [`fourmakers_analytics_hub_prompts.md`](./fourmakers_analytics_hub_prompts.md) — prompts para API, providers, frontend  

---

## 1. Visão do cenário (prompt mestre)

```txt
O que aconteceu?     → Firebase / GA4 / BigQuery (via API)
Por que aconteceu?   → Hotjar / Contentsquare (via API)
Com quem / onde?     → FourMakers API / Supabase (via API)
```

**Arquitectura obrigatória (resumo):**

1. Dashboard React + TypeScript  
2. Analytics API Node (Fastify ou NestJS)  
3. Providers: BigQuery, GA4 Data API, Hotjar, Contentsquare, FourMakers API, Supabase  
4. Normalização: DTOs unificados (métricas, funis, fricção, replays, heatmaps, feedback)  
5. Endpoints `GET /analytics/*` (overview, app, web, features, jornada, agendas, crm, perfil360, ai, friction, replays, heatmaps, errors, feedback)  
6. Filtros globais em todos os endpoints  
7. RBAC por perfil, cache, sem PII no browser  

---

## 2. Resumo por camada

| Camada | Estado geral | % estimado |
|--------|--------------|------------|
| **App Flutter — escrita de dados** | Feito (fase 1) + observabilidade | ~70% |
| **Web/protótipo — leitura (hub)** | Não encontrado no protótipo actual | ~0–10% |
| **Analytics API** | Não implementada | 0% |
| **Infra GCP (BQ export, GA4 property, SA)** | Pendente Data/DevOps | 0% |
| **Hotjar / CS no servidor** | Pendente | 0% |
| **Cenário “hub completo” do prompt** | **Bloqueado na API + infra** | ~15% global |

---

## 3. O que já temos

### 3.1 App mobile (`fourmakers_app`)

| Item | Estado | Detalhe |
|------|--------|---------|
| Firebase Core + `firebase_options.dart` | Feito | Projeto `fourmakers-app` |
| Firebase Analytics | Feito | `AnalyticsService`, hml/prod |
| Crashlytics | Feito | `FirebaseObservabilityService`, erros HTTP + globais |
| Performance Monitoring | Feito | Traces / HTTP metrics (SDK pronto para uso) |
| Contentsquare mobile | Feito | SDK, ecrãs unificados, opt-in hml/prod |
| Parâmetros default | Feito | `environment`, `app_version`, `build_number`, `platform` |
| Screen views (PT) | Feito | `AnalyticsRouteLabels` + observer |
| Navegação por feature | Feito | `feature_tapped` em `RouteService` |
| Login / user | Feito | `userId`, `org_id`; PII bloqueada |
| Sanitizer PII | Feito | `AnalyticsParameterSanitizer` |
| Debug / links consola | Feito | `AnalyticsObservability`, DebugView |
| Comunicação (domínio) | Feito | Analytics de comunicação via **FourMakers API** (não Firebase hub) |

**Eventos Firebase hoje (genéricos):** `app_open`, `login`, `logout`, `feature_tapped`, `screen_view`, mais `action_result`, `form_*`, `friction_error` (pouco usados em features).

**Ainda não no app (doc alvo):** `agenda_created`, `lead_stage_changed`, `jornada_kanban_opened`, etc. — ver [`fourmakers_firebase_analytics.md`](./fourmakers_firebase_analytics.md) §7.

### 3.2 Documentação POC

| Documento | Conteúdo |
|-----------|----------|
| `fourmakers_analytics_hub_instrucoes.md` | Stack, endpoints, providers, UI, cache, deploy |
| `fourmakers_analytics_estado_completo.md` | Estado app + handoff + BigQuery vs gratuito |
| `fourmakers_firebase_analytics.md` | Guia Flutter + Crashlytics/Performance |
| `fourmakers_analytics_hub_prompts.md` | Prompts Cursor para API, BQ, Hotjar, CS, React |
| `fourmakers_contentsquare.md` / integração Firebase | CS + Firebase |

### 3.3 Ferramentas gratuitas já utilizáveis (sem hub)

Sem Analytics API nem BigQuery, a equipa já pode usar:

- [Firebase Analytics / DebugView](https://console.firebase.google.com/project/fourmakers-app/analytics)  
- [Crashlytics](https://console.firebase.google.com/project/fourmakers-app/crashlytics)  
- [Performance](https://console.firebase.google.com/project/fourmakers-app/performance)  
- Contentsquare (conta + app web)  

---

## 4. O que falta implementar — por bloco do prompt

### 4.1 Dashboard React + TypeScript (Analytics Hub)

| Item | Estado | Notas |
|------|--------|-------|
| Monorepo `fourmakers-analytics/` (apps + packages) | Falta | Sugerido nas instruções; não existe no repo consultado |
| `analytics-dashboard` com layout, filtros, perfis | Falta | Protótipo `fourmakers-prototipo` não tem pasta `analytics/` nem rota `metricas-app` no código actual |
| `analyticsApiClient.ts` + env `VITE_ANALYTICS_*` | Reportado noutro contexto | **Não localizado** em `fourflow/.../fourmakers-prototipo/src` — pode estar noutra branch/repo |
| Componentes: `MetricCardGrid`, `FunnelChart`, `FrictionTable`, etc. | Falta | Especificados em `fourmakers_analytics_hub_instrucoes.md` §13 |
| Integração TanStack Query + mock/real | Falta | Depende da API HML |
| Perfis (executivo, produto, UX, comercial, tecnologia) | Falta | RBAC no front após API |

**Entregável mínimo:** rota `/analytics/metricas-app` (ou equivalente) + cliente HTTP só para `Analytics API` + estados loading/empty/error.

### 4.2 Analytics API (Node.js — Fastify ou NestJS)

| Item | Estado |
|------|--------|
| Projeto `apps/analytics-api/` | Falta |
| `main.ts`, config, auth (JWT/SSO) | Falta |
| Validação filtros (Zod/class-validator) | Falta |
| Cache por endpoint + chave de filtros | Falta |
| Mocks quando credenciais ausentes | Falta |
| Deploy Cloud Run HML | Falta |
| CORS para `localhost:8080` + hosting | Falta |
| `docs/ANALYTICS_API_CONTRATO_BACKEND.md` | Falta |
| Exemplos `docs/examples/analytics/*.json` | Falta |

### 4.3 Providers (backend)

| Provider | Estado | Responsabilidade |
|----------|--------|------------------|
| `BigQueryAnalyticsProvider` | Falta | Queries `events_*`, funis, feature usage, erros |
| `GA4DataApiProvider` | Falta | Relatórios simples / realtime (quotas) |
| `HotjarProvider` | Falta | Surveys, feedback, replays (se plano permitir) |
| `ContentsquareProvider` | Falta | Métricas, fricção, replays, heatmaps |
| `FourMakersBusinessProvider` | Falta | CRM, jornada, contexto negócio |
| `SupabaseProvider` | Falta | Dados complementares pseudónimos |
| Normalizers (`unified-*.normalizer.ts`) | Falta | DTO único para o dashboard |

**Credenciais:** todas via Secret Manager / env no **servidor** — nunca no Vite/React.

### 4.4 DTOs / normalização

| Tipo | Estado |
|------|--------|
| `UnifiedAnalyticsFilter` | Documentado; falta pacote `analytics-contracts` |
| `UnifiedMetricCard` | Documentado; falta implementação TS partilhada |
| `UnifiedFunnelStep` | Falta |
| `UnifiedFrictionItem` | Falta |
| `UnifiedReplayLink` | Falta |
| `UnifiedHeatmapItem` | Falta |
| `UnifiedFeedbackItem` | Falta |
| `UnifiedAnalyticsEvent` | Falta |
| Envelope resposta FourMakers (sucesso/erro) | Falta contrato publicado |

### 4.5 Endpoints `GET /analytics/*`

Todos **pendentes** na API. Filtros globais que cada um deve aceitar (query string):

```txt
from          (ISO date ou yyyy-MM-dd)
to
platform      app | web | both
environment   dev | hml | prod
organization_id
user_role
feature
client_id
app_version
source        (onde aplicável: firebase | contentsquare | ga4 | hotjar | …)
```

| Endpoint | Prioridade sugerida | Fonte de dados principal |
|----------|---------------------|---------------------------|
| `GET /analytics/overview` | P0 | BQ ou GA4 Data API |
| `GET /analytics/app` | **P0** | BQ + Contentsquare (`source=`) |
| `GET /analytics/web` | P1 | GA4 web + Hotjar |
| `GET /analytics/features` | P1 | BQ (`feature` / `feature_tapped`) |
| `GET /analytics/jornada` | P2 | BQ + FourMakers API |
| `GET /analytics/agendas` | P2 | BQ + FourMakers API |
| `GET /analytics/crm` | P2 | BQ + FourMakers API |
| `GET /analytics/perfil360` | P2 | BQ |
| `GET /analytics/ai` | P2 | BQ |
| `GET /analytics/friction` | P1 | Contentsquare + Hotjar |
| `GET /analytics/replays` | P1 | Contentsquare + Hotjar |
| `GET /analytics/heatmaps` | P2 | Hotjar + Contentsquare |
| `GET /analytics/errors` | P1 | Crashlytics export / BQ / `friction_error` |
| `GET /analytics/feedback` | P2 | Hotjar webhooks/API |

### 4.6 Infraestrutura e dados (GCP / terceiros)

| Item | Estado | Quem |
|------|--------|------|
| GA4 Property ID (numérico) | Falta | Data / Analytics |
| BigQuery Export Firebase → GA4 | Falta confirmar | Data / GCP |
| Service account BigQuery (API) | Falta | DevOps |
| GA4 Data API credentials (API) | Falta | DevOps |
| URL Analytics API HML | Falta | Backend |
| Auth Bearer / SSO + token teste | Falta | Backend |
| Hotjar site ID + API secret | Falta | UX / contrato |
| Contentsquare project ID + API servidor | Falta | UX / contrato |
| Web: GTM / Hotjar / CS web SDK | Parcial / fora do app | Web team |

### 4.7 Segurança, RBAC e operação

| Item | Estado |
|------|--------|
| Front sem Admin SDK / BQ / secrets | Regra definida; falta API que a enforce |
| RBAC (`role-permission.map`) | Falta |
| Cache TTL por endpoint (instruções §15) | Falta |
| LGPD / sem PII nas respostas | Política no app; falta validação na API |
| Release monitoring no hub | Crashlytics na consola; falta agregar na API |

### 4.8 App Flutter — evolução (não bloqueia P0 do hub)

| Item | Estado |
|------|--------|
| Catálogo completo de eventos (§7 doc Firebase) | Falta |
| `IAnalyticsService` + implementações noop | Falta (opcional) |
| Traces Performance em fluxos críticos | Parcial (helper existe) |
| `CONTENTSQUARE_PA_ENVIRONMENT_ID` por CI | Configurar por ambiente |

---

## 5. Matriz “prompt mestre” → estado

| # Requisito do prompt | Temos? | Falta |
|----------------------|--------|-------|
| 1. Dashboard React + TS | Doc + protótipo base Vite | Módulo Analytics Hub, rotas, componentes |
| 2. Analytics API Node | — | Projeto completo |
| 3. Seis providers | — | Todos + mocks |
| 4. Camada normalização | Tipos na doc | Package `analytics-contracts` + normalizers |
| 5. Quinze endpoints GET | — | Rotas + services + testes |
| 6. Filtros globais | App envia `environment`; doc define resto | Validação API + mapeamento BQ |
| 7. RBAC por perfil | — | Auth guard + mapa permissões |
| 8. Cache | — | Redis ou memória |
| 9. Sem PII | App | Revisão respostas API |
| 10. Mocks sem credenciais | — | Providers mock |
| 11. Estados UI loading/empty/error | Padrão shadcn no protótipo | Telas analytics |
| 12. BigQuery histórico | — | Export + provider |
| 13. GA4 Data API opcional | — | Provider leve |
| 14. Hotjar webhooks/API | — | Provider + rotas webhook |
| 15. Contentsquare API | SDK app only | Provider servidor |

---

## 6. Prioridades recomendadas

### Fase A — Desbloquear Métricas APP (P0)

1. Criar repositório/pasta `analytics-api` (Fastify + TypeScript).  
2. Package `analytics-contracts` com filtros + `UnifiedMetricCard` + envelope.  
3. `GET /analytics/app` com `source=firebase` (mock → BQ/GA4).  
4. `GET /analytics/app?source=contentsquare` (mock → CS API).  
5. Publicar URL HML + CORS + auth.  
6. No protótipo: `analyticsApiClient` + página Métricas APP + `.env.local`.  

**Dependências externas:** GA4 Property ID, BQ export (ou só GA4 Data API no início), token HML.

### Fase B — Overview + erros + fricção (P1)

- `GET /analytics/overview`, `/errors`, `/friction`, `/replays`  
- Hotjar + Contentsquare providers (mocks primeiro)  

### Fase C — Módulos negócio (P2)

- `/jornada`, `/agendas`, `/crm`, `/perfil360`, `/ai`, `/features`  
- `FourMakersBusinessProvider` + Supabase  

### Fase D — Web + perfis (P3)

- `GET /analytics/web`, heatmaps, feedback  
- RBAC executivo / produto / UX / comercial / tecnologia  

### Fase E — App (paralelo)

- Eventos granulares no Flutter para funis mais precisos no BQ  

---

## 7. Handoff rápido (copiar para Backend / Data)

```markdown
## Analytics Hub — pedido de desbloqueio

- [ ] Repositório analytics-api criado (Node + TS)
- [ ] URL HML: _______________________
- [ ] GET /analytics/app (firebase) — contrato + exemplo JSON
- [ ] GET /analytics/app (contentsquare) — contrato + exemplo JSON
- [ ] GA4 Property ID: _______________________
- [ ] BigQuery export activo: [ ] sim  desde: ____-__-__
- [ ] Service account JSON (canal seguro): [ ] recebido
- [ ] Auth (Bearer/SSO): _______________________
- [ ] Contentsquare API credentials (servidor): [ ] sim
- [ ] Hotjar API (web): [ ] sim
```

---

## 8. Activar protótipo quando Fase A estiver pronta

```bash
# fourmakers-prototipo/.env.local (não versionar)
VITE_FIREBASE_PROJECT_ID=fourmakers-app
VITE_ANALYTICS_API_BASE_URL=https://<analytics-api-hml>
VITE_ANALYTICS_USE_MOCK=false
VITE_ANALYTICS_API_TOKEN=<jwt-hml>
```

```bash
npm run dev
# Rota alvo: /analytics/metricas-app (confirmar em registry.ts ao implementar)
```

---

## 9. Onde está o código hoje (referência rápida)

```txt
App Flutter
  fourmakers_app/lib/firebase_options.dart
  fourmakers_app/lib/services/analytics/
  fourmakers_app/lib/services/firebase_observability/
  fourmakers_app/lib/services/contentsquare/
  fourmakers_app/lib/main.dart

Protótipo web (base)
  fourflow/src/prototipo/fourmakers-prototipo/

Analytics API
  (ainda não existe — criar conforme fourmakers_analytics_hub_instrucoes.md §5)

Documentação
  documentation/poc/ANALYTICS_HUB_CENARIO_ESTADO_E_PENDENCIAS.md  ← este ficheiro
```

---

## 10. Conclusão

- **Já temos** a base de **coleta** no app (Firebase Analytics, Crashlytics, Performance, Contentsquare) e documentação de arquitectura alvo.  
- **Falta** quase todo o **cenário do prompt mestre** do hub: **Analytics API**, **providers**, **DTOs partilhados**, **endpoints**, **dashboard integrado** e **infra GCP/terceiros**.  
- Caminho pragmático: **Fase A** com API + `/analytics/app` + mocks, depois BQ/GA4 real; BigQuery pode ser adiado se usar só **GA4 Data API + consolas gratuitas** no curto prazo.

*Actualizar este ficheiro quando existir `analytics-api` no monorepo ou rotas analytics no protótipo.*
