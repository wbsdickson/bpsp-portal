import { create } from "zustand";

import { MOCK_SALES_TRANSACTIONS } from "@/lib/mock-data";
import type { SalesTransaction } from "@/types/sales";

export type SalesPeriodFilter = {
  from?: Date;
  to?: Date;
};

export type SalesKpis = {
  salesAmount: number;
  feeAmount: number;
  transactionCount: number;
  currency: string;
};

export type SalesAggregationRow = {
  key: string;
  salesAmount: number;
  feeAmount: number;
  transactionCount: number;
};

type SalesStoreState = {
  transactions: SalesTransaction[];

  period: SalesPeriodFilter;
  merchantId: string;
  clientId: string;

  setPeriod: (period: SalesPeriodFilter) => void;
  setMerchantId: (merchantId: string) => void;
  setClientId: (clientId: string) => void;

  getFiltered: () => SalesTransaction[];
  getKpis: () => SalesKpis;
  getDailyAggregation: () => SalesAggregationRow[];
  getMonthlyAggregation: () => SalesAggregationRow[];
  getAnnualAggregation: () => SalesAggregationRow[];
};

function toYmd(value: Date) {
  const y = value.getFullYear();
  const m = String(value.getMonth() + 1).padStart(2, "0");
  const d = String(value.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function safeParseDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return undefined;
  return dt;
}

function withinRange(dt: Date, from?: Date, to?: Date) {
  const t = dt.getTime();
  if (from && t < from.getTime()) return false;
  if (to && t > to.getTime()) return false;
  return true;
}

function aggregateBy(
  transactions: SalesTransaction[],
  keyFn: (t: SalesTransaction) => string | undefined,
): SalesAggregationRow[] {
  const map = new Map<string, SalesAggregationRow>();

  for (const t of transactions) {
    const key = keyFn(t);
    if (!key) continue;

    const row = map.get(key) ?? {
      key,
      salesAmount: 0,
      feeAmount: 0,
      transactionCount: 0,
    };

    row.salesAmount += t.salesAmount ?? 0;
    row.feeAmount += t.feeAmount ?? 0;
    row.transactionCount += 1;

    map.set(key, row);
  }

  return Array.from(map.values()).sort((a, b) => a.key.localeCompare(b.key));
}

export const useSalesStore = create<SalesStoreState>((set, get) => ({
  transactions: MOCK_SALES_TRANSACTIONS,

  period: {},
  merchantId: "",
  clientId: "",

  setPeriod: (period) => set({ period }),
  setMerchantId: (merchantId) => set({ merchantId, clientId: "" }),
  setClientId: (clientId) => set({ clientId }),

  getFiltered: () => {
    const { transactions, period, merchantId, clientId } = get();

    return transactions.filter((t) => {
      if (merchantId && t.merchantId !== merchantId) return false;
      if (clientId && t.clientId !== clientId) return false;

      const dt = safeParseDate(t.transactionDate);
      if (!dt) return false;

      return withinRange(dt, period.from, period.to);
    });
  },

  getKpis: () => {
    const filtered = get().getFiltered();
    const currency = filtered[0]?.currency ?? "USD";

    const salesAmount = filtered.reduce(
      (sum, t) => sum + (t.salesAmount ?? 0),
      0,
    );
    const feeAmount = filtered.reduce((sum, t) => sum + (t.feeAmount ?? 0), 0);

    return {
      salesAmount,
      feeAmount,
      transactionCount: filtered.length,
      currency,
    };
  },

  getDailyAggregation: () => {
    const filtered = get().getFiltered();
    return aggregateBy(filtered, (t) => {
      const dt = safeParseDate(t.transactionDate);
      if (!dt) return undefined;
      return toYmd(dt);
    });
  },

  getMonthlyAggregation: () => {
    const filtered = get().getFiltered();
    return aggregateBy(filtered, (t) => {
      const dt = safeParseDate(t.transactionDate);
      if (!dt) return undefined;
      const y = dt.getFullYear();
      const m = String(dt.getMonth() + 1).padStart(2, "0");
      return `${y}-${m}`;
    });
  },

  getAnnualAggregation: () => {
    const filtered = get().getFiltered();
    return aggregateBy(filtered, (t) => {
      const dt = safeParseDate(t.transactionDate);
      if (!dt) return undefined;
      return String(dt.getFullYear());
    });
  },
}));
