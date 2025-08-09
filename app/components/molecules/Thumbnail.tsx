import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { setActivePageIndex } from "~/store/slices/editorSlice";
import { getPageFromIndex } from "~/utils";
import { Button } from "../atoms/Button";
import ContextMenu, {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ContextMenu";

interface ThumbnailProps {
  onRemove: (index: number) => void;
}

export function Thumbnail(props: ThumbnailProps) {
  const pdfDoc = useAppSelector((s) => s.editor.pdfDoc);

  const dispatch = useAppDispatch();
  return (
    <div className="flex flex-col items-center gap-2 p-4">
      {pdfDoc?.getPageIndices().map((index) => (
        <ContextMenu key={index}>
          <ContextMenuTrigger>
            <Button
              key={index}
              onClick={() => dispatch(setActivePageIndex(index))}
              className="w-32 h-48"
            >
              {getPageFromIndex(index)}
            </Button>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem
              onClick={async () => {
                props.onRemove(index);
              }}
            >
              Remove
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ))}
    </div>
  );
}
