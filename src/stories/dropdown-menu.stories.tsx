import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const SimpleDropdown = () => (
  <div>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="primary">
          Menu
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start">
        <DropdownMenuItem>Option 1</DropdownMenuItem>
        <DropdownMenuItem>Option 2</DropdownMenuItem>
        <DropdownMenuItem>Option 3</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);

export const AdvancedDropdown = () => (
  <div>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="primary" size="sm">
          <Icons.sun className="rotate-0 scale-100 transition-all text-popover-foreground hover:accent hover:text-accent-foreground dark:-rotate-90 dark:scale-0" />
          <Icons.moon className="absolute rotate-90 scale-0 transition-all text-popover-foreground hover:accent hover:text-accent-foreground dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent forceMount side="bottom" align="start">
        <DropdownMenuItem>
          <Icons.sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Icons.moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Icons.laptop className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);
