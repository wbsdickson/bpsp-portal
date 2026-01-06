import { create } from "zustand";

import type { DocumentSettings } from "@/lib/types";

type DocumentSettingsStoreState = {
  settings: DocumentSettings[];
  getByMerchantId: (merchantId: string) => DocumentSettings | undefined;
  upsert: (data: DocumentSettings) => void;
};

export const useDocumentSettingsStore = create<DocumentSettingsStoreState>(
  (set, get) => ({
    settings: [],
    getByMerchantId: (merchantId: string) =>
      get().settings.find((s) => s.merchantId === merchantId),
    upsert: (data: DocumentSettings) => {
      set((state) => {
        const existing = state.settings.find(
          (s) => s.merchantId === data.merchantId,
        );
        if (existing) {
          return {
            settings: state.settings.map((s) =>
              s.merchantId === data.merchantId ? { ...s, ...data } : s,
            ),
          };
        }
        return {
          settings: [...state.settings, data],
        };
      });
    },
  }),
);
