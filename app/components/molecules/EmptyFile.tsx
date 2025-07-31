import { useDispatch } from "react-redux";
import { setFiles } from "~/store/slices/editorSlice";
import { normalizeFileList } from "~/utils";
import { Button } from "../atoms/Button";
import { UploadIcon } from "../atoms/UploadIcon";
import FileUpload from "./FileUpload";

export default function EmptyFile() {
  const dispatch = useDispatch();
  function handleChange(files: FileList | null) {
    dispatch(setFiles(normalizeFileList(files)));
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
