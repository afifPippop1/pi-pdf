import { useAppSelector } from "~/store/hooks";
import { RectangleTool } from "./Tools/RectangleTool";
import { toolTypes } from "~/constants";
import { TextTool } from "./Tools/TextTool";

export function PropertiesPanel() {
  const toolType = useAppSelector((s) => s.editor.toolType);
  const selectedElement = useAppSelector((s) => s.editor.selectedElement);
  const type = toolType !== null ? toolType : selectedElement?.type;

  return (
    <div>
      {type === toolTypes.RECTANGLE && <RectangleTool />}
      {type === toolTypes.TEXT && <TextTool />}
    </div>
  );
}
