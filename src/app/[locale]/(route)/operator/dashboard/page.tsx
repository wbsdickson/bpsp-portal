import { auth } from "@/auth";
import HeaderPage from "@/components/header-page";
import DashboardClient from "./_components/dashboard-client";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return (
    <HeaderPage title="Dashboard">
      <DashboardClient />
    </HeaderPage>
  );
}
