import { useMemo } from "react";
import { type RgbaColor, type RgbColor } from "react-colorful";
import { toolTypes } from "~/constants";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { setToolState } from "~/store/slices/editorSlice";
import { isRectangleTool, UpdateElement } from "~/utils";
import { ColorPicker } from "../ColorPicker";
import { useActiveElementIndex } from "~/hooks/useActiveElementIndex";
import { useActivePageElements } from "~/hooks/useActivePageElements";

export function RectangleBackgroundPickerTool() {
  const color = useAppSelector((s) => s.editor.toolState.RECTANGLE.color);
  const toolType = useAppSelector((s) => s.editor.toolType);
  const selectedElementIndex = useActiveElementIndex();
  const elements = useActivePageElements();
  const dispatch = useAppDispatch();

  function handleChange(color: RgbaColor) {
    const selectedElement = elements[selectedElementIndex];
    if (isRectangleTool(toolType)) {
      dispatch(setToolState({ type: toolTypes.RECTANGLE, value: { color } }));
    }

    if (
      !selectedElement ||
      selectedElement?.type !== toolTypes.RECTANGLE ||
      selectedElementIndex === -1
    ) {
      return;
    }
    const options = {
      outlineColor: { ...selectedElement.element.options.outlineColor },
      color,
    };

    UpdateElement.new(elements).rectangle({
      ...selectedElement,
      index: selectedElementIndex,
      options,
    });
  }

  return (
    <ColorPicker
      key="rectangle-background-color"
      color={color}
      onChange={handleChange}
      title="Background color"
    />
  );
}
