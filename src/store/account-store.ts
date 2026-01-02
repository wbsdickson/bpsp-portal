import { create } from "zustand";

import { MOCK_INVOICES, MOCK_USERS } from "@/lib/mock-data";
import type { Invoice } from "@/types/invoice";
import { generateId, uuid } from "@/lib/utils";
import { User } from "@/lib/types";
import { AppUser } from "@/types/user";

type AddAccountInput = Omit<AppUser, "id" | "createdAt" | "status">;

type AccountStoreState = {
  accounts: AppUser[];
  addAccount: (account: AddAccountInput) => void;
  updateAccount: (id: string, data: Partial<AppUser>) => void;
  deleteAccount: (id: string) => void;
  getAccountById: (id: string) => AppUser | undefined;
};

export const useAccountStore = create<AccountStoreState>((set, get) => ({
  accounts: MOCK_USERS,
  addAccount: (account: AddAccountInput) => {
    const id = uuid("acc");
    set((state) => ({
      accounts: [{ ...account, id, status: "active" }, ...state.accounts],
    }));
  },
  updateAccount: (id: string, data: Partial<AppUser>) => {
    set((state) => ({
      accounts: state.accounts.map((acc) =>
        acc.id === id ? { ...acc, ...data } : acc,
      ),
    }));
  },
  deleteAccount: (id: string) => {
    set((state) => ({
      accounts: state.accounts.filter((acc) => acc.id !== id),
    }));
  },
  getAccountById: (id: string) => get().accounts.find((acc) => acc.id === id),
}));
