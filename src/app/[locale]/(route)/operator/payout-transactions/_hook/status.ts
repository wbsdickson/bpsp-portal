import { BadgeVariant } from "@/components/ui/badge";
import { PaymentStatus } from "@/lib/types";

export const getPayoutTransactionStatusBadgeVariant = (
  status: PaymentStatus,
): BadgeVariant => {
  const variantMap: Record<PaymentStatus, BadgeVariant> = {
    settled: "outline-success",
    failed: "outline-destructive",
    pending_approval: "outline-warning",
  };

  return variantMap[status] || "secondary";
};
