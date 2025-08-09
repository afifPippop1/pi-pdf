export function swapArrayValue<T = any>(
  array: T[],
  activeIndex: number,
  overIndex: number
) {
  [array[activeIndex], array[overIndex]] = [
    array[overIndex],
    array[activeIndex],
  ];
}
