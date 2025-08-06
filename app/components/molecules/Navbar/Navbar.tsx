import { ColorTypes } from "pdf-lib";
import { FaPlus } from "react-icons/fa6";
import { Button } from "~/components/atoms/Button";
import { Line, Rectangle } from "~/lib/shape";
import { useAppSelector } from "~/store/hooks";
import { savePdfDoc } from "~/utils";
import { NavbarMenuItem } from "./MenuItem";

interface NavbarProps {}

export function Navbar({}: NavbarProps) {
  const pdfDoc = useAppSelector((s) => s.editor.pdfDoc);
  const activePageIndex = useAppSelector((s) => s.editor.activePageIndex);
  const elements = useAppSelector((s) => s.editor.elements);

  async function handleSave() {
    if (!pdfDoc) return;
    const page = pdfDoc.getPage(activePageIndex);
    const pageHeight = page.getHeight();
    elements[activePageIndex].forEach(({ element }) => {
      if (element instanceof Rectangle) {
        const { x, y, width, height } = element;
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
      }
      if (element instanceof Line) {
        const { x1, y1, x2, y2 } = element;
        pdfDoc.getPage(activePageIndex).drawLine({
          start: {
            x: x1,
            y: pageHeight - y1,
          },
          end: {
            x: x2,
            y: pageHeight - y2,
          },
          color: {
            type: ColorTypes.RGB,
            blue: 0,
            green: 0,
            red: 0,
          },
        });
      }
    });

    const url = await savePdfDoc(pdfDoc);
    window.open(url);
  }

  return (
    <div className="flex justify-between bg-white px-32 py-4">
      {/* Menu list */}
      <div className="flex gap-4">
        <NavbarMenuItem label="File">
          <div className="flex flex-col items-stretch">
            <button className="flex items-center justify-start cursor-pointer gap-2">
              <FaPlus />
              Add file
            </button>
          </div>
        </NavbarMenuItem>
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
