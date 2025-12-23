import { auth } from "@/auth";
import HeaderPage from "@/components/header-page";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const session = await auth();

  return (
    <HeaderPage title="Dashboard">
      <div>Content</div>
    </HeaderPage>
  );
}
