import { create } from "zustand";

import { MOCK_RECEIPTS } from "@/lib/mock-data";
import type { Receipt } from "@/lib/types";
import { uuid } from "@/lib/utils";

type AddReceiptInput = Omit<
  Receipt,
  "id" | "createdAt" | "updatedAt" | "deletedAt" | "status" | "amount"
> & {
  status?: Receipt["status"];
};

type ReceiptStoreState = {
  receipts: Receipt[];
  addReceipt: (receipt: AddReceiptInput) => void;
  updateReceipt: (id: string, data: Partial<Receipt>) => void;
  deleteReceipt: (id: string) => void;
  getReceiptById: (id: string) => Receipt | undefined;
  getReceiptByNumber: (receiptNumber: string) => Receipt | undefined;
};

export const useReceiptStore = create<ReceiptStoreState>((set, get) => ({
  receipts: MOCK_RECEIPTS,
  addReceipt: (receiptData) => {
    const id = uuid("rc");
    const now = new Date().toISOString();

    const amount = (receiptData.items ?? []).reduce(
      (sum, it) => sum + (it.amount ?? 0),
      0,
    );

    const newReceipt: Receipt = {
      ...(receiptData as Omit<
        Receipt,
        "id" | "createdAt" | "amount" | "status"
      >),
      id,
      status: receiptData.status || "draft",
      amount,
      createdAt: now,
    } as Receipt;

    set((state) => ({ receipts: [newReceipt, ...state.receipts] }));
  },
  updateReceipt: (id, data) => {
    set((state) => ({
      receipts: state.receipts.map((rc) => {
        if (rc.id !== id) return rc;

        const next = { ...rc, ...data };
        const nextAmount = (next.items ?? []).reduce(
          (sum, it) => sum + (it.amount ?? 0),
          0,
        );

        return {
          ...next,
          amount: nextAmount,
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  },
  deleteReceipt: (id) => {
    set((state) => ({
      receipts: state.receipts.map((rc) =>
        rc.id === id ? { ...rc, deletedAt: new Date().toISOString() } : rc,
      ),
    }));
  },
  getReceiptById: (id) => get().receipts.find((rc) => rc.id === id),
  getReceiptByNumber: (receiptNumber) =>
    get().receipts.find((rc) => rc.receiptNumber === receiptNumber),
}));
