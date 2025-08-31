import { Suspense, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { BurgerIcon } from "~/components/atoms/BurgerIcon";
import { Drawer, DrawerContent } from "~/components/molecules/Drawer";
import { normalizeFileList, setPDFDoc } from "~/utils";
import FileUpload from "../FileUpload";
import Popover, {
  PopoverContent,
  PopoverItem,
  PopoverTrigger,
} from "../Popover";
import { SavePDFButton } from "./SavePDFButton.client";

interface NavbarProps {}

export function Navbar({}: NavbarProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex justify-between bg-white px-4 md:px-32 py-4 shadow-xl border-b border-b-gray-200">
      {/* Mobile */}
      <div className="md:hidden flex">
        <Drawer open={open} onToggle={setOpen}>
          <div onClick={() => setOpen(true)}>
            <BurgerIcon />
          </div>
          <DrawerContent>
            <div className="flex flex-col gap-2">
              <p className="border-b text-sm lg:text-base">File</p>
              <div className="px-4">
                <FileMenuContent onFileAdded={() => setOpen(false)} />
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Desktop */}
      {/* Menu list */}
      <div className="md:flex gap-4 hidden">
        <FileMenu />
      </div>
      {/* Action */}
      <div className="hidden md:flex gap-4">
        <Suspense fallback={<></>}>
          <SavePDFButton />
        </Suspense>
      </div>
    </div>
  );
}

function FileMenu() {
  return (
    <Popover>
      <PopoverTrigger>File</PopoverTrigger>
      <PopoverContent>
        <FileMenuContent />
      </PopoverContent>
    </Popover>
  );
}

interface FileMenuContentProps {
  onFileAdded?: () => void;
}

function FileMenuContent(props: FileMenuContentProps) {
  function handleChange(files: FileList | null) {
    const f = normalizeFileList(files);
    if (f.length) {
      setPDFDoc(f);
    }
    props.onFileAdded?.();
  }
  return (
    <FileUpload onChange={handleChange} multiple>
      <PopoverItem>
        <FaPlus />
        Add file
      </PopoverItem>
    </FileUpload>
  );
}
