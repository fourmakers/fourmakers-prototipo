# Relatório — Integração Analytics (dados reais)

**Data:** 25/05/2026 (actualizado)  
**Pedido:** integrar Métricas APP com Firebase/GA4 via Analytics API.  
**Resultado:** BFF em `services/analytics-api` (GA4 Data API + BigQuery + Contentsquare). Dados reais GA4 após deploy + `GA4_PROPERTY_ID`. Local: `npm run analytics-api:dev` com `DEMO_MODE=true`.

---

## 1. O que o dev enviou (extraído com segurança)

| Campo | Android | iOS | Uso |
|-------|---------|-----|-----|
| **projectId** | `fourmakers-app` | `fourmakers-app` | Identificação Firebase / GCP |
| **projectNumber** | `1076704618091` | `1076704618091` | Billing / APIs GCP |
| **messagingSenderId** | `1076704618091` | `1076704618091` | FCM |
| **storageBucket** | `fourmakers-app.firebasestorage.app` | idem | Storage |
| **appId** | `1:1076704618091:android:a904fe9b1607b24a40b32e` | `1:1076704618091:ios:b94b196d200e14ab40b32e` | App específica |
| **iosBundleId** | — | `br.com.foursys.appfoursys` | iOS |
| **apiKey** | presente no Dart | presente no Dart | **Só identificação cliente** — ver §2 |

**Não veio no pacote:** GA4 Property ID, Measurement ID (`G-XXXX`), URL da Analytics API, service account BigQuery, credenciais Contentsquare, token Bearer de HML.

> **Segurança:** as `apiKey` do Flutter **não devem** ser commitadas no repositório do protótipo. Restringir no Google Cloud Console (HTTP referrers / package name). Se foram expostas em chat, avaliar rotação.

---

## 2. Por que `firebase_options` não basta para o dashboard

```txt
firebase_options.dart  →  Firebase SDK no app (enviar eventos)
                      ≠  Ler DAU, funis, top eventos no hub web

Leitura de relatórios GA4/Firebase Analytics exige uma destas vias:
  A) Analytics API FourMakers (backend) ← recomendado no hub
  B) BigQuery Export + queries no servidor
  C) Google Analytics Data API (OAuth2 ou service account) — não no browser só com apiKey
```

Documentação Google: a chave Firebase identifica o projeto; **não autoriza** `runReport` na GA4 Data API.

O front do protótipo **já está preparado** para a via **A** (`GET /analytics/app`). Sem URL da API, usa mocks.

---

## 3. Estado da integração no repositório

| Componente | Estado |
|------------|--------|
| UI Métricas APP + filtros | OK |
| Cliente `analyticsApiClient.ts` (só BFF) | OK — ver `ANALYTICS_FRONTEND_BFF_CONFIG.md` |
| Metadados Firebase (`firebaseProjectMeta.ts`) | OK — projectId via env |
| Leitura BigQuery / GA4 Data API no browser | **Não implementável** — usar BFF |
| BFF local (`npm run analytics-api:dev` + DEMO_MODE) | **OK** — proxy Vite `/analytics` |
| Dados reais GA4 no dashboard | **Bloqueado** até `GA4_PROPERTY_ID` + deploy |

---

## 4. Necessidades ainda pendentes (prioridade)

### P0 — Desbloquear dados reais no hub

| # | Item | Quem | Exemplo / formato |
|---|------|------|-------------------|
| 1 | **URL Analytics API HML** | Backend/DevOps | `https://….run.app` → `VITE_ANALYTICS_API_BASE_URL` |
| 2 | **GET /analytics/app** deploy HML | DevOps | Implementado em `services/analytics-api` — falta Cloud Run + env |
| 3 | **GA4 Property ID** (numérico) | Data/Analytics | ex. `123456789` — **não** é o `projectId` |
| 4 | **BigQuery Export** activo | Data | Dataset `analytics_<PROPERTY_ID>.events_*` no project GCP ligado |
| 5 | **Auth** documentada | Backend | Bearer JWT ou SSO; token de teste HML por canal seguro |

### P1 — Contentsquare (tab App — Contentsquare)

| # | Item |
|---|------|
| 6 | Project/site ID Contentsquare |
| 7 | API Metrics ou Export com credenciais no **servidor** |
| 8 | Mesmo endpoint `/analytics/app?source=contentsquare` ou contrato separado documentado |

### P2 — Qualidade e operação

| # | Item |
|---|------|
| 9 | CORS: `localhost:8080` + URL GitHub Pages / interno |
| 10 | Exemplos JSON em `docs/examples/analytics/` (ver `ANALYTICS_METRICAS_APP_NECESSIDADES_INTEGRACAO_API.md`) |
| 11 | `docs/ANALYTICS_API_CONTRATO_BACKEND.md` |
| 12 | Mapeamento filtro `environment` = `hml` \| `prod` no BigQuery (user property ou param) |

### P3 — Futuro (hub completo)

| # | Item |
|---|------|
| 13 | GA4 Web + Hotjar (`GET /analytics/web`) |
| 14 | RBAC por perfil (executivo, UX, comercial, tecnologia) |

---

## 5. O que o dev pode enviar na próxima mensagem (checklist)

Copiar e preencher:

```markdown
## Handoff — fourmakers-app

- [ ] URL Analytics API HML: _______________________
- [ ] GET /analytics/app testado (firebase): [ ] sim [ ] não
- [ ] GET /analytics/app testado (contentsquare): [ ] sim [ ] não
- [ ] GA4 Property ID: _______________________
- [ ] GCP Project ID (BigQuery): _______________________ (confirmar se = fourmakers-app)
- [ ] BigQuery export activo desde: ____-__-__
- [ ] Auth: Bearer / SSO / outro: _______________________
- [ ] Token de teste HML (canal seguro, não no Git): [ ] enviado
- [ ] Contentsquare project ID: _______________________
- [ ] Ficheiro ANALYTICS_API_CONTRATO_BACKEND.md: [ ] sim [ ] não
- [ ] Exemplos JSON app-firebase-200.json: [ ] sim [ ] não
```

---

## 6. Como activar no protótipo assim que P0 estiver pronto

`.env.local` (não versionar):

```bash
VITE_FIREBASE_PROJECT_ID=fourmakers-app
VITE_ANALYTICS_API_BASE_URL=https://<analytics-api-hml>
VITE_ANALYTICS_USE_MOCK=false
VITE_ANALYTICS_API_TOKEN=<jwt-hml-se-aplicavel>
```

```bash
npm run dev
# Abrir http://localhost:8080/metricas-app
# Badge esperado: "Analytics API"
```

---

## 7. Referências

- `ANALYTICS_METRICAS_APP_NECESSIDADES_INTEGRACAO_API.md` — pacote de doc para a equipa API  
- `ANALYTICS_METRICAS_APP_DOCUMENTACAO_TECNICA.md` — contratos e tipos UI  
- `fourmakers_firebase_analytics.md` — instrumentação app  
- Firebase doc API keys: identificação ≠ autorização de relatórios  

---

*Gerado após análise do `firebase_options.dart` — integração de leitura de métricas permanece dependente da Analytics API ou backend BigQuery.*
