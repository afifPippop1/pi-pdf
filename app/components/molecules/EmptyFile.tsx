import { useDispatch } from "react-redux";
import { setFiles, setPDFDoc } from "~/store/slices/editorSlice";
import { normalizeFileList } from "~/utils";
import { Button } from "../atoms/Button";
import { UploadIcon } from "../atoms/UploadIcon";
import FileUpload from "./FileUpload";
import { PDFDocument } from "pdf-lib";

export default function EmptyFile() {
  const dispatch = useDispatch();
  async function handleChange(files: FileList | null) {
    const f = normalizeFileList(files);
    if (f.length) {
      const buffer = await f[0].arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer);
      dispatch(setPDFDoc(pdfDoc));
    }
    dispatch(setFiles(f));
  }
  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
      <UploadIcon />
      <p className="text-grey-400">Please upload document to start editing</p>
      <FileUpload onChange={handleChange}>
        <Button>Upload</Button>
      </FileUpload>
    </div>
  );
}
