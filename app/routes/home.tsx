import { HomePage } from "~/components/pages/HomePage";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Pi-DF" }, { name: "description", content: "Editing PDF" }];
}

export default function Home() {
  return (
    <div className="h-screen w-screen p-16 flex justify-center">
      <HomePage />
    </div>
  );
}
