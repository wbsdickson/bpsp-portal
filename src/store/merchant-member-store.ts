import { create } from "zustand";

import { MOCK_USERS } from "@/lib/mock-data";
import type { User } from "@/lib/types";

type MerchantMemberStoreState = {
  members: User[];
  getMemberById: (id: string) => User | undefined;
  getMembersByMerchantId: (merchantId: string) => User[];
  addMember: (user: User) => void;
  updateMember: (userId: string, data: Partial<User>) => void;
  deleteMember: (userId: string) => void;
};

export const useMerchantMemberStore = create<MerchantMemberStoreState>(
  (set, get) => ({
    members: MOCK_USERS,

    getMemberById: (id: string) => get().members.find((u) => u.id === id),

    getMembersByMerchantId: (merchantId: string) =>
      get().members.filter((u) => u.merchantId === merchantId && !u.deletedAt),

    addMember: (user: User) => {
      set((state) => ({ members: [user, ...state.members] }));
    },

    updateMember: (userId: string, data: Partial<User>) => {
      set((state) => ({
        members: state.members.map((u) =>
          u.id === userId ? { ...u, ...data } : u,
        ),
      }));
    },

    deleteMember: (userId: string) => {
      set((state) => ({
        members: state.members.map((u) =>
          u.id === userId ? { ...u, deletedAt: new Date().toISOString() } : u,
        ),
      }));
    },
  }),
);
