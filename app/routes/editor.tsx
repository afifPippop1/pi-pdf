import EditorPage from "~/components/pages/editor.page";
import { Welcome } from "../welcome/welcome";
import type { Route } from "./+types/editor";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Pi-PDF" }, { name: "description", content: "Editing PDF" }];
}

export default function Editor() {
  return <EditorPage />;
}
