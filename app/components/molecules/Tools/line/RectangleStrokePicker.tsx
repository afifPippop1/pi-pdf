import { useMemo } from "react";
import { toolTypes } from "~/constants";
import { useActiveElementIndex } from "~/hooks/useActiveElementIndex";
import { useActivePageElements } from "~/hooks/useActivePageElements";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { setToolState } from "~/store/slices/editorSlice";
import { isLineTool, UpdateElement } from "~/utils";
import { PropertiesLabel } from "../PropertiesLabel";
import { StrokePicker } from "../StrokePicker";

export function LineStrokePicker() {
  const defaultStrokeWidth = useAppSelector(
    (s) => s.editor.toolState.LINE.strokeWidth
  );
  const toolType = useAppSelector((s) => s.editor.toolType);
  const selectedElementIndex = useActiveElementIndex();
  const elements = useActivePageElements();
  const dispatch = useAppDispatch();
  const strokeWidth = useMemo(
    () =>
      selectedElementIndex !== -1 &&
      elements[selectedElementIndex].type === toolTypes.LINE
        ? elements[selectedElementIndex].element.options.strokeWidth
        : defaultStrokeWidth,
    [defaultStrokeWidth, elements, selectedElementIndex]
  );

  function handleChange(width: number) {
    const selectedElement = elements[selectedElementIndex];
    if (isLineTool(toolType)) {
      dispatch(
        setToolState({
          type: toolTypes.LINE,
          value: { strokeWidth: width },
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
      options: { ...selectedElement.element.options, strokeWidth: width },
    });
  }
  return (
    <PropertiesLabel label="Stroke width">
      <StrokePicker onChange={handleChange} width={strokeWidth} />
    </PropertiesLabel>
  );
}
