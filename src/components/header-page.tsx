"use client";

import { toCapitalized } from "@/lib/utils";

export default function HeaderPage({
  children,
  title,
  pageActions,
  capitalizeTitle = true,
}: {
  children: React.ReactNode;
  title: string;
  pageActions?: React.ReactNode;
  capitalizeTitle?: boolean;
}) {
  return (
    <div className="space-y-4">
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
