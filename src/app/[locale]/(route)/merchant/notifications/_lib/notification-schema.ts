import { z } from "zod";

export const createNotificationSchema = (t: any) => {
  return z.object({
    title: z.string().min(1, t("validation.titleRequired")),
    message: z.string().optional(),
    merchantId: z.string().optional(),
    target: z.string().optional(),
    publicationDate: z.string().optional(),
    readStatus: z.boolean().optional(),
  });
};
