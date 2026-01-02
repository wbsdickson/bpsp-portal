import { create } from "zustand";

import { MOCK_SYSTEM_SETTINGS } from "@/lib/mock-data";
import type { SystemSettings } from "@/types/system-settings";

type SystemSettingsStoreState = {
  settings: SystemSettings;
  update: (data: Partial<SystemSettings>) => void;
  reset: () => void;
};

export const useSystemSettingsStore = create<SystemSettingsStoreState>(
  (set) => ({
    settings: MOCK_SYSTEM_SETTINGS,
    update: (data) =>
      set((state) => ({
        settings: {
          ...state.settings,
          ...data,
          updatedAt: new Date().toISOString(),
        },
      })),
    reset: () => set({ settings: MOCK_SYSTEM_SETTINGS }),
  }),
);
