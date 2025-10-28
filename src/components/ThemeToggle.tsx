import { Moon, Sun, Popcorn } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-5 w-5" />;
      case 'vibrant':
        return <Popcorn className="h-5 w-5" />;
      default:
        return <Moon className="h-5 w-5" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {getIcon()}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-50 bg-card">
        <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer">
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark Theater</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer">
          <Sun className="mr-2 h-4 w-4" />
          <span>Light Mode</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('vibrant')} className="cursor-pointer">
          <Popcorn className="mr-2 h-4 w-4" />
          <span>Buttery Popcorn 🍿</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
