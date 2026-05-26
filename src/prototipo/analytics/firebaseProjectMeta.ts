/**
 * Metadados públicos do projeto Firebase (sem apiKey no código-fonte).
 * Valores default alinhados ao flutterfire do app FourMakers — sobrescrever via .env.local.
 */

import {
  GA4_ANDROID_STREAM_ID,
  GA4_MEASUREMENT_ID_DEFAULT,
  GA4_PROPERTY_ID_DEFAULT,
} from "./api/analyticsConfig";
import { HUB_FASE_A_BLOCKERS } from "./analyticsHubCatalog";

function env(name: string): string | undefined {
  const v = import.meta.env[name];
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

export interface FirebaseProjectMeta {
  projectId: string;
  projectNumber: string;
  messagingSenderId: string;
  storageBucket: string;
  androidAppId: string;
  iosAppId: string;
  iosBundleId: string;
  ga4PropertyId: string;
  /** Stream GA4 Android (numérico). */
  ga4AndroidStreamId: string;
  /** Measurement ID G-XXXXXXXX (stream Android). */
  ga4MeasurementId: string;
  bigQueryDataset: string;
  /** Parâmetro esperado no app para filtro hub (dev | hml | prod). */
  environmentParamName: string;
  /** Indica se há apiKey configurada localmente (não expõe o valor). */
  hasClientApiKeyConfigured: boolean;
}

const DEFAULT_META: Omit<FirebaseProjectMeta, "hasClientApiKeyConfigured"> = {
  projectId: "fourmakers-app",
  projectNumber: "1076704618091",
  messagingSenderId: "1076704618091",
  storageBucket: "fourmakers-app.firebasestorage.app",
  androidAppId: "1:1076704618091:android:a904fe9b1607b24a40b32e",
  iosAppId: "1:1076704618091:ios:b94b196d200e14ab40b32e",
  iosBundleId: "br.com.foursys.appfoursys",
};

export function getFirebaseProjectMeta(): FirebaseProjectMeta {
  const ga4PropertyId = env("VITE_GA4_PROPERTY_ID") ?? GA4_PROPERTY_ID_DEFAULT;
  return {
    projectId: env("VITE_FIREBASE_PROJECT_ID") ?? DEFAULT_META.projectId,
    projectNumber: env("VITE_FIREBASE_PROJECT_NUMBER") ?? DEFAULT_META.projectNumber,
    messagingSenderId: env("VITE_FIREBASE_MESSAGING_SENDER_ID") ?? DEFAULT_META.messagingSenderId,
    storageBucket: env("VITE_FIREBASE_STORAGE_BUCKET") ?? DEFAULT_META.storageBucket,
    androidAppId: env("VITE_FIREBASE_ANDROID_APP_ID") ?? DEFAULT_META.androidAppId,
    iosAppId: env("VITE_FIREBASE_IOS_APP_ID") ?? DEFAULT_META.iosAppId,
    iosBundleId: env("VITE_FIREBASE_IOS_BUNDLE_ID") ?? DEFAULT_META.iosBundleId,
    ga4PropertyId,
    ga4AndroidStreamId: env("VITE_GA4_ANDROID_STREAM_ID") ?? GA4_ANDROID_STREAM_ID,
    ga4MeasurementId: env("VITE_GA4_MEASUREMENT_ID") ?? GA4_MEASUREMENT_ID_DEFAULT,
    bigQueryDataset: env("VITE_BQ_DATASET") ?? `analytics_${ga4PropertyId}`,
    environmentParamName: "environment",
    hasClientApiKeyConfigured: Boolean(env("VITE_FIREBASE_API_KEY")),
  };
}

/** Itens que ainda impedem leitura de métricas agregadas no hub. */
export function getFirebaseIntegrationBlockers(): string[] {
  const blockers: string[] = [];
  const apiBase = env("VITE_ANALYTICS_API_BASE_URL");
  const useMock = env("VITE_ANALYTICS_USE_MOCK");
  const ga4Property = env("VITE_GA4_PROPERTY_ID");

  if (!apiBase && useMock !== "false") {
    blockers.push(
      "Ligar API: npm run analytics-api:dev + VITE_ANALYTICS_USE_MOCK=false (proxy /analytics) ou URL Cloud Run.",
    );
  }
  if (!ga4Property) {
    blockers.push(`GA4 Property ID — usar ${GA4_PROPERTY_ID_DEFAULT} (handoff) em VITE_GA4_PROPERTY_ID / servidor.`);
  }
  blockers.push("Service account + JSON no Secret Manager (não no Git).");
  blockers.push("Deploy Cloud Run → VITE_ANALYTICS_API_BASE_URL (URL após deploy).");
  blockers.push(
    "App: enviar user property ou event param `environment` (dev|hml|prod) — validar no DebugView.",
  );
  blockers.push(...HUB_FASE_A_BLOCKERS.filter((b) => !b.includes("GA4 Property ID")));
  return blockers;
}
