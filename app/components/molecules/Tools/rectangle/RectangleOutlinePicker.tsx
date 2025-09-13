import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { ColorPicker } from "../ColorPicker";
import type { RgbaColor, RgbColor } from "react-colorful";
import { isRectangleTool, UpdateElement } from "~/utils";
import { setToolState } from "~/store/slices/editorSlice";
import { toolTypes } from "~/constants";
import { useActiveElementIndex } from "~/hooks/useActiveElementIndex";
import { useActivePageElements } from "~/hooks/useActivePageElements";

export function RectangleOutlinePickerTool() {
  const outlineColor = useAppSelector(
    (s) => s.editor.toolState.RECTANGLE.outlineColor
  );
  const toolType = useAppSelector((s) => s.editor.toolType);
  const selectedElementIndex = useActiveElementIndex();
  const elements = useActivePageElements();
  const dispatch = useAppDispatch();

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

    const options = {
      color: { ...selectedElement.element.options.color },
      outlineColor: color,
    };
    UpdateElement.new(elements).rectangle({
      ...selectedElement,
      index: selectedElementIndex,
      options,
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
