import { useMemo } from "react";
import { useActivePageElements } from "./useActivePageElements";
import { useAppSelector } from "~/store/hooks";

export function useActiveElementIndex() {
  const selectedElement = useAppSelector((s) => s.editor.selectedElement);
  const elements = useActivePageElements();
  return useMemo(
    () => elements.findIndex((element) => element.id === selectedElement?.id),
    [elements]
  );
}
