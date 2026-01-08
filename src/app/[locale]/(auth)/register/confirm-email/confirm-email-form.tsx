"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";

const schema = z.object({
  verificationCode: z.string().min(1, { message: "Required" }),
});

type Values = z.infer<typeof schema>;

export function ConfirmEmailForm() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const searchParams = useSearchParams();

  const locale = useLocale();

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { verificationCode: "" },
  });

  async function onSubmit(values: Values) {
    // TODO: wire to confirm/verify action
    console.log(values);
    const callbackUrl = searchParams.get("callbackUrl");
    const nextUrl = callbackUrl
      ? `/${locale}/register/final-register?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : `/${locale}/register/final-register`;
    router.push(nextUrl);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("confirmEmailTitle")}
          </h1>
          <p className="text-muted-foreground whitespace-pre-line text-sm leading-relaxed">
            {t("confirmEmailDescription")}
          </p>
        </div>

        <FormField
          control={form.control}
          name="verificationCode"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <label className="text-sm font-medium leading-none">
                {t("verificationCodeLabel")}
              </label>
              <FormControl>
                <Input
                  placeholder={t("verificationCodePlaceholder")}
                  className="h-10"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between pt-1">
          <Button
            variant="link"
            
            className="px-0 text-sm"
            onClick={() => {
              // TODO: wire resend
            }}
          >
            {t("resend")}
          </Button>

          <Button
            type="submit"
            className="h-10 w-[120px]"
            disabled={form.formState.isSubmitting || !form.formState.isValid}
          >
            {form.formState.isSubmitting ? "..." : t("verify")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
