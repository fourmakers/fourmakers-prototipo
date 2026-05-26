# Setup GCP — Analytics API (Firebase / GA4 / BigQuery)

Checklist **Fase 0** para desbloquear dados reais no hub Métricas APP.

## Pré-requisitos

- Acesso **Editor** ou **Owner** no projeto GCP `fourmakers-app` (`1076704618091`)
- Acesso **Admin** à propriedade GA4 ligada ao Firebase

## 1. GA4 Property ID

1. [Firebase Console](https://console.firebase.google.com/project/fourmakers-app/settings/integrations) → Integrations → Google Analytics.
2. Abrir a propriedade GA4 → **Admin** → **Property settings**.
3. Copiar **Property ID** (numérico, ex. `412345678`) — **não** confundir com `projectId` `fourmakers-app`.

Definir no servidor:

```bash
GA4_PROPERTY_ID=530562554
GA4_ANDROID_STREAM_ID=14319499513
# Measurement ID (metadado app — opcional no BFF):
# GA4_MEASUREMENT_ID=G-530562554
```

Opcional no protótipo (só UI): `VITE_GA4_PROPERTY_ID` em `.env.local`.

## 2. Service account

```bash
gcloud config set project fourmakers-app

gcloud iam service-accounts create analytics-hub-reader \
  --display-name="Analytics Hub Reader"

# GA4: Admin → Property access management → Add user → email da SA → Viewer

gcloud projects add-iam-policy-binding fourmakers-app \
  --member="serviceAccount:analytics-hub-reader@fourmakers-app.iam.gserviceaccount.com" \
  --role="roles/analyticsviewer"
```

Guardar JSON **apenas** em Secret Manager ou variável local (nunca Git):

```bash
gcloud iam service-accounts keys create ./analytics-hub-reader.json \
  --iam-account=analytics-hub-reader@fourmakers-app.iam.gserviceaccount.com
```

## 3. BigQuery Export (Fase 2 — funis / environment)

1. Firebase Console → Project settings → Integrations → **BigQuery** → Link.
2. Activar export para a propriedade GA4.
3. Dataset típico: `analytics_<PROPERTY_ID>` com tabelas `events_YYYYMMDD`.

No servidor:

```bash
BQ_ENABLED=true
GCP_PROJECT_ID=fourmakers-app
BQ_DATASET=analytics_412345678
```

Conceder à SA:

```bash
gcloud projects add-iam-policy-binding fourmakers-app \
  --member="serviceAccount:analytics-hub-reader@fourmakers-app.iam.gserviceaccount.com" \
  --role="roles/bigquery.dataViewer"

gcloud projects add-iam-policy-binding fourmakers-app \
  --member="serviceAccount:analytics-hub-reader@fourmakers-app.iam.gserviceaccount.com" \
  --role="roles/bigquery.jobUser"
```

## 4. Deploy Cloud Run

Ver [services/analytics-api/README.md](../services/analytics-api/README.md).

```bash
cd services/analytics-api
cp .env.example .env   # preencher localmente
npm install
npm run deploy
```

## 5. CORS e protótipo

Variável `CORS_ORIGINS` (separadas por vírgula):

- `http://localhost:8080`
- `https://foursys-doug.github.io`
- URL do GitHub Pages do protótipo Fourmakers

## 6. Auth HML

```bash
ANALYTICS_API_TOKEN=seu-token-hml
```

No protótipo: `VITE_ANALYTICS_API_TOKEN` (`.env.local` apenas).

## Verificação

```bash
curl -s "https://<CLOUD_RUN_URL>/health"
curl -s "https://<CLOUD_RUN_URL>/analytics/app?from=2026-05-01&to=2026-05-25&platform=app&environment=prod&source=firebase" \
  -H "Authorization: Bearer <token>"
```

Resposta esperada: `sucesso: true`, `retorno.firebase` com KPIs preenchidos.
