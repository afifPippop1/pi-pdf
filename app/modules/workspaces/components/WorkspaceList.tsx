import { useWorkspaces } from "~/hooks/useWorkspaces";
import { WorkspaceCard } from "./WorkspaceCard";

export function WorkspaceList() {
  const { workspaces } = useWorkspaces();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {workspaces.data?.map((workspace) => (
        <WorkspaceCard key={workspace.id} workspace={workspace} />
      ))}
    </div>
  );
}
