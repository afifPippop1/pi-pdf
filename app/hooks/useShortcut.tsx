import { useEffect, useLayoutEffect } from "react";
import { toolTypes } from "~/constants";
import { useAppDispatch } from "~/store/hooks";
import { setToolType } from "~/store/slices/editorSlice";

const shortcut = {
  h: "h",
  r: "r",
  t: "t",
  l: "l",
} as const;

export function useShortcut() {
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    document.addEventListener("keypress", ({ key }) => {
      if (key === shortcut.h) {
        dispatch(setToolType(null));
      }
      if (key === shortcut.r) {
        dispatch(setToolType(toolTypes.RECTANGLE));
      }
      if (key === shortcut.t) {
        dispatch(setToolType(toolTypes.TEXT));
      }
      if (key === shortcut.l) {
        dispatch(setToolType(toolTypes.LINE));
      }
    });
    return () => document.removeEventListener("keypress", () => {});
  }, []);
}
