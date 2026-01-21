import LocaleSwitcher from "@/components/locale-switcher";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { VideoBackground } from "./video-background";

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
    <div className="grid h-screen grid-cols-2 flex-col items-center justify-center bg-white lg:max-w-none lg:px-0">
      <div className="mx-auto flex h-full max-w-[550px] flex-col justify-center space-y-6">
        <div className="hidden transition-opacity duration-300 md:mb-4 md:block">
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
