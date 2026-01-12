import { create } from "zustand";
import { persist } from "zustand/middleware";

type SidebarVariant = "sidebar" | "floating" | "inset";

type UserPreferences = {
  sidebarVariant: SidebarVariant;
  primaryColor: string; // oklch color string
};

const DEFAULT_PREFERENCES: UserPreferences = {
  sidebarVariant: "sidebar",
  primaryColor: "", // Empty means use default
};

type UserPreferencesStore = {
  preferences: UserPreferences;
  setSidebarVariant: (variant: SidebarVariant) => void;
  setPrimaryColor: (color: string) => void;
  resetPreferences: () => void;
};

export const useUserPreferencesStore = create<UserPreferencesStore>()(
  persist(
    (set) => ({
      preferences: DEFAULT_PREFERENCES,
      setSidebarVariant: (variant) =>
        set((state) => ({
          preferences: { ...state.preferences, sidebarVariant: variant },
        })),
      setPrimaryColor: (color) =>
        set((state) => ({
          preferences: { ...state.preferences, primaryColor: color },
        })),
      resetPreferences: () =>
        set({ preferences: DEFAULT_PREFERENCES }),
    }),
    {
      name: "user-preferences",
    },
  ),
);
