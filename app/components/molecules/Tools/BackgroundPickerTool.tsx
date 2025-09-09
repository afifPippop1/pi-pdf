import { useMemo } from "react";
import { type RgbColor } from "react-colorful";
import { toolTypes } from "~/constants";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { setToolState } from "~/store/slices/editorSlice";
import { isRectangleTool, UpdateElement } from "~/utils";
import { ColorPicker } from "./ColorPicker";

export function RectangleBackgroundPickerTool() {
  const toolType = useAppSelector((s) => s.editor.toolType);
  const selectedElement = useAppSelector((s) => s.editor.selectedElement);
  const els = useAppSelector((s) => s.editor.elements);
  const activePageIndex = useAppSelector((s) => s.editor.activePageIndex);
  const toolState = useAppSelector((s) => s.editor.toolState);
  const dispatch = useAppDispatch();

  const elements = useMemo(
    () => els[activePageIndex] || [],
    [els, activePageIndex]
  );
  const selectedElementIndex = useMemo(
    () => elements.findIndex((el) => el.id === selectedElement?.id),
    [elements, selectedElement]
  );

  function handleChange(color: RgbColor) {
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
      options: { color },
    });
  }

  const color = useMemo(() => {
    if (!selectedElement || selectedElement.type !== toolTypes.RECTANGLE)
      return toolState.RECTANGLE.color;
    return selectedElement.element.color;
  }, [selectedElement, toolState.RECTANGLE]);

  if (!isRectangleTool(toolType) && !isRectangleTool(selectedElement?.type)) {
    return null;
  }

  return (
    <ColorPicker
      color={color}
      onChange={handleChange}
      title="Background color"
    />
  );
}
