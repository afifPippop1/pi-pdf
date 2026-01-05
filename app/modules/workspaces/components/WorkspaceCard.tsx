import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { Workspace } from "~/types/workspace.type";
import { timeToNow } from "~/utils/time";

export function WorkspaceCard({ workspace }: { workspace: Workspace }) {
  return (
    <Card>
      <CardHeader className="flex justify-between">
        <CardTitle className="flex-1">{workspace.name}</CardTitle>
        <p className="text-xs text-gray-400">{timeToNow(workspace.created_at)}</p>
      </CardHeader>
      <CardContent>
        <p>{workspace.description}</p>
      </CardContent>
    </Card>
  );
}
