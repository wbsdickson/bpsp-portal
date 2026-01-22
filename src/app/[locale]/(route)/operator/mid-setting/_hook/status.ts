import { BadgeVariant } from "@/components/ui/badge";
import { MidStatus } from "@/types/mid";

export const getMidSettingStatusBadgeVariant = (
  status: MidStatus,
): BadgeVariant => {
  const variantMap: Record<MidStatus, BadgeVariant> = {
    active: "outline-success",
    inactive: "outline-destructive",
  };

  return variantMap[status] || "secondary";
};
