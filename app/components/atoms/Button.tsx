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
        "btn",
        // "px-4",
        // "py-2",
        // "rounded",
        // "hover:bg-blue-500/90",
        // "cursor-pointer",
        // "bg-blue-500",
        // "text-white",
        // "text-xs",
        // "md:text-base",
        className
      )}
    >
      {props.children}
    </button>
  );
}
