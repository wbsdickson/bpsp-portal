"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { getSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { UserRole } from "@/lib/types";
import { Loader2 } from "lucide-react";

type DemoAccountsProps = {
  locale: string;
};

export function DemoAccounts({ locale }: DemoAccountsProps) {
  const t = useTranslations("Auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAppStore();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleDemoLogin = async (email: string) => {
    setIsLoading(email);
    const password = "password123";

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!result || result.error) {
      setIsLoading(null);
      return;
    }

    const callbackUrl = searchParams.get("callbackUrl");
    const safeCallbackUrl = callbackUrl
      ? callbackUrl.replace(/^\/+/, "").replace(/^https?:\/\//, "")
      : null;

    const session = await getSession();
    const role =
      session?.user && "role" in session.user ? session.user.role : "operator";
    login(role as UserRole);

    const isMerchantRole =
      role === "merchant_owner" ||
      role === "merchant_admin" ||
      role === "merchant_viewer";
    const nextUrl = safeCallbackUrl
      ? `/${locale}/${safeCallbackUrl}`
      : `/${locale}/${isMerchantRole ? "merchant" : "operator"}/dashboard`;

    router.replace(nextUrl);
  };

  return (
    <div className="bg-muted/40 rounded-md border p-3 text-sm">
      <div className="text-foreground/80 font-medium">{t("demoAccounts")}</div>
      <div className="text-foreground/70 mt-2 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span>{t("demoAccountAdmin")}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDemoLogin("bob@bpsp.com")}
            disabled={isLoading !== null}
            className="h-7 text-xs"
          >
            {isLoading === "bob@bpsp.com" ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              t("loginButton")
            )}
          </Button>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span>{t("demoAccountMerchant")}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDemoLogin("alice@techcorp.com")}
            disabled={isLoading !== null}
            className="h-7 text-xs"
          >
            {isLoading === "alice@techcorp.com" ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              t("loginButton")
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
