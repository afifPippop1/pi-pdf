import { useNavigate } from "react-router";
import type { Route } from "./+types/home";
import { Button } from "~/components/atoms/Button";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Pi-DF" }, { name: "description", content: "Editing PDF" }];
}

export default function Editor() {
  const navigate = useNavigate();
  return (
    <div>
      <Button onClick={() => navigate("/editor")}>Start Editing</Button>
    </div>
  );
}
