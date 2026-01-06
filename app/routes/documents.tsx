import { Outlet } from "react-router";

export default function DocumentsLayout() {
  return (
    <div className="p-4">
      <Outlet />
    </div>
  );
}
