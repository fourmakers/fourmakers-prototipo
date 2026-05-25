/**
 * Metadados públicos do projeto Firebase (sem apiKey no código-fonte).
 * Valores default alinhados ao flutterfire do app FourMakers — sobrescrever via .env.local.
 */

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
  return {
    projectId: env("VITE_FIREBASE_PROJECT_ID") ?? DEFAULT_META.projectId,
    projectNumber: env("VITE_FIREBASE_PROJECT_NUMBER") ?? DEFAULT_META.projectNumber,
    messagingSenderId: env("VITE_FIREBASE_MESSAGING_SENDER_ID") ?? DEFAULT_META.messagingSenderId,
    storageBucket: env("VITE_FIREBASE_STORAGE_BUCKET") ?? DEFAULT_META.storageBucket,
    androidAppId: env("VITE_FIREBASE_ANDROID_APP_ID") ?? DEFAULT_META.androidAppId,
    iosAppId: env("VITE_FIREBASE_IOS_APP_ID") ?? DEFAULT_META.iosAppId,
    iosBundleId: env("VITE_FIREBASE_IOS_BUNDLE_ID") ?? DEFAULT_META.iosBundleId,
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
    blockers.push("URL da Analytics API FourMakers (VITE_ANALYTICS_API_BASE_URL) não configurada.");
  }
  if (!ga4Property) {
    blockers.push("GA4 Property ID (VITE_GA4_PROPERTY_ID) — backend/BigQuery (ver cenário dev).");
  }
  blockers.push(...HUB_FASE_A_BLOCKERS);
  return blockers;
}
