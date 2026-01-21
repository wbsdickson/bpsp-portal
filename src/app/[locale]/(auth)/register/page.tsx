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
      <div className="mb-16 items-center gap-1">
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center rounded-lg">
            <Image
              src="/logo.png"
              alt="JPCC Logo"
              width={32}
              height={32}
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-primary text-4xl font-bold">JPCC</span>
          </div>
        </div>
        <div>
          <span className="text-primary text-xs">{t("logoSubtitle")}</span>
        </div>
      </div>
      <UserRegistrationForm />
    </div>
  );
}
