import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { SignInForm } from "./signin-form";

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
    <Card className="bg-background/90 w-full border-0 shadow-2xl backdrop-blur">
      <CardHeader className="space-y-3 text-center">
        <CardTitle className="text-2xl">{t("signInTitle")}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <SignInForm locale={locale} />

          <div className="bg-muted/40 rounded-md border p-3 text-sm">
            <div className="text-foreground/80 font-medium">
              {t("demoAccounts")}
            </div>
            <div className="text-foreground/70 mt-2 space-y-1">
              <div>{t("demoAccountAdmin")}</div>
              <div>{t("demoAccountMerchant")}</div>
            </div>
          </div>

          <p className="text-muted-foreground text-center text-sm">
            {t("noAccount")}{" "}
            <Link
              href={
                safeCallbackUrl
                  ? `/${locale}/register?callbackUrl=${encodeURIComponent(
                      safeCallbackUrl,
                    )}`
                  : `/${locale}/register`
              }
              className="text-foreground underline underline-offset-4"
            >
              {t("registerButton")}
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
