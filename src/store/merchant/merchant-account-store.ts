import { create } from "zustand";

import { MOCK_ACCOUNTS } from "@/lib/mock-data";
import type { Account } from "@/lib/types";

type MerchantAccountStoreState = {
  accounts: Account[];
  getAccountById: (id: string) => Account | undefined;
  getAccountsByMerchantId: (merchantId: string) => Account[];
  addAccount: (account: Account) => void;
  updateAccount: (accountId: string, data: Partial<Account>) => void;
  deleteAccount: (accountId: string) => void;
};

export const useMerchantAccountStore = create<MerchantAccountStoreState>(
  (set, get) => ({
    accounts: MOCK_ACCOUNTS as Account[],

    getAccountById: (id: string) => get().accounts.find((a) => a.id === id),

    getAccountsByMerchantId: (merchantId: string) =>
      get().accounts.filter((a) => a.merchantId === merchantId && !a.deletedAt),

    addAccount: (account: Account) => {
      set((state) => ({ accounts: [account, ...state.accounts] }));
    },

    updateAccount: (accountId: string, data: Partial<Account>) => {
      set((state) => ({
        accounts: state.accounts.map((a) =>
          a.id === accountId ? { ...a, ...data } : a,
        ),
      }));
    },

    deleteAccount: (accountId: string) => {
      set((state) => ({
        accounts: state.accounts.map((a) =>
          a.id === accountId
            ? { ...a, deletedAt: new Date().toISOString() }
            : a,
        ),
      }));
    },
  }),
);
