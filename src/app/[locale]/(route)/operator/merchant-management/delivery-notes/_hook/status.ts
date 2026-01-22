import { BadgeVariant } from "@/components/ui/badge";
import { DeliveryNoteStatus } from "@/lib/types";

export const getDeliveryNoteStatusBadgeVariant = (
  status: DeliveryNoteStatus,
): BadgeVariant => {
  const variantMap: Record<DeliveryNoteStatus, BadgeVariant> = {
    issued: "outline-success",
    accepted: "outline-success",
    rejected: "outline-destructive",
    sent: "outline-warning",
    draft: "outline-info",
    expired: "outline-destructive",
  };

  return variantMap[status] || "secondary";
};
