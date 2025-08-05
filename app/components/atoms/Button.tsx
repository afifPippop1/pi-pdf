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
      className={classNames(
        "px-4",
        "py-2",
        "rounded",
        "hover:opacity-90",
        "cursor-pointer",
        "bg-grey-400",
        "text-white",
        className
      )}
    >
      {props.children}
    </button>
  );
}
