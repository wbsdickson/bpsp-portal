import { Card, CardContent } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

import { UserRegistrationForm } from "./_components/registration/user-registration-form";
import Image from "next/image";

type RegisterPageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ callbackUrl?: string }>;
};

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: "Auth" });

  return (
    <div className="w-full space-y-6">
      <UserRegistrationForm />
    </div>
  );
}
