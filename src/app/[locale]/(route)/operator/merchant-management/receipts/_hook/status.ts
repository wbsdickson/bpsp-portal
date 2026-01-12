import { BadgeVariant } from "@/components/ui/badge";

export type ReceiptStatus = "draft" | "issued";

export const getReceiptStatusBadgeVariant = (
  status: ReceiptStatus,
): BadgeVariant => {
  const variantMap: Record<ReceiptStatus, BadgeVariant> = {
    issued: "success",
    draft: "secondary",
  };

  return variantMap[status] || "outline";
};
