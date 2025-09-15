import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { PopoverArrow } from "~/components/atoms/PopoverArrow";
import { useFloating, offset, flip, shift } from "@floating-ui/react";

interface PopoverProps {
  children: ReactNode;
}

import type { ExtendedRefs, ReferenceType } from "@floating-ui/react";

interface IPopoverContext {
  show: boolean;
  setShow: (show: boolean) => void;
  x: number | null;
  y: number | null;
  refs: ExtendedRefs<ReferenceType>;
  strategy: "absolute" | "fixed";
}

const PopoverContext = createContext<IPopoverContext>({
  show: false,
  setShow() {},
  x: null,
  y: null,
  refs: {
    reference: { current: null },
    floating: { current: null },
    domReference: { current: null },
    setFloating: () => {},
    setPositionReference: () => {},
    setReference: () => {},
  },
  strategy: "absolute",
});

function usePopover() {
  return useContext(PopoverContext);
}

export default function Popover(props: PopoverProps) {
  const contextRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  const { x, y, refs, strategy } = useFloating({
    placement: "bottom-start", // default placement
    middleware: [offset(8), flip(), shift({ padding: 8 })],
  });

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
    <PopoverContext.Provider value={{ show, setShow, x, y, refs, strategy }}>
      <div className="relative inline-block" ref={contextRef}>
        {props.children}
      </div>
    </PopoverContext.Provider>
  );
}

export function PopoverTrigger({ children }: { children: ReactNode }) {
  const { setShow, refs } = usePopover();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShow(true);
  };
  return (
    <div
      ref={refs.setReference}
      onClick={handleClick}
      className="flex items-center justify-center cursor-pointer select-none h-full"
    >
      {children}
    </div>
  );
}

export function PopoverContent({ children }: { children: ReactNode }) {
  const { show, x, y, refs, strategy } = usePopover();

  return show ? (
    <div
      ref={refs.setFloating}
      style={{
        position: strategy,
        top: y ?? 0,
        left: x ?? 0,
      }}
      className="z-10 min-w-48 rounded-md shadow-xl bg-gray-50"
    >
      <PopoverArrow fill="#f9fafb" />
      <div className="p-4 text-sm text-gray-700">{children}</div>
    </div>
  ) : null;
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
      className="select-none cursor-pointer flex items-center gap-2 text-sm lg:text-base"
    >
      {children}
    </div>
  );
}
