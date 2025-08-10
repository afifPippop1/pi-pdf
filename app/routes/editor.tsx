import { Suspense } from "react";
import { EditorPage } from "~/components/pages/EditorPage.client";

export default function Editor() {
  return (
    <Suspense fallback={<></>}>
      <EditorPage />
    </Suspense>
  );
}
