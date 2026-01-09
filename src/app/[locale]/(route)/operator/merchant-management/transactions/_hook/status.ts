import { BadgeVariant } from "@/components/ui/badge";

export const getStatusBadgeVariant = (status: string): BadgeVariant => {
  const variantMap: Record<string, BadgeVariant> = {
    active: "success",
    inactive: "destructive",
    "pending_approval": "warning",
    "settled": "success",
    "failed": "destructive"
  };

  return variantMap[status] || "secondary";
};
