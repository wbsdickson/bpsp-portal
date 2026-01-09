import { BadgeVariant } from "@/components/ui/badge";
import { PaymentStatus } from "@/lib/types";

export const getPayoutTransactionStatusBadgeVariant = (
  status: PaymentStatus,
): BadgeVariant => {
  const variantMap: Record<PaymentStatus, BadgeVariant> = {
    settled: "success",
    failed: "destructive",
    pending_approval: "warning",
  };

  return variantMap[status] || "secondary";
};
