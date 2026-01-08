import LocaleSwitcher from "@/components/locale-switcher";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AuthLayout({
  children,
  params,
}: Readonly<AuthLayoutProps>) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Auth" });

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/login-bg.jpg)" }}
      />
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-10 lg:grid-cols-2">
        <div className="text-white">
          <h1 className="whitespace-pre-line text-5xl font-bold leading-[1.05] tracking-tight">
            {t("welcomeTitle")}
          </h1>
          <p className="mt-6 max-w-md text-sm text-white/75">
            {t("welcomeDescription")}
          </p>
        </div>

        <div className="w-full max-w-xl space-y-4 justify-self-end">
          <LocaleSwitcher />
          {children}
        </div>
      </div>
    </div>
  );
}
