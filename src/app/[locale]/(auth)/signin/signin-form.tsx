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
import { Checkbox } from "@/components/ui/checkbox";

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
import { Loader2, Eye, EyeOff } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
  const [quickLoginLoading, setQuickLoginLoading] = useState<string | null>(
    null,
  );
  const searchParams = useSearchParams();
  const schema = useMemo(() => createSchema(t), [t]);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
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

    const isMerchantRole =
      role === "merchant_owner" ||
      role === "merchant_admin" ||
      role === "merchant_viewer";
    const nextUrl = safeCallbackUrl
      ? `/${locale}/${safeCallbackUrl}`
      : `/${locale}/${isMerchantRole ? "merchant" : "operator"}/dashboard`;

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

  const handleQuickLogin = async (email: string) => {
    setQuickLoginLoading(email);
    setFormError(null);
    const password = "password123";

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!result || result.error) {
      setQuickLoginLoading(null);
      setFormError(t("invalidCredentialsError"));
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormControl>
                <Input
                  floatingLabel={true}
                  label={t("emailLabel")}
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
              <FormControl>
                <div className="relative">
                  <Input
                    floatingLabel={true}
                    label={t("passwordLabel")}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className="pr-10"
                    {...field}
                  />
                  <Button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent p-0 hover:bg-transparent"
                  >
                    {showPassword ? (
                      <Eye className="text-primary h-4 w-4" />
                    ) : (
                      <EyeOff className="text-primary h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center space-x-2">
            <Checkbox
              id="rememberMe"
              className="border-muted-foreground/40 bg-background"
            />
            <span className="text-foreground text-sm">{t("rememberMe")}</span>
          </label>
          <Link
            href={nextForgetUrl}
            className="text-sm text-red-600 hover:underline dark:text-red-400"
          >
            {t("forgotPasswordShort")}
          </Link>
        </div>

        {formError ? (
          <div className="border-destructive/30 bg-destructive/10 text-destructive dark:border-destructive/50 dark:bg-destructive/20 rounded-md border px-3 py-2 text-sm">
            {formError}
          </div>
        ) : null}

        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 w-full"
          disabled={form.formState.isSubmitting || !form.formState.isValid}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("loginButton")}
            </>
          ) : (
            t("loginButton")
          )}
        </Button>

        <div className="border-border bg-muted/30 dark:bg-muted rounded-md border p-3 text-sm">
          <div className="text-foreground mb-2 font-medium">
            {t("quickLogin")}
          </div>
          <div className="text-muted-foreground space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs">Backoffice Admin (Bob)</span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => handleQuickLogin("bob@bpsp.com")}
                disabled={
                  quickLoginLoading !== null || form.formState.isSubmitting
                }
                className="h-7 text-xs"
              >
                {quickLoginLoading === "bob@bpsp.com" ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  t("loginButton")
                )}
              </Button>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs">Backoffice Staff (Jessica)</span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => handleQuickLogin("jessica@bpsp.com")}
                disabled={
                  quickLoginLoading !== null || form.formState.isSubmitting
                }
                className="h-7 text-xs"
              >
                {quickLoginLoading === "jessica@bpsp.com" ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  t("loginButton")
                )}
              </Button>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs">Merchant Owner (Alice)</span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => handleQuickLogin("alice@techcorp.com")}
                disabled={
                  quickLoginLoading !== null || form.formState.isSubmitting
                }
                className="h-7 text-xs"
              >
                {quickLoginLoading === "alice@techcorp.com" ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  t("loginButton")
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
