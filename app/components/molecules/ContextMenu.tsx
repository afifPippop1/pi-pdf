import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { PopoverArrow } from "../atoms/PopoverArrow";
import clsx from "clsx";

interface ContextMenuProps {
  children: ReactNode;
}

interface IContextMenuContext {
  show: boolean;
  setShow: (show: boolean) => void;
}

const ContextMenuContext = createContext<IContextMenuContext>({
  show: false,
  setShow() {},
});

function useContextMenu() {
  return useContext(ContextMenuContext);
}

export default function ContextMenu(props: ContextMenuProps) {
  const contextRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | Event) {
      if (
        contextRef.current &&
        !contextRef.current.contains(event.target as Node)
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
    <ContextMenuContext.Provider value={{ show, setShow }}>
      <div className="relative inline-block" ref={contextRef}>
        {props.children}
      </div>
    </ContextMenuContext.Provider>
  );
}

export function ContextMenuTrigger({ children }: { children: ReactNode }) {
  const { setShow } = useContextMenu();
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShow(true);
  };
  return <div onContextMenu={handleContextMenu}>{children}</div>;
}

export function ContextMenuContent({ children }: { children: ReactNode }) {
  const { show } = useContextMenu();
  return (
    <div
      id="popoverPanel"
      className={
        show
          ? "absolute z-10 mt-2 min-w-48 rounded-md shadow-lg bg-white"
          : "hidden"
      }
    >
      <PopoverArrow />
      <div className="text-sm text-gray-700">{children}</div>
    </div>
  );
}

export function ContextMenuItem({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const { setShow } = useContextMenu();
  function handleClick(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setShow(false);
    onClick?.();
  }
  return (
    <div
      onClick={handleClick}
      className={clsx(
        "select-none cursor-pointer flex gap-2 items-center p-4 hover:bg-gray-50",
        className
      )}
    >
      {children}
    </div>
  );
}
