import { BadgeVariant } from "@/components/ui/badge";

export const getAutoIssuanceStatusBadgeVariant = (
  enabled: boolean,
): BadgeVariant => {
  return enabled ? "success" : "secondary";
};
