import { Button } from "~/components/atoms/Button";
import { NavbarMenuItem } from "./MenuItem";
import { savePdfDoc } from "~/utils";
import { useAppSelector } from "~/store/hooks";
import { ColorTypes } from "pdf-lib";

interface NavbarProps {}

export function Navbar({}: NavbarProps) {
  const pdfDoc = useAppSelector((s) => s.editor.pdfDoc);
  const activePageIndex = useAppSelector((s) => s.editor.activePageIndex);
  const elements = useAppSelector((s) => s.editor.elements);

  async function handleSave() {
    if (!pdfDoc) return;
    const page = pdfDoc.getPage(activePageIndex);
    const pageHeight = page.getHeight();
    elements.forEach((element) => {
      const { x, y, width, height } = element.element;
      pdfDoc.getPage(activePageIndex).drawRectangle({
        x,
        y: pageHeight - y - height,
        height,
        width,
        color: {
          type: ColorTypes.RGB,
          blue: 255,
          green: 255,
          red: 255,
        },
      });
    });

    const url = await savePdfDoc(pdfDoc);
    window.open(url);
  }

  return (
    <div className="flex justify-between bg-white px-32 py-4">
      {/* Menu list */}
      <div className="flex gap-4">
        <NavbarMenuItem>File</NavbarMenuItem>
        <NavbarMenuItem>Edit</NavbarMenuItem>
        <NavbarMenuItem>View</NavbarMenuItem>
        <NavbarMenuItem>Help</NavbarMenuItem>
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
