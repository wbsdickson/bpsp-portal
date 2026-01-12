"use client";

import * as React from "react";
import { useUserPreferencesStore } from "@/store/user-preferences-store";

export function UserPreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { preferences } = useUserPreferencesStore();

  React.useEffect(() => {
    // Apply primary color preference
    if (preferences.primaryColor) {
      document.documentElement.style.setProperty(
        "--primary",
        preferences.primaryColor,
      );
      document.documentElement.style.setProperty(
        "--sidebar-primary",
        preferences.primaryColor,
      );
    } else {
      // Reset to default
      document.documentElement.style.removeProperty("--primary");
      document.documentElement.style.removeProperty("--sidebar-primary");
    }
  }, [preferences.primaryColor]);

  return <>{children}</>;
}
