import { useContext } from "react";
import ZoomContext from "~/context/ZoomContext";

export function useZoom() {
  const ctx = useContext(ZoomContext);
  if (!ctx) {
    throw new Error("useZoom must be used within ZoomProvier");
  }
  return ctx;
}
