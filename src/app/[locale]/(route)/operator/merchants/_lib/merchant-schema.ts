import { z } from "zod";

export const createMerchantSchema = (t: any) => {
  return z.object({
    name: z.string().min(1, t("validation.nameRequired")),
    address: z.string().optional(),
  });
};
