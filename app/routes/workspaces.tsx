import { Suspense } from "react";
import { useLoaderData } from "react-router";
import { getWorkspaces } from "~/api/workspaces";

export async function loader() {
  const workspaces = await getWorkspaces();
  return { workspaces };
}

export default function WorkspacesPage() {
  const { workspaces } = useLoaderData<typeof loader>();
  return <Suspense fallback={<></>}></Suspense>;
}
