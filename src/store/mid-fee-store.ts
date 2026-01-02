import { create } from "zustand";

import { uuid } from "@/lib/utils";
import type { AppMidFee, MidFeeStatus } from "@/types/mid-fee";
import { useMidStore } from "@/store/mid-store";

type AddMidFeeInput = Omit<AppMidFee, "id" | "createdAt" | "updatedAt">;

type MidFeeStoreState = {
  fees: AppMidFee[];
  addFee: (fee: AddMidFeeInput) => void;
  updateFee: (id: string, data: Partial<AppMidFee>) => void;
  deleteFee: (id: string) => void;
  getFeeById: (id: string) => AppMidFee | undefined;
};

function buildInitialFees(): AppMidFee[] {
  const mids = useMidStore.getState().mids;

  return mids.map((m, idx) => {
    const createdAt = new Date(
      Date.now() - idx * 24 * 60 * 60 * 1000,
    ).toISOString();
    const updatedAt = new Date(
      Date.now() - idx * 3 * 60 * 60 * 1000,
    ).toISOString();

    const status: MidFeeStatus = idx % 3 === 0 ? "inactive" : "active";

    return {
      id: uuid("midfee"),
      midId: m.id,
      mdrPercent: 2.5,
      fixedFeeAmount: 0.3,
      createdAt,
      updatedAt,
      status,
    } satisfies AppMidFee;
  });
}

export const useMidFeeStore = create<MidFeeStoreState>((set, get) => ({
  fees: buildInitialFees(),
  addFee: (fee: AddMidFeeInput) => {
    set((state) => ({
      fees: [
        {
          ...fee,
          id: uuid("midfee"),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...state.fees,
      ],
    }));
  },
  updateFee: (id: string, data: Partial<AppMidFee>) => {
    set((state) => ({
      fees: state.fees.map((f) =>
        f.id === id
          ? {
              ...f,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : f,
      ),
    }));
  },
  deleteFee: (id: string) => {
    set((state) => ({ fees: state.fees.filter((f) => f.id !== id) }));
  },
  getFeeById: (id: string) => get().fees.find((f) => f.id === id),
}));
