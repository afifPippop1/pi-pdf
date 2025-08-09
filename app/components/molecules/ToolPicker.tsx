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
      <ToolItem type={toolTypes.RECTANGLE} icon={FaRegSquare} />
      <ToolItem type={toolTypes.LINE} icon={TbLine} />
      <ToolItem type={toolTypes.TEXT} icon={BiText} />
    </div>
  );
}

interface ToolItemProps {
  type: ToolType | null;
  icon: IconType;
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
        "hover:text-grey-400 text-xl cursor-pointer",
        isActive ? "text-grey-400" : "text-gray-400"
      )}
      onClick={handleClick}
    >
      <props.icon />
    </button>
  );
}
