import { BadgeVariant } from "@/components/ui/badge";
import { Item } from "@/lib/types";

// Assume status is "active" | "inactive" based on existing code
// If Item['status'] is strictly typed, let's use it.
type ItemStatus = NonNullable<Item["status"]>;

export const getStatusBadgeVariant = (status: ItemStatus): BadgeVariant => {
  const variantMap: Record<ItemStatus, BadgeVariant> = {
    active: "outline-success",
    inactive: "outline-destructive",
  };

  return variantMap[status] || "outline-info";
};
