import * as React from "react";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps extends React.ComponentProps<typeof Badge> {
  variant?: BadgeVariant;
}

export function StatusBadge({
  className,
  variant,
  ...props
}: StatusBadgeProps) {
  return (
    <Badge
      variant={variant}
      className={cn("font-bold", className)}
      {...props}
    />
  );
}
