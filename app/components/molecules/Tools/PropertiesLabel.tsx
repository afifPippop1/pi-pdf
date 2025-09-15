import type { ReactNode } from "react";

export function PropertiesLabel({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs">{label}</p>
      {children}
    </div>
  );
}
