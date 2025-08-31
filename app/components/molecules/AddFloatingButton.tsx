import { useState } from "react";
import { normalizeFileList, setPDFDoc } from "~/utils";
import { AddFileIcon } from "../atoms/AddFileIcon";
import FileUpload from "./FileUpload";

export function AddFloatingButton() {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  function handleChange(files: FileList | null) {
    const f = normalizeFileList(files);
    if (f.length) {
      setPDFDoc(f);
    }
    setShowMenu(false);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {showMenu && (
        <div className="mb-2 bg-white shadow p-2 rounded flex flex-col justify-center gap-2">
          <FileUpload multiple onChange={handleChange}>
            <div className="flex items-center gap-2 cursor-pointer text-sm">
              <AddFileIcon />
              Add File
            </div>
          </FileUpload>
        </div>
      )}

      {/* Button */}
      <button
        className="rounded-full p-2 md:p-4 bg-blue-500 shadow-lg cursor-pointer"
        onClick={() => setShowMenu((s) => !s)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="#FFFFFF"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 5v14m-7-7h14"
          />
        </svg>
      </button>
    </div>
  );
}
