import { useMemo } from "react";
import { toolTypes } from "~/constants";
import { useActiveElementIndex } from "~/hooks/useActiveElementIndex";
import { useActivePageElements } from "~/hooks/useActivePageElements";
import { useAppSelector, useAppDispatch } from "~/store/hooks";
import { setToolState } from "~/store/slices/editorSlice";
import { isRectangleTool, UpdateElement } from "~/utils";
import { StrokeStylePicker } from "../StrokeStylePicker";
import type { StrokeStyle } from "~/types";
import { PropertiesLabel } from "../PropertiesLabel";

export function RectangleStrokeStylePicker() {
  const defaultStrokeStyle = useAppSelector(
    (s) => s.editor.toolState.RECTANGLE.strokeStyle
  );
  const toolType = useAppSelector((s) => s.editor.toolType);
  const selectedElementIndex = useActiveElementIndex();
  const elements = useActivePageElements();
  const dispatch = useAppDispatch();
  const strokeStyle = useMemo(
    () =>
      selectedElementIndex !== -1 &&
      elements[selectedElementIndex].type === toolTypes.RECTANGLE
        ? elements[selectedElementIndex].element.options.strokeStyle
        : defaultStrokeStyle,
    [defaultStrokeStyle, elements, selectedElementIndex]
  );

  function handleChange(style: StrokeStyle) {
    const selectedElement = elements[selectedElementIndex];
    if (isRectangleTool(toolType)) {
      dispatch(
        setToolState({
          type: toolTypes.RECTANGLE,
          value: { strokeStyle: style },
        })
      );
    }

    if (
      !selectedElement ||
      selectedElement?.type !== toolTypes.RECTANGLE ||
      selectedElementIndex === -1
    ) {
      return;
    }

    UpdateElement.new(elements).rectangle({
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
