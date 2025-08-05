import React from "react";

interface NavbarMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export function NavbarMenuItem({ children, onClick }: NavbarMenuItemProps) {
  return (
    <button className="text-grey-400 p-2 cursor-pointer" onClick={onClick}>
      {children}
    </button>
  );
}
