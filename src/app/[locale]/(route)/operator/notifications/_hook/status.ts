import { BadgeVariant } from "@/components/ui/badge";
import { PublicationStatus } from "./use-table-column";

export const getNotificationStatusBadgeVariant = (
  status: PublicationStatus,
): BadgeVariant => {
  const variantMap: Record<PublicationStatus, BadgeVariant> = {
    published: "outline-success",
    scheduled: "outline-warning",
    expired: "outline-destructive",
  };

  return variantMap[status] || "secondary";
};
