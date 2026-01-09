import { BadgeVariant } from "@/components/ui/badge";
import { InvoiceStatus } from "@/lib/types";

export const getStatusBadgeVariant = (status: InvoiceStatus): BadgeVariant => {
  const variantMap: Record<InvoiceStatus, BadgeVariant> = {
    paid: "success",
    pending: "warning",
    approved: "success",
    rejected: "destructive",
    draft: "info",
    open: "info",
    past_due: "warning",
    void: "secondary",
  };

  return variantMap[status] || "secondary";
};
