import { Suspense } from "react";
import { FaPlus } from "react-icons/fa6";
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
  return (
    <div className="flex justify-between bg-white px-32 py-4 shadow-xl border-b border-b-gray-200">
      {/* Menu list */}
      <div className="flex gap-4">
        <FileMenu />
      </div>
      {/* Action */}
      <div className="flex gap-4">
        <Suspense fallback={<></>}>
          <SavePDFButton />
        </Suspense>
      </div>
    </div>
  );
}

function FileMenu() {
  async function handleChange(files: FileList | null) {
    const f = normalizeFileList(files);
    if (f.length) {
      setPDFDoc(f);
    }
  }
  return (
    <Popover>
      <PopoverTrigger>File</PopoverTrigger>
      <PopoverContent>
        <FileUpload onChange={handleChange} multiple>
          <PopoverItem>
            <FaPlus />
            Add file
          </PopoverItem>
        </FileUpload>
      </PopoverContent>
    </Popover>
  );
}
