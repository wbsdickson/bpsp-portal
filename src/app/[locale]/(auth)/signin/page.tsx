import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { SignInForm } from "./signin-form";
import { DemoAccounts } from "./demo-accounts";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type SignInPageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ callbackUrl?: string }>;
};

export default async function SignInPage({
  params,
  searchParams,
}: SignInPageProps) {
  const { locale } = await params;
  const sp = searchParams ? await searchParams : undefined;
  const callbackUrl = sp?.callbackUrl;
  const t = await getTranslations({ locale, namespace: "Auth" });

  const safeCallbackUrl = callbackUrl
    ? callbackUrl.replace(/^\/+/, "").replace(/^https?:\/\//, "")
    : null;

  return (
    <div className="w-full space-y-6">
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

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("signInTitle")}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t("signInDescription")}
        </p>
      </div>

      <SignInForm locale={locale} />

      <div className="flex flex-row items-center justify-center gap-3">
        <div className="bg-muted-foreground h-[1px] w-1/2"></div>
        <span className="text-muted-foreground whitespace-nowrap text-xs">
          {t("orDivider")}
        </span>
        <div className="bg-muted-foreground h-[1px] w-1/2"></div>
      </div>

      <div className="space-y-3 text-center font-bold">
        <p className="text-muted-foreground text-sm">{t("noAccountYet")}</p>
        <Link
          href={
            safeCallbackUrl
              ? `/${locale}/register?callbackUrl=${encodeURIComponent(
                  safeCallbackUrl,
                )}`
              : `/${locale}/register`
          }
        >
          <Button
            variant="outline"
            className="text-primary border-primary w-full"
          >
            {t("freeAccountRegistration")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
