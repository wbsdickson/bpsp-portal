import { BadgeVariant } from "@/components/ui/badge";
import { MidFeeStatus } from "@/types/mid-fee";

export const getMidFeeStatusBadgeVariant = (
  status: MidFeeStatus,
): BadgeVariant => {
  const variantMap: Record<MidFeeStatus, BadgeVariant> = {
    active: "success",
    inactive: "secondary",
  };

  return variantMap[status] || "secondary";
};
