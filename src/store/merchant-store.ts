import { create } from "zustand";

import { MOCK_INVOICES, MOCK_MERCHANTS } from "@/lib/mock-data";
import { uuid } from "@/lib/utils";
import type { AppMerchant, MerchantStatus } from "@/types/merchant";

type AddMerchantInput = Omit<
  AppMerchant,
  "id" | "createdAt" | "transactionCount"
>;

type MerchantStoreState = {
  merchants: AppMerchant[];
  addMerchant: (merchant: AddMerchantInput) => void;
  updateMerchant: (id: string, data: Partial<AppMerchant>) => void;
  deleteMerchant: (id: string) => void;
  getMerchantById: (id: string) => AppMerchant | undefined;
};

function buildInitialMerchants(): AppMerchant[] {
  const invoiceCounts = MOCK_INVOICES.reduce<Record<string, number>>(
    (acc, inv) => {
      const key = inv.merchantId;
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    },
    {},
  );

  const invoiceFirstDate = MOCK_INVOICES.reduce<Record<string, string>>(
    (acc, inv) => {
      const key = inv.merchantId;
      const candidate = inv.createdAt || inv.invoiceDate;
      if (!candidate) return acc;

      const prev = acc[key];
      if (!prev) {
        acc[key] = candidate;
        return acc;
      }

      const prevDt = new Date(prev);
      const candDt = new Date(candidate);
      if (Number.isNaN(prevDt.getTime())) return acc;
      if (Number.isNaN(candDt.getTime())) return acc;

      if (candDt.getTime() < prevDt.getTime()) acc[key] = candidate;
      return acc;
    },
    {},
  );

  return MOCK_MERCHANTS.map((m) => {
    const createdAt = invoiceFirstDate[m.id];
    const status: MerchantStatus = "active";
    const transactionCount = invoiceCounts[m.id] ?? 0;

    return {
      ...m,
      createdAt,
      status,
      transactionCount,
    } satisfies AppMerchant;
  });
}

export const useMerchantStore = create<MerchantStoreState>((set, get) => ({
  merchants: buildInitialMerchants(),
  addMerchant: (merchant: AddMerchantInput) => {
    const id = uuid("mer");
    set((state) => ({
      merchants: [
        ...state.merchants,
        {
          ...merchant,
          id,
          createdAt: new Date().toISOString(),
          status: merchant.status ?? "active",
          transactionCount: 0,
        },
      ],
    }));
  },
  updateMerchant: (id: string, data: Partial<AppMerchant>) => {
    set((state) => ({
      merchants: state.merchants.map((m) =>
        m.id === id ? { ...m, ...data } : m,
      ),
    }));
  },
  deleteMerchant: (id: string) => {
    set((state) => ({
      merchants: state.merchants.filter((m) => m.id !== id),
    }));
  },
  getMerchantById: (id: string) => get().merchants.find((m) => m.id === id),
}));
