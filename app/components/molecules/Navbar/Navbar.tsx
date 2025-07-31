import { Button } from "~/components/atoms/Button";
import { NavbarMenuItem } from "./MenuItem";

interface NavbarProps {}

export function Navbar({}: NavbarProps) {
  return (
    <div className="flex justify-between bg-white px-32 py-4">
      {/* Menu list */}
      <div className="flex gap-4">
        <NavbarMenuItem>File</NavbarMenuItem>
        <NavbarMenuItem>Edit</NavbarMenuItem>
        <NavbarMenuItem>View</NavbarMenuItem>
        <NavbarMenuItem>Help</NavbarMenuItem>
      </div>
      {/* Action */}
      <div className="flex gap-4">
        <Button className="bg-grey-400 text-white rounded-lg">Save</Button>
      </div>
    </div>
  );
}
