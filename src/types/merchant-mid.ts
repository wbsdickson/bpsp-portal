export type MerchantMidStatus = "active" | "inactive";

export type AppMerchantMid = {
  id: string;
  merchantId: string;
  mid: string;
  brand: string;
  createdAt: string;
  effectiveStartDate: string;
  effectiveEndDate: string;
  status: MerchantMidStatus;
};
