import { useMemo } from "react";
import { RgbaColorPicker, RgbColorPicker, type RgbColor } from "react-colorful";
import { IoColorFill } from "react-icons/io5";
import { toolTypes } from "~/constants";
import { useAppSelector } from "~/store/hooks";
import { updateElement } from "~/utils";
import Popover, { PopoverContent, PopoverTrigger } from "../Popover";

export function BackgroundPickerTool() {
  const selectedElement = useAppSelector((s) => s.editor.selectedElement);
  const els = useAppSelector((s) => s.editor.elements);
  const activePageIndex = useAppSelector((s) => s.editor.activePageIndex);
  const elements = useMemo(() => els[activePageIndex], [els, activePageIndex]);
  const selectedElementIndex = useMemo(
    () => elements.findIndex((el) => el.id === selectedElement?.id),
    [elements, selectedElement]
  );

  function handleChange(color: RgbColor) {
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

  if (!selectedElement || selectedElement.type !== toolTypes.RECTANGLE)
    return null;

  return (
    <Popover>
      <PopoverTrigger>
        <button className="flex flex-col gap-0.5">
          <IoColorFill />
          <div className="w-full h-1 bg-black" />
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <RgbaColorPicker color={color} onChange={handleChange} />
      </PopoverContent>
    </Popover>
  );
}
