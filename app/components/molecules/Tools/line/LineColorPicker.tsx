import type { Color } from "~/types";
import { ColorPicker } from "../ColorPicker";
import { PropertiesLabel } from "../PropertiesLabel";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { useActiveElementIndex } from "~/hooks/useActiveElementIndex";
import { useActivePageElements } from "~/hooks/useActivePageElements";
import { useMemo } from "react";
import { toolTypes } from "~/constants";
import { isLineTool, UpdateElement } from "~/utils";
import { setToolState } from "~/store/slices/editorSlice";

export function LineColorPicker() {
  const defaultColor = useAppSelector((s) => s.editor.toolState.LINE.color);
  const toolType = useAppSelector((s) => s.editor.toolType);
  const selectedElementIndex = useActiveElementIndex();
  const elements = useActivePageElements();
  const dispatch = useAppDispatch();
  const color = useMemo(
    () =>
      selectedElementIndex !== -1 &&
      elements[selectedElementIndex].type === toolTypes.LINE
        ? elements[selectedElementIndex].element.options.color
        : defaultColor,
    [defaultColor, elements, selectedElementIndex]
  );
  function handleChange(color: Color) {
    const selectedElement = elements[selectedElementIndex];
    if (isLineTool(toolType)) {
      dispatch(
        setToolState({
          type: toolTypes.LINE,
          value: { color },
        })
      );
    }

    if (
      !selectedElement ||
      selectedElement?.type !== toolTypes.LINE ||
      selectedElementIndex === -1
    ) {
      return;
    }

    UpdateElement.new(elements).line({
      ...selectedElement,
      index: selectedElementIndex,
      options: { ...selectedElement.element.options, color },
    });
  }

  return (
    <PropertiesLabel label="Stroke">
      <ColorPicker
        title="Outline color"
        onChange={handleChange}
        color={color}
      />
    </PropertiesLabel>
  );
}
