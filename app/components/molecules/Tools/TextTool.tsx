import { toolTypes } from "~/constants";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { setToolState, updateElement } from "~/store/slices/editorSlice";
import type { Element, Font, TextElement } from "~/types";
import { FontPicker } from "./FontPicker";
import { useMemo } from "react";

export function TextTool() {
  const { fontFamily } = useAppSelector((s) => s.editor.toolState.TEXT);
  const selectedElement = useAppSelector((s) => s.editor.selectedElement);
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
      selectedElement?.type === toolTypes.TEXT
        ? selectedElement.properties.fontFamily || fontFamily
        : fontFamily,
    [selectedElement, fontFamily]
  );

  return (
    <div className="flex flex-col gap-4 w-full">
      <FontPicker font={font} onFontChange={handleFontChange} />
    </div>
  );
}
