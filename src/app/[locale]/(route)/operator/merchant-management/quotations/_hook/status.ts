import { BadgeVariant } from "@/components/ui/badge";
import { QuotationStatus } from "@/lib/types";

export const getQuotationStatusBadgeVariant = (
  status: QuotationStatus,
): BadgeVariant => {
  const variantMap: Record<QuotationStatus, BadgeVariant> = {
    accepted: "success",
    rejected: "destructive",
    sent: "warning",
    draft: "info",
    expired: "secondary",
  };

  return variantMap[status] || "secondary";
};
