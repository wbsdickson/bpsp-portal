export type TaxRoundingMethod = "round" | "floor" | "ceil";

export type MerchantTaxSettings = {
  merchantId: string;
  taxable: boolean;
  taxRate: number;
  roundingMethod: TaxRoundingMethod;
  updatedAt: string;
};
