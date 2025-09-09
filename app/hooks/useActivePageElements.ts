import { useMemo } from "react";
import { useAppSelector } from "~/store/hooks";

export function useActivePageElements() {
  const activePageIndex = useAppSelector((s) => s.editor.activePageIndex);
  const element = useAppSelector((s) => s.editor.elements);
  return useMemo(() => element[activePageIndex] || [], [element, activePageIndex]);
}
