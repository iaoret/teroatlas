import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function DropdownCustomizeDataDisplay() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:border-slate-400 transition-all duration-200 text-sm flex flex-row items-center justify-center">
        Customize Data Display &nbsp; <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="hover:cursor-pointer">
          Data Table Preview
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="hover:cursor-pointer">
          Top 10 Observations by Unit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="hover:cursor-pointer">
          Top 10 Observations by Sub-Unit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="hover:cursor-pointer">
          Value Over Time
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
