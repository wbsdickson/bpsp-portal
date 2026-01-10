import { BadgeVariant } from "@/components/ui/badge";
import { PublicationStatus } from "./use-table-column";

export const getNotificationStatusBadgeVariant = (
  status: PublicationStatus,
): BadgeVariant => {
  const variantMap: Record<PublicationStatus, BadgeVariant> = {
    published: "success",
    scheduled: "warning",
    expired: "secondary",
  };

  return variantMap[status] || "secondary";
};
