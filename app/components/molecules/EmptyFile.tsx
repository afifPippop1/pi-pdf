import { normalizeFileList, setPDFDoc } from "~/utils";
import { Button } from "../atoms/Button";
import { UploadIcon } from "../atoms/UploadIcon";
import FileUpload from "./FileUpload";

export default function EmptyFile() {
  async function handleChange(files: FileList | null) {
    const f = normalizeFileList(files);
    if (f.length) {
      setPDFDoc(f);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
      <UploadIcon />
      <p className="text-grey-400">Please upload document to start editing</p>
      <FileUpload onChange={handleChange} multiple>
        <Button>Upload</Button>
      </FileUpload>
    </div>
  );
}
