"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";

const schema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(1, { message: "Required" }),
  agreement: z.boolean().refine((v) => v, { message: "Required" }),
});

type Values = z.infer<typeof schema>;

export function RegisterForm() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const searchParams = useSearchParams();

  const locale = useLocale();

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", agreement: false },
    mode: "onChange",
  });

  const callbackUrl = searchParams.get("callbackUrl");

  async function onSubmit(values: Values) {
    // TODO: wire to register action
    console.log(values);
    const callbackUrl = searchParams.get("callbackUrl");
    const nextUrl = callbackUrl
      ? `/${locale}/register/confirm-email?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : `/${locale}/register/confirm-email`;
    router.push(nextUrl);
  }

  const backToLoginUrl = callbackUrl
    ? `/${locale}/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : `/${locale}/signin`;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="text-center text-xl font-semibold tracking-tight">
          {t("registerTitle")}
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium leading-none">
                {t("emailLabel")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Value"
                  autoComplete="email"
                  className="h-10"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium leading-none">
                {t("passwordLabel")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Value"
                  type="password"
                  autoComplete="new-password"
                  className="h-10"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="agreement"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-start gap-3 pt-1">
                <FormControl>
                  <Checkbox
                    id="agreement"
                    className="mt-0.5"
                    checked={field.value}
                    onCheckedChange={(v) => field.onChange(v === true)}
                  />
                </FormControl>
                <div className="space-y-1">
                  <label
                    htmlFor="agreement"
                    className="text-sm font-medium leading-none"
                  >
                    {t("agreementLabel")}
                  </label>
                  <div className="text-muted-foreground text-xs leading-relaxed">
                    <Link href="#" className="underline underline-offset-2">
                      {t("agreementDescription")}
                    </Link>
                  </div>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="h-11 w-full rounded-md"
          disabled={form.formState.isSubmitting || !form.formState.isValid}
        >
          {form.formState.isSubmitting ? "..." : t("registerButton")}
        </Button>

        <div className="text-center">
          <Button
            variant="link"
            asChild
            className="text-muted-foreground text-sm"
          >
            <Link href={backToLoginUrl}>{t("backToLogin")}</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}
