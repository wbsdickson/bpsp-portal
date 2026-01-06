import { create } from "zustand";

import { MOCK_INVOICES } from "@/lib/mock-data";
import type { Invoice } from "@/types/invoice";
import { uuid } from "@/lib/utils";

type AddInvoiceInput = Omit<Invoice, "id" | "createdAt" | "status"> & {
  status?: Invoice["status"];
};

type ReceivedInvoiceStoreState = {
  invoices: Invoice[];
  addInvoice: (invoice: AddInvoiceInput) => void;
  updateInvoice: (id: string, data: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  getInvoiceById: (id: string) => Invoice | undefined;
  getInvoiceByNumber: (invoiceNumber: string) => Invoice | undefined;
};

export const useReceivedInvoiceStore = create<ReceivedInvoiceStoreState>((set, get) => ({
  invoices: MOCK_INVOICES,
  addInvoice: (invoiceData) => {
    const id = uuid("received-inv");
    const newInvoice: Invoice = {
      ...invoiceData,
      id,
      status: invoiceData.status || "draft",
      createdAt: new Date().toISOString(),
    } as Invoice;
    set((state) => ({ invoices: [newInvoice, ...state.invoices] }));
  },
  updateInvoice: (id, data) => {
    set((state) => ({
      invoices: state.invoices.map((inv) =>
        inv.id === id ? { ...inv, ...data } : inv,
      ),
    }));
  },
  deleteInvoice: (id) => {
    set((state) => ({
      invoices: state.invoices.map((inv) =>
        inv.id === id ? { ...inv, deletedAt: new Date().toISOString() } : inv,
      ),
    }));
  },
  getInvoiceById: (id) => get().invoices.find((inv) => inv.id === id),
  getInvoiceByNumber: (invoiceNumber) =>
    get().invoices.find((inv) => inv.invoiceNumber === invoiceNumber),
}));
