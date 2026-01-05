import { useQuery } from "@tanstack/react-query";
import { getWorkspaces } from "~/api/workspaces";

export function useWorkspaces() {
  const workspaces = useQuery({
    queryKey: ["workspaces"],
    queryFn: getWorkspaces,
  });

  return {
    workspaces,
  };
}
