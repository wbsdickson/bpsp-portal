"use client";

export default function HeaderPage({
  children,
  title,
  pageActions,
}: {
  children: React.ReactNode;
  title: string;
  pageActions?: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        {pageActions}
      </div>
      <div className="rounded-lg bg-white p-4">{children}</div>
    </div>
  );
}
