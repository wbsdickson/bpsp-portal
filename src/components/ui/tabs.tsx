"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
const tabsListVariants = cva("inline-flex", {
  variants: {
    variant: {
      default:
        "bg-muted items-center justify-center h-10 rounded-md p-1 text-muted-foreground",
      outline: "border-b border-gray-200 w-full",
      // Add more variants here
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
const tabsTriggerVariants = cva(
  "rounded-sm px-3 py-1.5 inline-flex items-center justify-center text-sm font-medium whitespace-nowrap transition-all ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ",
  {
    variants: {
      variant: {
        default:
          "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        outline:
          "dark:data-[state=active]:bg-transparent dark:data-[state=active]:border-none group rounded-none bg-transparent shadow-none duration-300 ease-in-out data-[state=active]:shadow-none",
        theme:
          "data-[state=active]:bg-theme-background data-[state=active]:text-theme-foreground data-[state=active]:shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & {
  variant?: "default" | "outline";
}) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> & {
  variant?: "default" | "outline" | "theme";
}) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-foreground text-foreground dark:text-muted-foreground h-[calc(100%-1px)] flex-1 border border-transparent [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        tabsTriggerVariants({ variant }),
        className,
      )}
      {...props}
    >
      {variant === "outline" ? (
        <div className={cn("relative w-full", className)}>
          {props.children}
          <div className="group-data-[state=active]:border-b-primary absolute bottom-[-9px] left-0 w-full border-b-2 border-b-transparent transition-all duration-300 ease-in-out"></div>
        </div>
      ) : (
        props.children
      )}
    </TabsPrimitive.Trigger>
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
