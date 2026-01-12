"use client";

import { cn, toCapitalized } from "@/lib/utils";

export default function HeaderPage({
  children,
  title,
  pageActions,
  capitalizeTitle = true,
  containerClassName,
}: {
  children: React.ReactNode;
  title: string;
  pageActions?: React.ReactNode;
  capitalizeTitle?: boolean;
  containerClassName?: string;
}) {
  return (
    <div className={cn("space-y-4", containerClassName)}>
      <div className="flex w-full items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          {capitalizeTitle ? toCapitalized(title) : title}
        </h2>
        {pageActions}
      </div>
      <div>{children}</div>
    </div>
  );
}
