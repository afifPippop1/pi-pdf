import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { PopoverArrow } from "~/components/atoms/PopoverArrow";

interface PopoverProps {
  children: ReactNode;
}

interface IPopoverContext {
  show: boolean;
  setShow: (show: boolean) => void;
}

const PopoverContext = createContext<IPopoverContext>({
  show: false,
  setShow() {},
});

function usePopover() {
  return useContext(PopoverContext);
}

export default function Popover(props: PopoverProps) {
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
    <PopoverContext.Provider value={{ show, setShow }}>
      <div className="relative inline-block" ref={contextRef}>
        {props.children}
      </div>
    </PopoverContext.Provider>
  );
}

export function PopoverTrigger({ children }: { children: ReactNode }) {
  const { setShow } = usePopover();
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShow(true);
  };
  return (
    <div
      onClick={handleClick}
      className="flex items-center justify-center cursor-pointer text-primary select-none h-full"
    >
      {children}
    </div>
  );
}

export function PopoverContent({ children }: { children: ReactNode }) {
  const { show } = usePopover();
  return (
    <div
      id="popoverPanel"
      className={
        show
          ? "absolute z-10 mt-2 min-w-48 rounded-md shadow-xl bg-gray-50"
          : "hidden"
      }
    >
      <PopoverArrow fill="#f9fafb" />
      <div className="p-4 text-sm text-gray-700">{children}</div>
    </div>
  );
}

export function PopoverItem({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  const { setShow } = usePopover();
  function handleClick() {
    setShow(false);
    onClick?.();
  }
  return (
    <div
      onClick={handleClick}
      className="select-none cursor-pointer flex items-center gap-2"
    >
      {children}
    </div>
  );
}
