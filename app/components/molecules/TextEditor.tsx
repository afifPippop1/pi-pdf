import { useEffect, useMemo, useRef, type FocusEvent } from "react";
import { actions, toolTypes } from "~/constants";
import { useZoom } from "~/hooks/useZoom";
import { useAppSelector } from "~/store/hooks";
import type { Action } from "~/types/action";

interface TextEditorProps {
  action: Action | null;
  onBlur: (event: FocusEvent<HTMLTextAreaElement>) => void;
}

export function TextEditor({ action, onBlur }: TextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const selectedElement = useAppSelector((s) => s.editor.selectedElement);
  const toolState = useAppSelector((s) => s.editor.toolState);
  const { zoom } = useZoom();
  const fontFamily = useMemo(() => {
    if (selectedElement?.type === toolTypes.TEXT) {
      return selectedElement.properties.fontFamily;
    }
    return toolState.TEXT.fontFamily;
  }, [selectedElement, toolState]);
  const fontSize = useMemo(() => {
    if (selectedElement?.type === toolTypes.TEXT) {
      return selectedElement.properties.fontSize;
    }
    return toolState.TEXT.fontSize;
  }, [selectedElement, toolState]);
  const verticalOffset = useMemo(() => -0.3 * fontSize, [fontSize]);

  useEffect(() => {
    if (action === actions.WRITING) {
      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    }
  }, [action]);

  if (action !== actions.WRITING) return null;

  return (
    <textarea
      className="absolute z-50"
      ref={textareaRef}
      style={{
        // TODO: Fix this - 7.3
        top: ((selectedElement?.y1 || 0) + verticalOffset) * zoom,
        left: (selectedElement?.x1 || 0) * zoom,
        margin: 0,
        padding: 0,
        border: 0,
        outline: 0,
        overflow: "hidden",
        whiteSpace: "pre",
        background: "transparent",
        resize: "none",
        fontSize: fontSize * zoom,
        fontFamily,
        lineHeight: 1,
      }}
      onBlur={onBlur}
    />
  );
}
