import { create } from "zustand";

import { MOCK_BANK_ACCOUNTS } from "@/lib/mock-data";
import type { BankAccount } from "@/lib/types";
import { uuid } from "@/lib/utils";

type AddBankAccountInput = Omit<
  BankAccount,
  "id" | "createdAt" | "updatedAt" | "deletedAt" | "createdBy" | "updatedBy"
> & {
  createdBy?: string;
};

type MerchantBankAccountStoreState = {
  bankAccounts: BankAccount[];
  addBankAccount: (account: AddBankAccountInput) => void;
  updateBankAccount: (id: string, data: Partial<BankAccount>) => void;
  deleteBankAccount: (id: string) => void;
  getBankAccountById: (id: string) => BankAccount | undefined;
};

export const useMerchantBankAccountStore =
  create<MerchantBankAccountStoreState>((set, get) => ({
    bankAccounts: MOCK_BANK_ACCOUNTS,
    addBankAccount: (account: AddBankAccountInput) => {
      set((state) => ({
        bankAccounts: [
          {
            ...account,
            id: uuid("ba"),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          ...state.bankAccounts,
        ],
      }));
    },
    updateBankAccount: (id: string, data: Partial<BankAccount>) => {
      set((state) => ({
        bankAccounts: state.bankAccounts.map((a) =>
          a.id === id
            ? {
                ...a,
                ...data,
                updatedAt: new Date().toISOString(),
              }
            : a,
        ),
      }));
    },
    deleteBankAccount: (id: string) => {
      set((state) => ({
        bankAccounts: state.bankAccounts.map((a) =>
          a.id === id ? { ...a, deletedAt: new Date().toISOString() } : a,
        ),
      }));
    },
    getBankAccountById: (id: string) =>
      get().bankAccounts.find((a) => a.id === id),
  }));
