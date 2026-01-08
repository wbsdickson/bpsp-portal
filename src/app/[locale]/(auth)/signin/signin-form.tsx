"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAppStore } from "@/lib/store";
import { UserRole } from "@/lib/types";
import { Link } from "next-view-transitions";

const createSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().email({ message: t("invalidEmailError") }),
    password: z.string().min(1, { message: t("requiredError") }),
  });

type Values = {
  email: string;
  password: string;
};

export function SignInForm({ locale }: { locale: string }) {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const schema = useMemo(() => createSchema(t), [t]);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "bob@bpsp.com", password: "password123" },
    mode: "onChange",
  });
  const { login } = useAppStore();
  async function onSubmit(values: Values) {
    setFormError(null);

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (!result || result.error) {
      const code = result?.error;
      if (code === "CredentialsSignin") {
        setFormError(t("invalidCredentialsError"));
      } else {
        setFormError(code ?? t("invalidCredentialsError"));
      }
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

    const nextUrl = safeCallbackUrl
      ? `/${locale}/${safeCallbackUrl}`
      : `/${locale}/${role === "merchant" ? "merchant" : "operator"}/dashboard`;

    router.replace(nextUrl);
  }

  const nextForgetUrl = useMemo(() => {
    const callbackUrl = searchParams.get("callbackUrl");
    const safeCallbackUrl = callbackUrl
      ? callbackUrl.replace(/^\/+/, "").replace(/^https?:\/\//, "")
      : null;

    return safeCallbackUrl
      ? `/${locale}/forgot-password?callbackUrl=${encodeURIComponent(
          safeCallbackUrl,
        )}`
      : `/${locale}/forgot-password`;
  }, [locale, searchParams]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>{t("emailLabel")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("emailPlaceholder")}
                  autoComplete="email"
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
              <div className="flex items-center">
                <FormLabel>{t("passwordLabel")}</FormLabel>
                <Link
                  href={nextForgetUrl}
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  {t("forgotPassword")}
                </Link>
              </div>
              <FormControl>
                <Input
                  placeholder={t("passwordPlaceholder")}
                  type="password"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {formError ? (
          <div className="border-destructive/30 bg-destructive/10 text-destructive rounded-md border px-3 py-2 text-sm">
            {formError}
          </div>
        ) : null}
        <Button
          type="submit"
          className="w-full bg-neutral-900 text-white hover:bg-neutral-900/90 dark:bg-white dark:text-neutral-900 dark:hover:bg-white/90"
          disabled={form.formState.isSubmitting || !form.formState.isValid}
        >
          {form.formState.isSubmitting ? t("loading") : t("loginButton")}
        </Button>
        <p className="text-muted-foreground text-center text-xs">
          {t("termsAgreement")}{" "}
          <a
            href="#"
            className="text-foreground text-xs underline underline-offset-4"
          >
            {t("termsOfService")}
          </a>{" "}
          |{" "}
          <a
            href="#"
            className="text-foreground text-xs underline underline-offset-4"
          >
            {t("privacyPolicy")}
          </a>
        </p>
      </form>
    </Form>
  );
}
