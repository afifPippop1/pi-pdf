import { type RgbaColor } from "react-colorful";
import { toolTypes } from "~/constants";
import { useActiveElementIndex } from "~/hooks/useActiveElementIndex";
import { useActivePageElements } from "~/hooks/useActivePageElements";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { setToolState } from "~/store/slices/editorSlice";
import { isRectangleTool, UpdateElement } from "~/utils";
import { ColorPicker } from "../ColorPicker";
import { useMemo } from "react";
import { PropertiesLabel } from "../PropertiesLabel";

export function RectangleBackgroundPickerTool() {
  const defaultColor = useAppSelector(
    (s) => s.editor.toolState.RECTANGLE.color
  );
  const toolType = useAppSelector((s) => s.editor.toolType);
  const selectedElementIndex = useActiveElementIndex();
  const elements = useActivePageElements();
  const dispatch = useAppDispatch();

  const color = useMemo(
    () =>
      selectedElementIndex !== -1 &&
      elements[selectedElementIndex].type === toolTypes.RECTANGLE
        ? elements[selectedElementIndex].element.options.color
        : defaultColor,
    [defaultColor, elements, selectedElementIndex]
  );

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

    UpdateElement.new(elements).rectangle({
      ...selectedElement,
      index: selectedElementIndex,
      options: { ...selectedElement.element.options, color },
    });
  }

  return (
    <PropertiesLabel label="Background">
      <ColorPicker
        key="rectangle-background-color"
        color={color}
        onChange={handleChange}
        title="Background color"
      />
    </PropertiesLabel>
  );
}
