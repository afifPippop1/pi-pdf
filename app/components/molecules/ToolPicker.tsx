import clsx from "clsx";
import type { IconType } from "react-icons";
import { FaRegSquare } from "react-icons/fa6";
import { LuMousePointer2 } from "react-icons/lu";
import { toolTypes } from "~/constants";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { setToolType } from "~/store/slices/editorSlice";
import type { ToolType } from "~/types";

export function ToolPicker() {
  return (
    <div className="min-h-24 rounded-e-md bg-grey-400 absolute left-0 top-1/2 p-2 flex flex-col items-center justify-center gap-4">
      <ToolItem type={null} icon={LuMousePointer2} />
      <ToolItem type={toolTypes.RECTANGLE} icon={FaRegSquare} />
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
        "hover:text-gray-300 text-2xl cursor-pointer",
        isActive ? "text-gray-300" : "text-white"
      )}
      onClick={handleClick}
    >
      <props.icon />
    </button>
  );
}
