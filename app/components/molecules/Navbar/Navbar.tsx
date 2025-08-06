import { FaPlus } from "react-icons/fa6";
import { Button } from "~/components/atoms/Button";
import { useAppSelector } from "~/store/hooks";
import { drawElementsOnPdfDoc, savePdfAsURL } from "~/utils";
import FileUpload from "../FileUpload";
import NavbarMenu, {
  NavbarMenuContent,
  NavbarMenuItem,
  NavbarMenuTrigger,
} from "./NavbarMenu";

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
  return (
    <NavbarMenu>
      <NavbarMenuTrigger>File</NavbarMenuTrigger>
      <NavbarMenuContent>
        <FileUpload>
          <NavbarMenuItem>
            <FaPlus />
            Add file
          </NavbarMenuItem>
        </FileUpload>
      </NavbarMenuContent>
    </NavbarMenu>
  );
}
