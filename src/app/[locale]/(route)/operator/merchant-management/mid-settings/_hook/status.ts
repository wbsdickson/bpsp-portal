import { BadgeVariant } from "@/components/ui/badge";
import { MerchantMidStatus } from "@/types/merchant-mid";

export const getStatusBadgeVariant = (
  status: MerchantMidStatus,
): BadgeVariant => {
  const variantMap: Record<MerchantMidStatus, BadgeVariant> = {
    active: "success",
    inactive: "secondary",
  };

  return variantMap[status] || "secondary";
};
