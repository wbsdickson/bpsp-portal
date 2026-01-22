import LocaleSwitcher from "@/components/locale-switcher";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { VideoBackground } from "./video-background";
import Image from "next/image";

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
    <div className="dark:bg-background grid h-screen grid-cols-1 flex-col items-center justify-center bg-white md:grid-cols-2 lg:max-w-none lg:px-0">
      <div className="mx-auto flex h-full w-full max-w-[550px] flex-col justify-center space-y-6 px-4 md:px-8">
        <div className="mb-8 flex items-start justify-between">
          <div className="mb-8 items-center gap-1 md:mb-16">
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
          <LocaleSwitcher />
        </div>
        {children}
      </div>
      <div className="relative hidden h-full w-full md:block">
        <VideoBackground />
      </div>
    </div>
  );
}
