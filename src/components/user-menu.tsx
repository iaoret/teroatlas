import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";

export function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={"sm"} className="p-0 ">
          <div className="w-[2rem] h-[2rem] rounded-full bg-primary-content flex items-center justify-center">
            <img src="https://thispersondoesnotexist.com" />
            <span className="sr-only">Toggle user menu</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Log Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
