export type MidFeeStatus = "active" | "inactive";

export type AppMidFee = {
  id: string;
  midId: string;
  mdrPercent: number;
  fixedFeeAmount: number;
  createdAt: string;
  updatedAt: string;
  status: MidFeeStatus;
};
