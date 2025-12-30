export type MerchantFeeStatus = "active" | "suspended";

export type PaymentMethodType = "card" | "bank";

export type AppMerchantFee = {
  id: string;
  merchantId: string;
  brand: string;
  paymentMethodType: PaymentMethodType;
  mdrPercent: number;
  fixedFee: number;
  createdAt: string;
  updatedAt: string;
  status: MerchantFeeStatus;
};
