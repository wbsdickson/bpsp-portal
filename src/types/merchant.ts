import type { Merchant } from "@/lib/types";

export type MerchantStatus = "active" | "suspended";

export type AppMerchant = Merchant & {
  createdAt?: string;
  status?: MerchantStatus;
  transactionCount?: number;
};
