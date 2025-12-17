import { auth } from "@/auth";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const session = await auth();

  return (
    <div className="p-6">
      <div className="text-lg font-semibold">Dashboard</div>
      <div className="mt-2 text-sm text-muted-foreground">
        Signed in as {session?.user?.email}
      </div>
      <pre className="mt-4 rounded-md border bg-muted/30 p-4 text-xs overflow-auto">
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  );
}
