import { redirect } from "next/navigation";

import { auth } from "@/auth";
import type { AppUser } from "@/types/user";

export default async function LocaleIndexPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const session = await auth();
  const currentUser = session?.user as AppUser | undefined;
  if (!session?.user) {
    redirect(`/${locale}/signin`);
  }

  const isMerchantRole =
    currentUser?.role === "merchant_owner" ||
    currentUser?.role === "merchant_admin" ||
    currentUser?.role === "merchant_viewer";
  if (isMerchantRole) {
    redirect(`/${locale}/merchant/dashboard`);
  }

  redirect(`/${locale}/operator/dashboard`);
}
