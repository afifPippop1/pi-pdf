import { useMemo } from "react";
import type { RgbaColor } from "react-colorful";
import { toolTypes } from "~/constants";
import { useActiveElementIndex } from "~/hooks/useActiveElementIndex";
import { useActivePageElements } from "~/hooks/useActivePageElements";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { setToolState } from "~/store/slices/editorSlice";
import { isRectangleTool, UpdateElement } from "~/utils";
import { ColorPicker } from "../ColorPicker";

export function RectangleOutlinePickerTool() {
  const defaultOutlineColor = useAppSelector(
    (s) => s.editor.toolState.RECTANGLE.outlineColor
  );
  const toolType = useAppSelector((s) => s.editor.toolType);
  const selectedElementIndex = useActiveElementIndex();
  const elements = useActivePageElements();
  const dispatch = useAppDispatch();
  const outlineColor = useMemo(
    () =>
      selectedElementIndex !== -1 &&
      elements[selectedElementIndex].type === toolTypes.RECTANGLE
        ? elements[selectedElementIndex].element.options.outlineColor
        : defaultOutlineColor,
    [defaultOutlineColor, elements, selectedElementIndex]
  );

  function handleChange(color: RgbaColor) {
    const selectedElement = elements[selectedElementIndex];
    if (isRectangleTool(toolType)) {
      dispatch(
        setToolState({
          type: toolTypes.RECTANGLE,
          value: { outlineColor: color },
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
      options: { ...selectedElement.element.options, outlineColor: color },
    });
  }

  return (
    <ColorPicker
      key="rectangle-outline-color"
      title="Outline color"
      onChange={handleChange}
      color={outlineColor}
    />
  );
}
