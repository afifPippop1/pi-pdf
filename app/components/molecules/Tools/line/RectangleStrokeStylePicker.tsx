import { useMemo } from "react";
import { toolTypes } from "~/constants";
import { useActiveElementIndex } from "~/hooks/useActiveElementIndex";
import { useActivePageElements } from "~/hooks/useActivePageElements";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { setToolState } from "~/store/slices/editorSlice";
import type { StrokeStyle } from "~/types";
import { isLineTool, UpdateElement } from "~/utils";
import { PropertiesLabel } from "../PropertiesLabel";
import { StrokeStylePicker } from "../StrokeStylePicker";

export function LineStrokeStylePicker() {
  const defaultStrokeStyle = useAppSelector(
    (s) => s.editor.toolState.LINE.strokeStyle
  );
  const toolType = useAppSelector((s) => s.editor.toolType);
  const selectedElementIndex = useActiveElementIndex();
  const elements = useActivePageElements();
  const dispatch = useAppDispatch();
  const strokeStyle = useMemo(
    () =>
      selectedElementIndex !== -1 &&
      elements[selectedElementIndex].type === toolTypes.LINE
        ? elements[selectedElementIndex].element.options.strokeStyle
        : defaultStrokeStyle,
    [defaultStrokeStyle, elements, selectedElementIndex]
  );

  function handleChange(style: StrokeStyle) {
    const selectedElement = elements[selectedElementIndex];
    if (isLineTool(toolType)) {
      dispatch(
        setToolState({
          type: toolTypes.LINE,
          value: { strokeStyle: style },
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
      options: { ...selectedElement.element.options, strokeStyle: style },
    });
  }
  return (
    <PropertiesLabel label="Stroke style">
      <StrokeStylePicker onChange={handleChange} activeStyle={strokeStyle} />
    </PropertiesLabel>
  );
}
