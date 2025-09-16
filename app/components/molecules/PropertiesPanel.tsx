import { useAppSelector } from "~/store/hooks";
import { RectangleTool } from "./Tools/rectangle/RectangleTool";
import { toolTypes } from "~/constants";
import { TextTool } from "./Tools/TextTool";
import { LineTools } from "./Tools/line/LineTools";

export function PropertiesPanel() {
  const toolType = useAppSelector((s) => s.editor.toolType);
  const selectedElement = useAppSelector((s) => s.editor.selectedElement);
  const type = toolType !== null ? toolType : selectedElement?.type;

  return (
    <div>
      {type === toolTypes.RECTANGLE && <RectangleTool />}
      {type === toolTypes.TEXT && <TextTool />}
      {type === toolTypes.LINE && <LineTools />}
    </div>
  );
}
