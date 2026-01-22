import { BadgeVariant } from "@/components/ui/badge";
import { MerchantFeeStatus } from "@/types/merchant-fee";

export const getStatusBadgeVariant = (
  status: MerchantFeeStatus,
): BadgeVariant => {
  const variantMap: Record<MerchantFeeStatus, BadgeVariant> = {
    active: "outline-success",
    suspended: "outline-destructive",
  };

  return variantMap[status] || "outline-info";
};
