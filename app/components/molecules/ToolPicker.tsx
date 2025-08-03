import clsx from "clsx";
import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import { FaRegSquare } from "react-icons/fa6";
import { toolTypes } from "~/constants";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { setToolType } from "~/store/slices/editorSlice";
import type { ToolType } from "~/types";

export function ToolPicker() {
  return (
    <div className="min-h-24 rounded-e-md bg-grey-400 absolute left-0 top-1/2 p-2 flex flex-col items-center justify-center">
      <ToolItem type={toolTypes.RECTANGLE} icon={FaRegSquare} />
    </div>
  );
}

interface ToolItemProps {
  type: ToolType;
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
