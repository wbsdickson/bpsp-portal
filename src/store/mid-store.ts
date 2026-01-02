import { create } from "zustand";

import { MOCK_MERCHANTS } from "@/lib/mock-data";
import { uuid } from "@/lib/utils";
import type { AppMid, MidStatus } from "@/types/mid";

type AddMidInput = Omit<AppMid, "id" | "createdAt">;

type MidStoreState = {
  mids: AppMid[];
  addMid: (mid: AddMidInput) => void;
  updateMid: (id: string, data: Partial<AppMid>) => void;
  deleteMid: (id: string) => void;
  getMidById: (id: string) => AppMid | undefined;
};

function buildInitialMids(): AppMid[] {
  const brands = ["VISA", "MASTERCARD", "JCB"];

  return brands.map((brand, idx) => {
    const createdAt = new Date(
      Date.now() - idx * 7 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const merchantIds = MOCK_MERCHANTS.map((m) => m.id);
    const linkedMerchantIds = merchantIds.filter(
      (_, i) => i % brands.length === idx,
    );

    return {
      id: uuid("midcfg"),
      mid: `MID-${brand}-${String(idx + 1).padStart(3, "0")}`,
      brand,
      connectionEndpoint: `https://gateway.example.com/${brand.toLowerCase()}`,
      status: (idx % 2 === 0 ? "active" : "inactive") as MidStatus,
      linkedMerchantIds,
      createdAt,
    } satisfies AppMid;
  });
}

export const useMidStore = create<MidStoreState>((set, get) => ({
  mids: buildInitialMids(),
  addMid: (mid: AddMidInput) => {
    set((state) => ({
      mids: [
        {
          ...mid,
          id: uuid("midcfg"),
          createdAt: new Date().toISOString(),
        },
        ...state.mids,
      ],
    }));
  },
  updateMid: (id: string, data: Partial<AppMid>) => {
    set((state) => ({
      mids: state.mids.map((m) => (m.id === id ? { ...m, ...data } : m)),
    }));
  },
  deleteMid: (id: string) => {
    set((state) => ({
      mids: state.mids.filter((m) => m.id !== id),
    }));
  },
  getMidById: (id: string) => get().mids.find((m) => m.id === id),
}));
