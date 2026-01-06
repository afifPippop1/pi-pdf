import { openDB } from "idb";
import { FaPlus } from "react-icons/fa6";
import { v4 as uuid } from "uuid";
import FileUpload from "~/components/molecules/FileUpload";
import { Button } from "~/components/ui/button";
import { checkSize } from "~/utils/fileSize";
import { uploadDocument } from "../api/document-storage.api";
import { insertDocument } from "../api/documents.api";
import { useNavigate } from "react-router";
import { useOpenDb } from "~/hooks/useOpenDb";

export function AddDocumentButton() {
  const navigate = useNavigate();
  const db = useOpenDb();
  async function handleChange(files: FileList | null) {
    let totlalSize = 0;
    for (const file of files || []) {
      totlalSize += file.size;
    }
    const { error } = checkSize(totlalSize);
    if (error) {
      const id = uuid();
      const res = await db?.put(
        "documents",
        {
          id,
          blob: files?.[0],
          created_at: Date.now(),
          updated_at: Date.now(),
          name: files?.[0].name,
          path: "",
        },
        id
      );
      if (res) {
        navigate(`/documents/${id}`);
      }
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
    navigate(`/documents/${docId}`);
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
