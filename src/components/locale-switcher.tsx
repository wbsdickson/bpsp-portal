// components/LocaleSwitcher.js
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Check } from "lucide-react";
import Image from "next/image";

import { setUserLocale } from "@/actions/set-locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type LocaleSwitcherProps = {
  variant?: "icon-only" | "with-label";
};

export default function LocaleSwitcher({
  variant = "with-label",
}: LocaleSwitcherProps = {}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const locale = useLocale();

  const options = [
    { value: "en", label: "English", icon: "/flags/usa_flag.png" },
    { value: "ja", label: "日本語", icon: "/flags/japan_flag.png" },
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
          size={variant === "icon-only" ? "icon-sm" : "sm"}
          disabled={isPending}
          className={
            variant === "icon-only"
              ? "overflow-hidden rounded-full border-2 p-0"
              : "h-8 gap-2"
          }
        >
          <Image
            src={
              options.find((o) => o.value === locale)?.icon ??
              "/flags/usa-96.png"
            }
            alt={current}
            width={variant === "icon-only" ? 32 : 16}
            height={variant === "icon-only" ? 32 : 16}
            className={
              variant === "icon-only"
                ? "h-full w-full object-cover"
                : "size-4 rounded-sm object-cover"
            }
          />
          {variant === "with-label" && (
            <span className="text-sm">{current}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="min-w-40">
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => handleLocaleChange(opt.value)}
            disabled={isPending || opt.value === locale}
            className="gap-2"
          >
            <Image
              src={opt.icon}
              alt={opt.label}
              width={16}
              height={16}
              className="size-4 rounded-sm object-cover"
            />
            <span className="flex-1">{opt.label}</span>
            {opt.value === locale ? <Check className="size-4" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
