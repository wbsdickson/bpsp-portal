import { BadgeVariant } from "@/components/ui/badge";
import { DeliveryNoteStatus } from "@/lib/types";

export const getDeliveryNoteStatusBadgeVariant = (
  status: DeliveryNoteStatus,
): BadgeVariant => {
  const variantMap: Record<DeliveryNoteStatus, BadgeVariant> = {
    issued: "success",
    accepted: "success",
    rejected: "destructive",
    sent: "warning",
    draft: "info",
    expired: "secondary",
  };

  return variantMap[status] || "secondary";
};
