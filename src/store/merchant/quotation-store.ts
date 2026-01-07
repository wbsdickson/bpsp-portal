import { create } from "zustand";

import { MOCK_QUOTATIONS } from "@/lib/mock-data";
import type { Quotation } from "@/lib/types";
import { uuid } from "@/lib/utils";

type AddQuotationInput = Omit<
  Quotation,
  "id" | "createdAt" | "updatedAt" | "deletedAt"
>;

type QuotationStoreState = {
  quotations: Quotation[];
  addQuotation: (quotation: AddQuotationInput) => void;
  updateQuotation: (id: string, data: Partial<Quotation>) => void;
  deleteQuotation: (id: string) => void;
  getQuotationById: (id: string) => Quotation | undefined;
};

export const useQuotationStore = create<QuotationStoreState>((set, get) => ({
  quotations: MOCK_QUOTATIONS,
  addQuotation: (quotation: AddQuotationInput) => {
    set((state) => ({
      quotations: [
        {
          ...quotation,
          id: uuid("qt"),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...state.quotations,
      ],
    }));
  },
  updateQuotation: (id: string, data: Partial<Quotation>) => {
    set((state) => ({
      quotations: state.quotations.map((q) =>
        q.id === id
          ? {
              ...q,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : q,
      ),
    }));
  },
  deleteQuotation: (id: string) => {
    set((state) => ({
      quotations: state.quotations.map((q) =>
        q.id === id ? { ...q, deletedAt: new Date().toISOString() } : q,
      ),
    }));
  },
  getQuotationById: (id: string) => get().quotations.find((q) => q.id === id),
}));
