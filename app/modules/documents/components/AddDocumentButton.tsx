import { FaPlus } from "react-icons/fa6";
import FileUpload from "~/components/molecules/FileUpload";
import { Button } from "~/components/ui/button";
import { checkSize } from "~/utils/fileSize";
import { uploadDocument } from "../api/document-storage.api";
import { insertDocument } from "../api/documents.api";

export function AddDocumentButton() {
  async function handleChange(files: FileList | null) {
    let totlalSize = 0;
    for (const file of files || []) {
      totlalSize += file.size;
    }
    const { error } = checkSize(totlalSize);
    if (error) {
      alert(error);
      return;
    }
    // TODO: Upload Combined File
    const file = files?.[0];
    if (!file) return;
    const uploadDocRes = await uploadDocument({ file });
    if (uploadDocRes.error) {
      alert(uploadDocRes.error.message);
      return;
    }
    const docId = uploadDocRes.data.id;

    const insertDocRes = await insertDocument({
      name: file.name,
      id: docId,
    });

    if (insertDocRes.error) {
      alert(insertDocRes.error.message);
      return;
    }
  }

  return (
    <FileUpload onChange={handleChange}>
      <Button size={"sm"}>
        <FaPlus />
        Add Document
      </Button>
    </FileUpload>
  );
}
