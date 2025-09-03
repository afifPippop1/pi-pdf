import type { ReactNode } from "react";

interface ToolTitleProps {
  children: ReactNode;
}

export function ToolTitle({ children }: ToolTitleProps) {
  return <p>{children}</p>;
}
