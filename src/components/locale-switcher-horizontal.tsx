"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Languages } from "lucide-react";

import { setUserLocale } from "@/actions/set-locale";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LocaleSwitcherHorizontal() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const locale = useLocale();

  const currentLabel = locale === "ja" ? "日本語" : "English";

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
        <div className="text-sm font-medium text-black">Language</div>
      </div>

      <div className="bg-muted flex rounded-full p-0.5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isPending}
          className={cn(
            "text-muted-foreground h-8 rounded-full px-3 font-normal",
            locale === "ja" &&
              "bg-background font-bold text-black shadow-sm dark:text-white",
          )}
          onClick={() => handleLocaleChange("ja")}
        >
          日本語
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isPending}
          className={cn(
            "text-muted-foreground h-8 rounded-full px-3 font-normal",
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
