export type MidStatus = "active" | "inactive";

export type AppMid = {
  id: string;
  mid: string;
  brand: string;
  connectionEndpoint: string;
  status: MidStatus;
  linkedMerchantIds: string[];
  createdAt: string;
};
