# Configuração frontend — métricas via BFF (Cloud Run)

**Versão:** 1.0.0  
**Projeto:** `fourmakers-app` (GCP `1076704618091`)  
**BFF:** [services/analytics-api](../services/analytics-api/)

---

## Papel do frontend

O hub **não** chama GA4 Data API, BigQuery nem Firebase Admin no browser. Consome apenas o BFF:

```txt
[Protótipo Hub] --HTTP--> [analytics-api / Cloud Run] --GA4 API / BQ--> [GA4 / BigQuery]
```

Implementação: [src/analytics/api/analyticsApiClient.ts](../src/analytics/api/analyticsApiClient.ts) — `GET /analytics/app?source=firebase|contentsquare`.

---

## Variáveis de ambiente (`.env.local` ou `.env.homologation`)

| Variável | Valor recomendado | Notas |
|----------|-------------------|--------|
| `VITE_ANALYTICS_USE_MOCK` | `false` | Usar BFF em vez de mocks |
| `VITE_ANALYTICS_FALLBACK_MOCK` | `true` | Se BFF falhar, UI mostra mock com **borda warning** |
| `VITE_ANALYTICS_API_BASE_URL` | URL Cloud Run **ou vazio** | Vazio + `npm run analytics-api:dev` → proxy Vite `/analytics` → `localhost:3001` |
| `VITE_GA4_PROPERTY_ID` | `530562554` | Só metadado UI (opcional — há default no código) |
| `VITE_GA4_MEASUREMENT_ID` | `G-530562554` | Metadado / referência (app móvel) |
| `VITE_GA4_ANDROID_STREAM_ID` | `14319499513` | Metadado |
| `VITE_ANALYTICS_API_TOKEN` | (se BFF exigir Bearer) | Nunca commitar |

### Exemplo — local com BFF

```env
VITE_ANALYTICS_USE_MOCK=false
VITE_ANALYTICS_FALLBACK_MOCK=true
VITE_ANALYTICS_API_BASE_URL=
VITE_GA4_PROPERTY_ID=530562554
```

Terminal 1: `npm run analytics-api:dev`  
Terminal 2: `npm run dev` → http://localhost:8080/analytics/metricas-app

### Exemplo — após deploy Cloud Run

```env
VITE_ANALYTICS_USE_MOCK=false
VITE_ANALYTICS_FALLBACK_MOCK=true
VITE_ANALYTICS_API_BASE_URL=https://fourmakers-analytics-api-xxxxx.run.app
VITE_GA4_PROPERTY_ID=530562554
```

---

## Validação visual no hub

| UI | Significado |
|----|-------------|
| **Borda tracejada warning** | Mock ou fallback (`mode: mock` / `api-fallback-mock`) |
| **Sem borda warning** | Resposta do BFF (`mode: api`) |

---

## O que **não** configurar no frontend

- `firebaseConfig` + `getAnalytics()` para **ler** DAU/funis (só envia eventos no app nativo).
- Service account JSON no repositório do protótipo.
- Chamadas directas a `google-analytics.com` ou BigQuery.

Permissões GCP/GA4: [ANALYTICS_API_SETUP_GCP.md](./ANALYTICS_API_SETUP_GCP.md).  
Contrato HTTP: [ANALYTICS_API_CONTRATO_BACKEND.md](./ANALYTICS_API_CONTRATO_BACKEND.md).

---

## Pendências (backend / DevOps)

1. Deploy Cloud Run → preencher `VITE_ANALYTICS_API_BASE_URL`
2. Service account + Secret Manager
3. BigQuery Export activo (`analytics_530562554`)
4. CORS: `http://localhost:8080` + URL GitHub Pages
5. App: param `environment` (dev|hml|prod) no DebugView
