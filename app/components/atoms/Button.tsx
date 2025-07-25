import type { ReactNode } from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

export function Button(props: ButtonProps) {
  return (
    <button
      {...props}
      className="px-4 py-2 rounded hover:opacity-90 cursor-pointer bg-primary"
    >
      {props.children}
    </button>
  );
}
