import { create } from "zustand";

import { MOCK_TAXES } from "@/lib/mock-data";
import type { Tax } from "@/lib/types";

type TaxStoreState = {
  taxes: Tax[];
  getTaxById: (id: string) => Tax | undefined;
};

export const useTaxStore = create<TaxStoreState>((_, get) => ({
  taxes: MOCK_TAXES,
  getTaxById: (id: string) => get().taxes.find((t) => t.id === id),
}));
