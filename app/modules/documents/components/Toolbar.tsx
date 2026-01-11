import type { IconType } from "react-icons";
import { FaFont, FaRegSquare } from "react-icons/fa";
import { IoEllipseOutline } from "react-icons/io5";
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
import { cva } from "class-variance-authority";
import { cn } from "~/lib/utils";
import type { ComponentProps } from "react";

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
          className={cn(
            "p-2",
            activeTool === tool && "bg-blue-300 text-white rounded-md",
          )}
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

const toolBarVariants = cva(
  "flex flex-col items-center justify-start gap-2 border border-gray-200 rounded-md p-2",
  {
    variants: {},
    defaultVariants: {},
  },
);

export function Toolbar({ className }: ComponentProps<"div">) {
  return (
    <div className={cn(toolBarVariants({ className }))}>
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

      {/* <ToolbarItem label="Text tool" Icon={FaFont} tool={Tool.TEXT} /> */}
    </div>
  );
}
