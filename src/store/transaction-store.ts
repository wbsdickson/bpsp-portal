import { create } from "zustand";

import { MOCK_PAYMENTS } from "@/lib/mock-data";
import type { Payment } from "@/lib/types";

export type TransactionStatus = Payment["status"];

type TransactionStoreState = {
  transactions: Payment[];
  updateTransactionStatus: (id: string, status: Payment["status"]) => void;
  getById: (id: string) => Payment | undefined;
  
};

function buildInitialTransactions(): Payment[] {
  return MOCK_PAYMENTS.filter(
    (p) => String(p.paymentMethod ?? "").toLowerCase() === "bank transfer",
  );
}

export const useTransactionStore = create<TransactionStoreState>(
  (set, get) => ({
    transactions: buildInitialTransactions(),
    updateTransactionStatus: (id, status) => {
      set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === id
            ? {
                ...t,
                status,
                settledAt:
                  status === "settled"
                    ? (t.settledAt ?? new Date().toISOString().split("T")[0])
                    : t.settledAt,
              }
            : t,
        ),
      }));
    },
    getById: (id) => get().transactions.find((t) => t.id === id),
  }),
);
