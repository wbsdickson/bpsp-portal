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
    <div className="relative min-h-screen">
      <VideoBackground />
      <div className="bg-black/55 absolute inset-0" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center px-0 py-0 transition-all duration-300 ease-in-out md:px-6 md:py-10 lg:grid-cols-2 lg:gap-20">
        <div className="hidden w-full text-white transition-all duration-300 ease-in-out md:block md:text-center">
          <h1 className="text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.05] tracking-tight transition-all duration-300 ease-in-out">
            {t("welcomeTitle")}
          </h1>
          <p className="md:mx-none mt-6 max-w-md text-[clamp(0.875rem,1.5vw,1.25rem)] text-white/75 transition-all duration-300 ease-in-out sm:mx-auto">
            {t("welcomeDescription")}
          </p>
        </div>

        <div className="flex h-screen w-full max-w-full flex-col justify-center transition-all duration-300 ease-in-out md:h-auto md:max-w-xl md:justify-self-center lg:justify-self-end">
          <div className="hidden transition-opacity duration-300 md:mb-4 md:block">
            <LocaleSwitcher />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
