import { z } from "zod";

export const createMidFeeSchema = (t: any) => {
  return z.object({
    status: z.enum(["active", "inactive"]),
    mdrPercent: z.number().min(0, t("validation.mdrRequired")),
    fixedFeeAmount: z.number().min(0, t("validation.fixedFeeRequired")),
  });
};
