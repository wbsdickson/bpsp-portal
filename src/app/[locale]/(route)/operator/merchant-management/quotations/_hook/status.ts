import { BadgeVariant } from "@/components/ui/badge";
import { QuotationStatus } from "@/lib/types";

export const getQuotationStatusBadgeVariant = (
  status: QuotationStatus,
): BadgeVariant => {
  const variantMap: Record<QuotationStatus, BadgeVariant> = {
    accepted: "outline-success",
    rejected: "outline-destructive",
    sent: "outline-warning",
    draft: "outline-info",
    expired: "outline-destructive",
  };

  return variantMap[status] || "outline-info";
};
