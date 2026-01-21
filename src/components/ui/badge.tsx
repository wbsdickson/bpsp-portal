import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-1 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/20 text-primary [a&]:hover:bg-primary/30",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/30",
        destructive:
          "border-transparent bg-destructive/20 text-destructive [a&]:hover:bg-destructive/30",
        success:
          "border-transparent bg-success/20 text-success [a&]:hover:bg-success/30",
        info: "border-transparent bg-info/20 text-info [a&]:hover:bg-info/30",
        warning:
          "border-transparent bg-warning/20 text-warning [a&]:hover:bg-warning/30",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        "outline-primary":
          "border-primary/30 bg-primary/5 text-primary [a&]:hover:bg-primary/10 rounded",
        "outline-success":
          "border-success/30 bg-success/5 text-success [a&]:hover:bg-success/10 rounded",
        "outline-destructive":
          "border-destructive/30 bg-destructive/5 text-destructive [a&]:hover:bg-destructive/10 rounded",
        "outline-warning":
          "border-warning/30 bg-warning/5 text-warning [a&]:hover:bg-warning/10 rounded",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

export { Badge, badgeVariants };
