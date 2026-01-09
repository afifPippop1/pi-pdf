import { useEffect, type ReactNode } from "react";
import { FaRegSquare } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { TbLine } from "react-icons/tb";
import { useEditorStore } from "../stores/editorStore";
import type { IconType } from "react-icons";
import type { ToolType } from "../types/tooltype";
import { Tool } from "../constant/tooltype";

function ToolbarItem({
  label,
  Icon,
  tool,
}: {
  label: string;
  Icon: IconType;
  tool: ToolType;
}) {
  const activeTool = useEditorStore((s) => s.tool);
  const setTool = useEditorStore((s) => s.setTool);
  function handleClick() {
    setTool(tool as ToolType);
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Icon onClick={handleClick} />
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function Toolbar() {
  return (
    <div className="flex items-center gap-2">
      <ToolbarItem
        label="Rectangle tool"
        Icon={FaRegSquare}
        tool={Tool.RECTANGLE}
      />
      <ToolbarItem label="Line tool" Icon={TbLine} tool={Tool.LINE} />
    </div>
  );
}
