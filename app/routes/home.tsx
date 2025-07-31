import EditorPage from "~/components/pages/editor.page";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Pi-DF" }, { name: "description", content: "Editing PDF" }];
}

export default function Editor() {
  return <EditorPage />;
}
