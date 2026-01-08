import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-bold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/20 text-primary [a&]:hover:bg-primary/30",
        secondary:
          "border-transparent bg-secondary/20 text-secondary-foreground [a&]:hover:bg-secondary/30",
        destructive:
          "border-transparent bg-destructive/20 text-destructive [a&]:hover:bg-destructive/30 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        success:
          "border-transparent bg-green-200 text-green-700 [a&]:hover:bg-green-300 focus-visible:ring-green-500/20 dark:focus-visible:ring-green-500/40",
        warning:
          "border-transparent bg-amber-200 text-amber-700 [a&]:hover:bg-amber-300 focus-visible:ring-amber-500/20 dark:focus-visible:ring-amber-500/40",
        info: "border-transparent bg-blue-200 text-blue-700 [a&]:hover:bg-blue-300 focus-visible:ring-blue-500/20 dark:focus-visible:ring-blue-500/40",
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

export { Badge, badgeVariants };
