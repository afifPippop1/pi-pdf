import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type Primitive = string | number | boolean;

export interface Option {
  label: string;
  value: Primitive;
}

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
  const { show, setShow } = useContextMenu();
  return (
    <div
      id="popoverPanel"
      className={
        show
          ? "absolute z-10 mt-2 min-w-48 rounded-md shadow-lg bg-white"
          : "absolute z-10 mt-2 min-w-48 rounded-md shadow-lg bg-white hidden"
      }
      onClick={() => setShow(false)}
    >
      <svg
        className="absolute top-0 left-4 -translate-x-1/2 -translate-y-1/2"
        width="16"
        height="8"
        viewBox="0 0 16 8"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 0 C8.5 0 9.5 0.5 10 1 L16 8 H0 L6 1 C6.5 0.5 7.5 0 8 0 Z"
          fill="white"
        />
      </svg>

      <div className="p-4 text-sm text-gray-700">{children}</div>
    </div>
  );
}

export function ContextMenuItem({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  const { setShow } = useContextMenu();
  function handleClick() {
    setShow(false);
    onClick?.();
  }
  return (
    <div onClick={handleClick} className="select-none cursor-pointer">
      {children}
    </div>
  );
}
