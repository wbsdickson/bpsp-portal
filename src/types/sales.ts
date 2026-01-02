export type SalesTransaction = {
  id: string;
  merchantId: string;
  clientId: string;
  transactionDate: string; // YYYY-MM-DD
  salesAmount: number;
  feeAmount: number;
  currency: string;
};
