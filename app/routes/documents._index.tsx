import { Suspense } from "react";
import { AddDocumentButton } from "~/modules/documents/components/AddDocumentButton";
import { DocumentList } from "~/modules/documents/components/DocumentLIst";

export default function DocumentsPage() {
  return (
    <Suspense fallback={<></>}>
      <div className="space-y-3">
        <div className="flex justify-between">
          <h1 className="text-xl font-bold">Documents</h1>
          <AddDocumentButton />
        </div>
        <DocumentList />
      </div>
    </Suspense>
  );
}
