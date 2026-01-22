import { BadgeVariant } from "@/components/ui/badge";
import { InvoiceStatus } from "@/lib/types";

export const getStatusBadgeVariant = (status: InvoiceStatus): BadgeVariant => {
  const variantMap: Record<InvoiceStatus, BadgeVariant> = {
    paid: "outline-success",
    pending: "outline-warning",
    approved: "outline-success",
    rejected: "outline-destructive",
    draft: "outline-info",
    open: "outline-info",
    past_due: "outline-warning",
    void: "outline-info",
  };

  return variantMap[status] || "outline-info";
};
