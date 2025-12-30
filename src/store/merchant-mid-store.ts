import { create } from "zustand";

import { MOCK_MERCHANTS } from "@/lib/mock-data";
import { uuid } from "@/lib/utils";
import type { AppMerchantMid, MerchantMidStatus } from "@/types/merchant-mid";

type AddMerchantMidInput = Omit<AppMerchantMid, "id" | "createdAt">;

type MerchantMidStoreState = {
  mids: AppMerchantMid[];
  addMid: (mid: AddMerchantMidInput) => void;
  updateMid: (id: string, data: Partial<AppMerchantMid>) => void;
  deleteMid: (id: string) => void;
  getMidById: (id: string) => AppMerchantMid | undefined;
};

function buildInitialMids(): AppMerchantMid[] {
  const brands = ["VISA", "MASTERCARD", "JCB"];

  return MOCK_MERCHANTS.flatMap((m, idx) => {
    const createdAt = new Date(
      Date.now() - idx * 24 * 60 * 60 * 1000,
    ).toISOString();
    const effectiveStartDate = createdAt;
    const effectiveEndDate = new Date(
      Date.now() + (idx + 1) * 30 * 24 * 60 * 60 * 1000,
    ).toISOString();
    const status: MerchantMidStatus = idx % 3 === 0 ? "inactive" : "active";

    return [
      {
        id: uuid("mid"),
        merchantId: m.id,
        mid: `MID-${m.id.toUpperCase()}-001`,
        brand: brands[idx % brands.length],
        createdAt,
        effectiveStartDate,
        effectiveEndDate,
        status,
      },
    ];
  });
}

export const useMerchantMidStore = create<MerchantMidStoreState>(
  (set, get) => ({
    mids: buildInitialMids(),
    addMid: (mid: AddMerchantMidInput) => {
      set((state) => ({
        mids: [
          {
            ...mid,
            id: uuid("mid"),
            createdAt: new Date().toISOString(),
          },
          ...state.mids,
        ],
      }));
    },
    updateMid: (id: string, data: Partial<AppMerchantMid>) => {
      set((state) => ({
        mids: state.mids.map((m) => (m.id === id ? { ...m, ...data } : m)),
      }));
    },
    deleteMid: (id: string) => {
      set((state) => ({ mids: state.mids.filter((m) => m.id !== id) }));
    },
    getMidById: (id: string) => get().mids.find((m) => m.id === id),
  }),
);
