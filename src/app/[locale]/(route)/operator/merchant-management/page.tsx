import { redirect } from "next/navigation";

export default async function MerchantManagementPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/operator/merchant-management/dashboard`);
}
