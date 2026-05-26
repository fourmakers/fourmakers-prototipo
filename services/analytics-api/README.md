# FourMakers Analytics API

BFF para o hub **Métricas APP** (`GET /analytics/app`).

- **Firebase / GA4:** Google Analytics Data API (`runReport`)
- **BigQuery (opcional):** funis, `environment`, `friction_error`
- **Contentsquare (P1):** API Metrics ou stub estruturado

## Desenvolvimento local

```bash
cd services/analytics-api
cp .env.example .env
# DEMO_MODE=true sem credenciais GCP
npm install
npm run dev
```

Health: `http://localhost:3001/health`

Exemplo:

```bash
curl "http://localhost:3001/analytics/app?from=2026-05-01&to=2026-05-25&platform=app&environment=prod&source=firebase"
```

## Protótipo (proxy Vite)

Na raiz do monorepo:

```bash
# Terminal 1
npm run analytics-api:dev

# Terminal 2 — .env.local
# VITE_ANALYTICS_USE_MOCK=false
# VITE_ANALYTICS_API_BASE_URL=   (vazio — usa proxy /analytics)
npm run dev
```

## Produção (Cloud Run)

Ver [docs/ANALYTICS_API_SETUP_GCP.md](../../docs/ANALYTICS_API_SETUP_GCP.md).

```bash
export GA4_PROPERTY_ID=...
export GOOGLE_APPLICATION_CREDENTIALS=./sa.json
npm run deploy
```

Variáveis recomendadas: `GA4_PROPERTY_ID`, `BQ_ENABLED`, `BQ_DATASET`, `ANALYTICS_API_TOKEN`, `CORS_ORIGINS`.

## Contrato

Envelope Fourmakers: `{ retorno, sucesso, mensagem, erros }`.

Payload Firebase em PT: `eventosPorDia`, `topEventos`, `screenViews`, `funis`, `erros`, `integracao`.

Ver [docs/ANALYTICS_API_CONTRATO_BACKEND.md](../../docs/ANALYTICS_API_CONTRATO_BACKEND.md).
