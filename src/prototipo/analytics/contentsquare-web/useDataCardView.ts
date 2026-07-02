import { useCallback, useState } from "react";
import type { DataCardViewMode } from "./dataCardView";
import { loadDataCardView, saveDataCardView } from "./dataCardView";

export function useDataCardView(cardId: string) {
  const [view, setViewState] = useState<DataCardViewMode>(() => loadDataCardView(cardId));

  const setView = useCallback(
    (mode: DataCardViewMode) => {
      setViewState(mode);
      saveDataCardView(cardId, mode);
    },
    [cardId],
  );

  return { view, setView };
}
