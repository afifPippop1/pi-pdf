import { useState } from "react";
import type { BaseCoordinate } from "~/types";

const defaultCoordinate: BaseCoordinate = {
  x: 0,
  y: 0,
};

export function useDrag() {
  const [dragOffset, setDragOffset] =
    useState<BaseCoordinate>(defaultCoordinate);
  function reset() {
    setDragOffset(defaultCoordinate);
  }
  return { dragOffset, setDragOffset, reset };
}
