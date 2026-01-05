import { HomePage } from "~/components/pages/HomePage";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Pi-DF" }, { name: "description", content: "Editing PDF" }];
}

export default function Home() {
  return (
    <div className="h-dvh w-dvw p-16 flex justify-center">
      <HomePage />
    </div>
  );
}
