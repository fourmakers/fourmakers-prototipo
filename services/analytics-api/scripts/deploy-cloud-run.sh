#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${GCP_PROJECT_ID:-fourmakers-app}"
REGION="${GCP_REGION:-southamerica-east1}"
SERVICE_NAME="${ANALYTICS_SERVICE_NAME:-fourmakers-analytics-api}"
IMAGE="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

cd "$(dirname "$0")/.."

echo "Build ${IMAGE}"
gcloud builds submit --tag "${IMAGE}" --project "${PROJECT_ID}"

echo "Deploy Cloud Run"
gcloud run deploy "${SERVICE_NAME}" \
  --image "${IMAGE}" \
  --platform managed \
  --region "${REGION}" \
  --project "${PROJECT_ID}" \
  --allow-unauthenticated \
  --set-env-vars "GCP_PROJECT_ID=${PROJECT_ID},NODE_ENV=production" \
  --set-secrets "GA4_PROPERTY_ID=GA4_PROPERTY_ID:latest,ANALYTICS_API_TOKEN=ANALYTICS_API_TOKEN:latest" \
  2>/dev/null || gcloud run deploy "${SERVICE_NAME}" \
  --image "${IMAGE}" \
  --platform managed \
  --region "${REGION}" \
  --project "${PROJECT_ID}" \
  --allow-unauthenticated \
  --set-env-vars "GCP_PROJECT_ID=${PROJECT_ID},NODE_ENV=production,DEMO_MODE=true"

gcloud run services describe "${SERVICE_NAME}" --region "${REGION}" --project "${PROJECT_ID}" --format='value(status.url)'
