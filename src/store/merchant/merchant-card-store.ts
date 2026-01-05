import { create } from "zustand";

import { MOCK_MERCHANT_CARDS, MOCK_PAYMENTS } from "@/lib/mock-data";
import type { MerchantCard } from "@/lib/types";

export type MerchantCardStatus = "used" | "unused";

export type AppMerchantCard = MerchantCard & {
  deletedAt?: string | null;
};

type MerchantCardStoreState = {
  cards: AppMerchantCard[];
  deleteCard: (id: string) => void;
  getCardStatus: (card: Pick<AppMerchantCard, "last4">) => MerchantCardStatus;
};

function buildUsedLast4(): Set<string> {
  const set = new Set<string>();
  for (const p of MOCK_PAYMENTS) {
    const m = String(p.paymentMethod ?? "").match(/\(\*\*\*\*\s*(\d{4})\)/);
    if (m?.[1]) set.add(m[1]);
  }
  return set;
}

const USED_LAST4 = buildUsedLast4();

export const useMerchantCardStore = create<MerchantCardStoreState>((set) => ({
  cards: MOCK_MERCHANT_CARDS,
  deleteCard: (id: string) => {
    set((state) => ({
      cards: state.cards.map((c) =>
        c.id === id ? { ...c, deletedAt: new Date().toISOString() } : c,
      ),
    }));
  },
  getCardStatus: (card) => (USED_LAST4.has(card.last4) ? "used" : "unused"),
}));
