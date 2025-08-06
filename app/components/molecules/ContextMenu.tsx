import { useEffect, useState, type ReactNode } from "react";

type Primitive = string | number | boolean;

export interface Option {
  label: string;
  value: Primitive;
}

interface ContextMenuProps {
  children: ReactNode;
  options: Option[];
  onChange?: (option: Option) => void;
}

export default function ContextMenu(props: ContextMenuProps) {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.pageX, y: e.pageY });
    setShow(true);
  };

  const handleClick = () => setShow(false);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div onContextMenu={handleContextMenu}>
      {props.children}

      {show && (
        <ul
          className="absolute z-50 bg-white shadow-lg border rounded-md w-48 py-1"
          style={{ top: position.y, left: position.x }}
        >
          {props.options.map((option, index) => (
            <li
              key={index}
              className="px-4 py-2 cursor-pointer hover:opacity-80"
              // @ts-ignore
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                props.onChange?.(option);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
