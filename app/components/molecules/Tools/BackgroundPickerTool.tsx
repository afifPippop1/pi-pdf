import { useMemo } from "react";
import { RgbaColorPicker, type RgbColor } from "react-colorful";
import { toolTypes } from "~/constants";
import type { Color } from "~/lib/shape/rectangle";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { setToolState } from "~/store/slices/editorSlice";
import { isRectangleTool, updateElement } from "~/utils";

const defaultColor = {
  a: 1,
  r: 255,
  g: 255,
  b: 255,
} as Color;

export function BackgroundPickerTool() {
  const toolType = useAppSelector((s) => s.editor.toolType);
  const selectedElement = useAppSelector((s) => s.editor.selectedElement);
  const els = useAppSelector((s) => s.editor.elements);
  const activePageIndex = useAppSelector((s) => s.editor.activePageIndex);
  const toolState = useAppSelector((s) => s.editor.toolState);
  const dispatch = useAppDispatch();

  const elements = useMemo(() => els[activePageIndex] || [], [els, activePageIndex]);
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

    updateElement(
      {
        ...selectedElement,
        index: selectedElementIndex,
        type: toolTypes.RECTANGLE,
        options: { color },
      },
      elements
    );
  }

  const color = useMemo(() => {
    if (!selectedElement || selectedElement.type !== toolTypes.RECTANGLE)
      return;
    return selectedElement.element.color;
  }, [selectedElement]);

  if (!isRectangleTool(toolType) && !isRectangleTool(selectedElement?.type)) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm">Background color</p>
      <RgbaColorPicker
        color={color || toolState.RECTANGLE.color || defaultColor}
        onChange={handleChange}
      />
    </div>
  );
}
