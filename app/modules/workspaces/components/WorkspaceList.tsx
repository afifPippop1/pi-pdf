import { useWorkspaces } from "~/hooks/useWorkspaces";
import { WorkspaceCard } from "./WorkspaceCard";

export function WorkspaceList() {
  const { workspaces } = useWorkspaces();
  return (
    <div>
      {workspaces.data?.map((workspace) => (
        <WorkspaceCard key={workspace.id} workspace={workspace} />
      ))}
    </div>
  );
}
