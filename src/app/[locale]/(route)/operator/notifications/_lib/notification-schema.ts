import { z } from "zod";

export const createNotificationSchema = (t: any) => {
  return z.object({
    title: z.string().min(1, t("validation.titleRequired")),
    message: z.string().min(1, t("validation.messageRequired")),
    merchantId: z.string().optional(),
    targetUserType: z.enum(["merchant", "admin", "all"]).optional(),
    publicationStartDate: z.string().optional(),
    publicationEndDate: z.string().optional(),
  });
};
