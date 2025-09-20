import clsx from "clsx";
import type { IconType } from "react-icons";
import { BiText } from "react-icons/bi";
import { FaRegSquare } from "react-icons/fa6";
import { LuMousePointer2 } from "react-icons/lu";
import { TbLine } from "react-icons/tb";
import { toolTypes } from "~/constants";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { setToolType } from "~/store/slices/editorSlice";
import type { ToolType } from "~/types";

export function ToolPicker() {
  return (
    <div className="flex gap-4 p-4">
      <ToolItem type={null} icon={LuMousePointer2} />
      <ToolItem type={toolTypes.RECTANGLE} icon={FaRegSquare} shortcut="r" />
      <ToolItem type={toolTypes.LINE} icon={TbLine} shortcut="l" />
      <ToolItem type={toolTypes.TEXT} icon={BiText} shortcut="t" />
    </div>
  );
}

interface ToolItemProps {
  type: ToolType | null;
  icon: IconType;
  shortcut?: string;
}

function ToolItem(props: ToolItemProps) {
  const toolType = useAppSelector((s) => s.editor.toolType);
  const isActive = toolType === props.type;

  const dispatch = useAppDispatch();
  function handleClick() {
    dispatch(setToolType(props.type));
  }
  return (
    <button
      className={clsx(
        "btn btn-sm relative",
        isActive ? "btn-primary btn-active btn-soft" : "btn-ghost"
      )}
      onClick={handleClick}
    >
      <props.icon />
      <span className="absolute bottom-0 right-1 italic">{props.shortcut}</span>
    </button>
  );
}
