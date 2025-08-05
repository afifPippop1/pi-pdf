import { useState } from "react";

interface Coordinate {
  x: number;
  y: number;
}

const defaultCoordinate: Coordinate = {
  x: 0,
  y: 0,
};

export function useDrag() {
  const [dragOffset, setDragOffset] = useState<Coordinate>(defaultCoordinate);
  function reset() {
    setDragOffset(defaultCoordinate);
  }
  return { dragOffset, setDragOffset, reset };
}
