import { useEffect, useRef, useState } from "react";
import type { BaseCoordinate } from "~/types";

const defaultCoordinate: BaseCoordinate = {
  x: 0,
  y: 0,
};

export function useDrag() {
  const [dragOffset, setDragOffset] =
    useState<BaseCoordinate>(defaultCoordinate);
  const ref = useRef(dragOffset);
  function reset() {
    setDragOffset(defaultCoordinate);
  }
  useEffect(() => {
    ref.current = dragOffset;
  }, [dragOffset]);

  return { ref, dragOffset, setDragOffset, reset };
}
