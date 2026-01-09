import { BadgeVariant } from "@/components/ui/badge";

export type InvoiceStatus = "open" | "draft" | "past_due" | "paid";

export const getInvoiceStatusBadgeVariant = (
  status: InvoiceStatus,
): BadgeVariant => {
  const variantMap: Record<InvoiceStatus, BadgeVariant> = {
    paid: "success",
    past_due: "warning",
    open: "info",
    draft: "info",
  };

  return variantMap[status] || "secondary";
};
