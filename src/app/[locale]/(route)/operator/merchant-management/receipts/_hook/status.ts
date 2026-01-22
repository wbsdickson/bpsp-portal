import { BadgeVariant } from "@/components/ui/badge";

export type ReceiptStatus = "draft" | "issued";

export const getReceiptStatusBadgeVariant = (
  status: ReceiptStatus,
): BadgeVariant => {
  const variantMap: Record<ReceiptStatus, BadgeVariant> = {
    issued: "outline-success",
    draft: "outline-info",
  };

  return variantMap[status] || "outline";
};
