import { z } from "zod";

export const createMidSchema = (t: any) => {
  return z.object({
    mid: z.string().min(1, t("validation.midRequired")),
    brand: z.string().min(1, t("validation.brandRequired")),
    connectionEndpoint: z.string().optional(),
    status: z.enum(["active", "inactive"]),
  });
};
