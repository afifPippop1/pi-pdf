import classNames from "classnames";
import type { ReactNode } from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

export function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={classNames("btn btn-xs md:btn-sm btn-primary", className)}
    >
      {props.children}
    </button>
  );
}
