"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Languages } from "lucide-react";

import { setUserLocale } from "@/actions/set-locale";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LocaleSwitcherHorizontal() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("CommonComponent.LocaleSwitcher");

  const handleLocaleChange = (newLocale: "en" | "ja") => {
    if (newLocale === locale) return;
    startTransition(async () => {
      await setUserLocale(newLocale);
      router.refresh();
    });
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="text-sm font-medium text-black">{t("language")}</div>
      </div>

      <div className="bg-muted flex h-7 rounded-full p-0.5">
        <Button
          variant="ghost"
          size="2xs"
          disabled={isPending}
          className={cn(
            "text-muted-foreground rounded-full px-3 font-normal",
            locale === "ja" &&
              "bg-background font-bold text-black shadow-sm dark:text-white",
          )}
          onClick={() => handleLocaleChange("ja")}
        >
          日本語
        </Button>
        <Button
          variant="ghost"
          size="2xs"
          disabled={isPending}
          className={cn(
            "text-muted-foreground rounded-full px-3 font-normal",
            locale === "en" &&
              "bg-background font-bold text-black shadow-sm dark:text-white",
          )}
          onClick={() => handleLocaleChange("en")}
        >
          EN
        </Button>
      </div>
    </div>
  );
}
