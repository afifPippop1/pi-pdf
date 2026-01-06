import type { ReactNode } from "react";
import { Spinner } from "../ui/spinner";

export function LoaderScreen({
  children,
  isLoading,
}: {
  children: ReactNode;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-dvh w-dvw">
        <Spinner />
      </div>
    );
  }

  return children;
}
