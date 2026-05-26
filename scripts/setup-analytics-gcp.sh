#!/usr/bin/env bash
# Referência — executar manualmente com credenciais GCP (não corre no CI sem gcloud auth).
set -euo pipefail

PROJECT_ID="${GCP_PROJECT_ID:-fourmakers-app}"
SA_NAME="${ANALYTICS_SA_NAME:-analytics-hub-reader}"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

echo "==> Projeto: ${PROJECT_ID}"
echo "==> Service account: ${SA_EMAIL}"
echo ""
echo "Passos (ver docs/ANALYTICS_API_SETUP_GCP.md):"
echo "  1. Obter GA4 Property ID na consola Firebase/GA4"
echo "  2. gcloud iam service-accounts create ${SA_NAME} ..."
echo "  3. GA4 Admin → Property access → Viewer para ${SA_EMAIL}"
echo "  4. Activar BigQuery Export (opcional Fase 2)"
echo "  5. cd services/analytics-api && npm run deploy"
echo ""
read -r -p "Criar SA agora? [y/N] " confirm
if [[ "${confirm}" != "y" && "${confirm}" != "Y" ]]; then
  exit 0
fi

gcloud config set project "${PROJECT_ID}"
gcloud iam service-accounts describe "${SA_EMAIL}" 2>/dev/null || \
  gcloud iam service-accounts create "${SA_NAME}" --display-name="Analytics Hub Reader"

gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/analyticsviewer" \
  --quiet

echo "OK. Conceda Viewer na propriedade GA4 e faça deploy da API."
