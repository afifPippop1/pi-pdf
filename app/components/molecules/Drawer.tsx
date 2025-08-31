import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

type DrawerContextType = {
  open: boolean;
  onToggle: Dispatch<SetStateAction<boolean>>;
};

const DrawerContext = createContext<DrawerContextType>({
  open: false,
  onToggle() {},
});

export function useDrawer() {
  const ctx = useContext(DrawerContext);
  if (!ctx) {
    throw new Error("useDrawer must be used within a DrawerProvider");
  }

  return ctx;
}

export function Drawer({
  children,
  open,
  onToggle,
}: {
  children: ReactNode;
  open: boolean;
  onToggle: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <DrawerContext.Provider value={{ open, onToggle }}>
      {children}
    </DrawerContext.Provider>
  );
}

export function DrawerTrigger({ children }: { children?: ReactNode }) {
  const { onToggle: setOpen } = useDrawer();
  function toggleFunc() {
    return setOpen((open) => !open);
  }
  return <div onClick={toggleFunc}>{children}</div>;
}

export function DrawerContent({ children }: { children?: ReactNode }) {
  const { open, onToggle: setOpen } = useDrawer();
  function closeFunc() {
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={closeFunc} />

      {/* Drawer panel */}
      <div className="relative flex h-full w-full flex-col overflow-y-auto bg-white py-4 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4">
          <button onClick={closeFunc} className="rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="m7 7l10 10M7 17L17 7"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="relative mt-6 flex-1 px-4 sm:px-6">{children}</div>
      </div>
    </div>
  );
}
