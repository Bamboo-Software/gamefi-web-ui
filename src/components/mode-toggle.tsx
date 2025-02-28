import { Moon, Sun, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/stores/store";
import { setTheme, Theme } from "@/stores/theme/themeSlice";
import { useEffect } from "react";
import { useLocalStorage } from "react-use";

export function ModeToggle() {
  const { theme } = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();
  const [storedTheme, setStoredTheme] = useLocalStorage<Theme>("theme", "system");

  useEffect(() => {
    const initialTheme = storedTheme || "system";
    if (initialTheme !== theme) {
      dispatch(setTheme(initialTheme));
    }
  }, [storedTheme, theme, dispatch]);

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const root = document.documentElement;

    if (theme === "system") {
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    } else if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const handleThemeChange = (newTheme: Theme) => {
    setStoredTheme(newTheme);
    dispatch(setTheme(newTheme));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 p-3 my-1 rounded-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:outline-none focus:ring-2 dark:focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 bg-gray-50 hover:bg-gray-300 text-gray-900 border-gray-400 focus:ring-gray-300 focus:ring-offset-gray-100"
        >
          <span className="flex items-center justify-center w-4 h-4">
            {theme === "system" && (<Laptop />)}
            {theme === "light" && (<Sun />)}
            {theme === "dark" && (<Moon />)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="p-2 dark:bg-gray-800 border dark:border-gray-600 rounded-md dark:text-gray-100 bg-gray-50 border-gray-400 text-gray-900"
      >
        <DropdownMenuItem
          onClick={() => handleThemeChange("system")}
          className="flex items-center gap-2 px-3 py-1.5 rounded-sm dark:hover:bg-gray-700 dark:focus:bg-gray-700 focus:outline-none hover:bg-gray-300 focus:bg-gray-300"
        >
          <span className="flex items-center justify-center w-4 h-4">
            <Laptop />
          </span>
          <span className="text-sm">OS Default</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange("light")}
          className="flex items-center gap-2 px-3 py-1.5 rounded-sm dark:hover:bg-gray-700 dark:focus:bg-gray-700 focus:outline-none hover:bg-gray-300 focus:bg-gray-300">
          <span className="flex items-center justify-center w-4 h-4">
            <Sun />
          </span>
          <span className="text-sm">Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange("dark")}
          className="flex items-center gap-2 px-3 py-1.5 rounded-sm dark:hover:bg-gray-700 dark:focus:bg-gray-700 focus:outline-none hover:bg-gray-300 focus:bg-gray-300">
          <span className="flex items-center justify-center w-4 h-4">
            <Moon />
          </span>
          <span className="text-sm">Dark</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}