export function PopoverArrow({ fill }: { fill?: string }) {
  return (
    <svg
      className="absolute top-0 left-4 -translate-x-1/2 -translate-y-1/2"
      width="16"
      height="8"
      viewBox="0 0 16 8"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 0 C8.5 0 9.5 0.5 10 1 L16 8 H0 L6 1 C6.5 0.5 7.5 0 8 0 Z"
        fill={fill || "white"}
      />
    </svg>
  );
}
