import { addPage } from "~/utils";

export function NewPage() {
  return (
    <div
      className="relative w-full h-44 border rounded-md bg-white shadow-md flex flex-col items-center justify-center btn btn-ghost"
      onClick={addPage}
    >
      <span className="text-gray-500">+</span>
      <span className="text-gray-300">New Page</span>
    </div>
  );
}
