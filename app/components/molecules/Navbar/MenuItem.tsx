import React, { useEffect, useRef, useState, type MouseEvent } from "react";

interface NavbarMenuItemProps {
  children?: React.ReactNode;
  label: string;
  onClick?: () => void;
}

export function NavbarMenuItem({
  children,
  label,
  onClick,
}: NavbarMenuItemProps) {
  const [show, setShow] = useState(false);
  function handleClick() {
    setShow((s) => !s);
  }
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | Event) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setShow(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <button
        className="text-grey-400 p-2 cursor-pointer"
        onClick={onClick || handleClick}
      >
        {label}
      </button>
      <div
        id="popoverPanel"
        className={
          show
            ? "absolute z-10 mt-2 min-w-48 rounded-md shadow-lg bg-white"
            : "absolute z-10 mt-2 min-w-48 rounded-md shadow-lg bg-white hidden"
        }
      >
        <div className="p-4 text-sm text-gray-700">{children}</div>
      </div>
    </div>
  );
}
