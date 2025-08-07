import * as pdfjsLib from "pdfjs-dist";
import { FaPlus } from "react-icons/fa6";
import { Button } from "~/components/atoms/Button";
import { useAppSelector } from "~/store/hooks";
import {
  drawElementsOnPdfDoc,
  normalizeFileList,
  savePdfAsURL,
  setPDFDoc,
} from "~/utils";
import FileUpload from "../../../../components/molecules/FileUpload";
import NavbarMenu, {
  NavbarMenuContent,
  NavbarMenuItem,
  NavbarMenuTrigger,
} from "./NavbarMenu";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface NavbarProps {}

export function Navbar({}: NavbarProps) {
  const pdfDoc = useAppSelector((s) => s.editor.pdfDoc);
  const elements = useAppSelector((s) => s.editor.elements);

  async function handleSave() {
    if (!pdfDoc) return;
    const doc = await drawElementsOnPdfDoc(elements, pdfDoc);

    const url = await savePdfAsURL(doc);
    window.open(url);
  }

  return (
    <div className="flex justify-between bg-white px-32 py-4">
      {/* Menu list */}
      <div className="flex gap-4">
        <FileMenu />
      </div>
      {/* Action */}
      <div className="flex gap-4">
        <Button
          className="bg-grey-400 text-white rounded-lg"
          onClick={handleSave}
        >
          Save
        </Button>
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
    <NavbarMenu>
      <NavbarMenuTrigger>File</NavbarMenuTrigger>
      <NavbarMenuContent>
        <FileUpload onChange={handleChange} multiple>
          <NavbarMenuItem>
            <FaPlus />
            Add file
          </NavbarMenuItem>
        </FileUpload>
      </NavbarMenuContent>
    </NavbarMenu>
  );
}
