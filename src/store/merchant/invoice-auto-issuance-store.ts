import { create } from "zustand";
import { MOCK_INVOICE_AUTO_ISSUANCE } from "@/lib/mock-data";
import type { InvoiceAutoIssuance } from "@/types/invoice";

interface InvoiceAutoIssuanceStoreState {
  autoIssuances: InvoiceAutoIssuance[];
  addAutoIssuance: (data: Omit<InvoiceAutoIssuance, "id">) => void;
  updateAutoIssuance: (id: string, data: Partial<InvoiceAutoIssuance>) => void;
  deleteAutoIssuance: (id: string) => void;
  getAutoIssuanceById: (id: string) => InvoiceAutoIssuance | undefined;
}

export const useInvoiceAutoIssuanceStore =
  create<InvoiceAutoIssuanceStoreState>((set, get) => ({
    autoIssuances: MOCK_INVOICE_AUTO_ISSUANCE,
    addAutoIssuance: (data) => {
      const id = `auto_${Date.now()}`;
      console.log(data);

      set((state) => ({
        autoIssuances: [{ ...data, id }, ...state.autoIssuances],
      }));
    },
    updateAutoIssuance: (id, data) => {
      set((state) => ({
        autoIssuances: state.autoIssuances.map((it) =>
          it.id === id ? { ...it, ...data } : it,
        ),
      }));
    },
    deleteAutoIssuance: (id) => {
      set((state) => ({
        autoIssuances: state.autoIssuances.filter((it) => it.id !== id),
      }));
    },
    getAutoIssuanceById: (id) => get().autoIssuances.find((it) => it.id === id),
  }));
