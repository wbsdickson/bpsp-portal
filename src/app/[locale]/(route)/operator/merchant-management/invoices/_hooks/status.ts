import { BadgeVariant } from "@/components/ui/badge";

export type InvoiceStatus = "open" | "draft" | "past_due" | "paid";

export const getInvoiceStatusBadgeVariant = (
  status: InvoiceStatus,
): BadgeVariant => {
  const variantMap: Record<InvoiceStatus, BadgeVariant> = {
    paid: "outline-success",
    past_due: "outline-warning",
    open: "outline-info",
    draft: "outline-info",
  };

  return variantMap[status] || "secondary";
};
