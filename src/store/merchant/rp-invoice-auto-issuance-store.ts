import { create } from "zustand";

import { MOCK_RECEIVED_PAYABLE_INVOICE_AUTO_ISSUANCES } from "@/lib/mock-data";
import type { ReceivedPayableInvoiceAutoIssuance } from "@/types/invoice";
import { uuid } from "@/lib/utils";

type AddReceivedPayableInvoiceAutoIssuanceInput = Omit<
  ReceivedPayableInvoiceAutoIssuance,
  "id" | "createdAt" | "status"
> & {
  status?: ReceivedPayableInvoiceAutoIssuance["status"];
};

type ReceivedPayableInvoiceAutoIssuanceStoreState = {
  invoices: ReceivedPayableInvoiceAutoIssuance[];
  addInvoice: (invoice: AddReceivedPayableInvoiceAutoIssuanceInput) => void;
  updateInvoice: (
    id: string,
    data: Partial<ReceivedPayableInvoiceAutoIssuance>,
  ) => void;
  deleteInvoice: (id: string) => void;
  getInvoiceById: (
    id: string,
  ) => ReceivedPayableInvoiceAutoIssuance | undefined;
  getInvoiceBySettingName: (
    settingName: string,
  ) => ReceivedPayableInvoiceAutoIssuance | undefined;
};

export const useReceivedPayableInvoiceAutoIssuanceStore =
  create<ReceivedPayableInvoiceAutoIssuanceStoreState>((set, get) => ({
    invoices: MOCK_RECEIVED_PAYABLE_INVOICE_AUTO_ISSUANCES,
    addInvoice: (invoiceData) => {
      const id = uuid("received-inv");
      const newInvoice: ReceivedPayableInvoiceAutoIssuance = {
        ...invoiceData,
        id,
        status: invoiceData.status || "draft",
        createdAt: new Date().toISOString(),
      } as ReceivedPayableInvoiceAutoIssuance;
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
        invoices: state.invoices.filter((inv) => inv.id !== id),
      }));
    },
    getInvoiceById: (id) => get().invoices.find((inv) => inv.id === id),
    getInvoiceBySettingName: (settingName: string) =>
      get().invoices.find((inv) => inv.settingName === settingName),
  }));
