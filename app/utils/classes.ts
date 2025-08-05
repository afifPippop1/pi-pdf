// Combine classname

import clsx from "clsx";

export function classes(...className: (string | undefined)[]) {
  return clsx(className);
}
