import { Suspense } from "react";
import { WorkspaceList } from "~/modules/workspaces/components/WorkspaceList";

export default function WorkspacesPage() {
  return (
    <Suspense fallback={<></>}>
      <WorkspaceList />
    </Suspense>
  );
}
