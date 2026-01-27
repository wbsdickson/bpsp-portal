"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Laptop } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

export function ThemeToggle({
  variant = "secondary",
  size = "icon-sm",
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const getNextTheme = () => {
    if (theme === "light") {
      return "dark";
    } else if (theme === "dark") {
      return "system";
    } else {
      return "light";
    }
  };

  const handleThemeToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const newTheme = getNextTheme();

    // If browser doesn't support View Transition API, just toggle normally
    if (
      typeof document === "undefined" ||
      !("startViewTransition" in document)
    ) {
      setTheme(newTheme);
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = document.startViewTransition(() => {
      setTheme(newTheme);
    });

    transition.ready.then(() => {
      requestAnimationFrame(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 600,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      });
    });
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
      variant={variant}
      size={size}
      onClick={handleThemeToggle}
      className={cn("rounded-full", className)}
      title={`Current theme: ${getThemeLabel()}`}
      {...props}
    >
      {getThemeIcon()}
    </Button>
  );
}
