import { useQuery } from "@tanstack/react-query";
import type { AnalyticsUiFilter } from "./analyticsApiClient";
import { fetchContentsquareAppDashboard, fetchFirebaseAppDashboard } from "./analyticsApiClient";

export function analyticsQueryKey(
  channel: "firebase" | "contentsquare",
  filter: AnalyticsUiFilter,
): readonly [string, string, AnalyticsUiFilter] {
  return ["analytics", channel, filter];
}

export function useFirebaseAppDashboardQuery(filter: AnalyticsUiFilter, enabled: boolean) {
  return useQuery({
    queryKey: analyticsQueryKey("firebase", filter),
    queryFn: () => fetchFirebaseAppDashboard(filter),
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useContentsquareAppDashboardQuery(filter: AnalyticsUiFilter, enabled: boolean) {
  return useQuery({
    queryKey: analyticsQueryKey("contentsquare", filter),
    queryFn: () => fetchContentsquareAppDashboard(filter),
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
