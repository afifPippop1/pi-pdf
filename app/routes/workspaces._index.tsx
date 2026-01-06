import { Suspense } from "react";
import { WorkspaceList } from "~/modules/workspaces/components/WorkspaceList";

export default function WorkspacesPage() {
  return (
    <Suspense fallback={<></>}>
      <div className="space-y-3">
        <h1 className="text-xl font-bold">Workspaces</h1>
        <WorkspaceList />
      </div>
    </Suspense>
  );
}
