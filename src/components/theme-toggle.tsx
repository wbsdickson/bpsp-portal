"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Laptop } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getThemeIcon = () => {
    if (!mounted) return <Sun className="size-4" />;
    if (theme === "light") return <Sun className="size-4" />;
    if (theme === "dark") return <Moon className="size-4" />;
    return <Laptop className="size-4" />;
  };

  const getThemeLabel = () => {
    if (!mounted) return "System";
    if (theme === "light") return "Light";
    if (theme === "dark") return "Dark";
    return "System";
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative"
      title={`Current theme: ${getThemeLabel()}`}
    >
      {getThemeIcon()}
    </Button>
  );
}
