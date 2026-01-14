import { auth } from "@/auth";
import HeaderPage from "@/components/header-page";
import { getTranslations } from "next-intl/server";
import DashboardClient from "./_components/dashboard-client";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Operator.Dashboard" });

  return (
    <HeaderPage title={t("title")}>
      <DashboardClient />
    </HeaderPage>
  );
}
