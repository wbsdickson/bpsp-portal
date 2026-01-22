import { BadgeVariant } from "@/components/ui/badge";

export const getStatusBadgeVariant = (status: string): BadgeVariant => {
  const variantMap: Record<string, BadgeVariant> = {
    active: "outline-success",
    inactive: "outline-destructive",
    pending_approval: "outline-warning",
    settled: "outline-success",
    failed: "outline-destructive",
  };

  return variantMap[status] || "secondary";
};
