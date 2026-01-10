import type { IconType } from "react-icons";
import { FaRegSquare } from "react-icons/fa";
import { PiCursor } from "react-icons/pi";
import { TbLine } from "react-icons/tb";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Tool } from "../constant/tooltype";
import { useEditorStore } from "../stores/editorStore";
import type { ToolType } from "../types/tooltype";
import { IoEllipseOutline } from "react-icons/io5";

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
        <div
          onClick={handleClick}
          className={activeTool === tool ? "bg-blue-300 p-2 text-white" : "p-2"}
        >
          <Icon />
        </div>
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
      <ToolbarItem label="Select tool" Icon={PiCursor} tool={Tool.SELECT} />

      <ToolbarItem
        label="Rectangle tool"
        Icon={FaRegSquare}
        tool={Tool.RECTANGLE}
      />
      <ToolbarItem label="Line tool" Icon={TbLine} tool={Tool.LINE} />
      <ToolbarItem
        label="Ellipse tool"
        Icon={IoEllipseOutline}
        tool={Tool.ELLIPSE}
      />
    </div>
  );
}
