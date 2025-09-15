import { useMemo } from "react";
import type { RgbaColor } from "react-colorful";
import { toolTypes } from "~/constants";
import { useActiveElementIndex } from "~/hooks/useActiveElementIndex";
import { useActivePageElements } from "~/hooks/useActivePageElements";
import { useAppSelector, useAppDispatch } from "~/store/hooks";
import { setToolState } from "~/store/slices/editorSlice";
import { isRectangleTool, UpdateElement } from "~/utils";
import { StrokePicker } from "../StrokePicker";

export function RectangleStrokePicker() {
  const defaultStrokeWidth = useAppSelector(
    (s) => s.editor.toolState.RECTANGLE.strokeWidth
  );
  const toolType = useAppSelector((s) => s.editor.toolType);
  const selectedElementIndex = useActiveElementIndex();
  const elements = useActivePageElements();
  const dispatch = useAppDispatch();
  const strokeWidth = useMemo(
    () =>
      selectedElementIndex !== -1 &&
      elements[selectedElementIndex].type === toolTypes.RECTANGLE
        ? elements[selectedElementIndex].element.options.strokeWidth
        : defaultStrokeWidth,
    [defaultStrokeWidth, elements, selectedElementIndex]
  );

  function handleChange(width: number) {
    const selectedElement = elements[selectedElementIndex];
    if (isRectangleTool(toolType)) {
      dispatch(
        setToolState({
          type: toolTypes.RECTANGLE,
          value: { strokeWidth: width },
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
      options: { ...selectedElement.element.options, strokeWidth: width },
    });
  }
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs">Stroke width</p>
      <StrokePicker onChange={handleChange} width={strokeWidth} />
    </div>
  );
}
