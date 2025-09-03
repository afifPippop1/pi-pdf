import { toolTypes } from "~/constants";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { setToolState, updateElement } from "~/store/slices/editorSlice";
import type { Element, Font, TextElement } from "~/types";
import { FontPicker } from "./FontPicker";
import { useMemo } from "react";

export function TextTool() {
  const { fontFamily } = useAppSelector((s) => s.editor.toolState.TEXT);
  const selectedElement = useAppSelector((s) => s.editor.selectedElement);
  const activePageIndex = useAppSelector((s) => s.editor.activePageIndex);
  const elements = useAppSelector((s) => s.editor.elements);
  const selectedElementIndex = useMemo(
    () =>
      elements[activePageIndex].findIndex(
        (element) => element.id === selectedElement?.id
      ),
    [elements, activePageIndex, selectedElement]
  );
  const element = useMemo(
    () => elements[activePageIndex][selectedElementIndex],
    [elements, activePageIndex, selectedElementIndex]
  );
  const dispatch = useAppDispatch();
  function handleFontChange(font: Font) {
    if (!selectedElement) {
      dispatch(
        setToolState({
          type: toolTypes.TEXT,
          value: { fontFamily: font.family },
        })
      );
      return;
    }
    dispatch(
      updateElement({
        ...(selectedElement as Element<TextElement>),
        properties: {
          ...(selectedElement as Element<TextElement>).properties,
          fontFamily: font.family,
        },
      })
    );
    return;
  }
  const font = useMemo(
    () =>
      element?.type === toolTypes.TEXT
        ? element.properties.fontFamily || fontFamily
        : fontFamily,
    [selectedElement, fontFamily, element]
  );

  return (
    <div className="flex flex-col gap-4 w-full">
      <FontPicker font={font} onFontChange={handleFontChange} />
    </div>
  );
}
