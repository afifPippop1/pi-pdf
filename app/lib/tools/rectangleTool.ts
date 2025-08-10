import { toolTypes } from "~/constants";
import type { Tool } from "./tool";

export class RectangleTool implements Tool {
  name = toolTypes.RECTANGLE;
}
