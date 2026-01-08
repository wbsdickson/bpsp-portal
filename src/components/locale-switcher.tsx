// components/LocaleSwitcher.js
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Languages, Check } from "lucide-react";

import { setUserLocale } from "@/actions/set-locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function LocaleSwitcher() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const locale = useLocale();

  const options = [
    { value: "en", label: "English" },
    { value: "ja", label: "日本語" },
  ] as const;

  const current = options.find((o) => o.value === locale)?.label ?? locale;

  const handleLocaleChange = (newLocale: string) => {
    startTransition(async () => {
      await setUserLocale(newLocale);
      router.refresh();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isPending}
          className="h-8 gap-2"
        >
          <Languages className="size-4" />
          <span className="text-sm">{current}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="min-w-40">
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => handleLocaleChange(opt.value)}
            disabled={isPending || opt.value === locale}
          >
            <span className="flex-1">{opt.label}</span>
            {opt.value === locale ? <Check className="size-4" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
