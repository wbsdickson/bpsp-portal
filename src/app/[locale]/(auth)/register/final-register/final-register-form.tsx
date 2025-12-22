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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter, useSearchParams } from "next/navigation";

const schema = z.object({
  businessType: z.enum(["corporation", "freelance"], {
    message: "Required",
  }),
  representativeName: z.string().min(1, { message: "Required" }),
  companyName: z.string().min(1, { message: "Required" }),
  phoneNumber: z.string().min(1, { message: "Required" }),
});

type Values = z.infer<typeof schema>;

export function FinalRegisterForm() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const searchParams = useSearchParams();

  const locale = useLocale();

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      businessType: "corporation",
      representativeName: "",
      companyName: "",
      phoneNumber: "",
    },
  });

  async function onSubmit(values: Values) {
    // TODO: wire to final registration action
    const callbackUrl = searchParams.get("callbackUrl");
    const nextUrl = callbackUrl
      ? `/${locale}/register/complete?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : `/${locale}/register/complete`;
    router.push(nextUrl);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="text-center text-xl font-semibold tracking-tight">
          {t("finalRegisterTitle")}
        </div>

        <FormField
          control={form.control}
          name="businessType"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <label className="text-sm font-medium leading-none">
                {t("finalRegisterBusinessTypeLabel")}
              </label>
              <FormControl>
                <RadioGroup
                  className="flex flex-wrap items-center gap-4"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <label className="flex items-center gap-2 text-sm">
                    <RadioGroupItem value="corporation" />
                    {t("finalRegisterBusinessTypeCorporation")}
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <RadioGroupItem value="freelance" />
                    {t("finalRegisterBusinessTypeFreelance")}
                  </label>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="representativeName"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <label className="text-sm font-medium leading-none">
                {t("finalRegisterRepresentativeNameLabel")}
              </label>
              <FormControl>
                <Input placeholder="Value" className="h-10" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <label className="text-sm font-medium leading-none">
                {t("finalRegisterCompanyNameLabel")}
              </label>
              <FormControl>
                <Input placeholder="Value" className="h-10" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <label className="text-sm font-medium leading-none">
                {t("finalRegisterPhoneNumberLabel")}
              </label>
              <FormControl>
                <Input
                  placeholder="Value"
                  className="h-10"
                  autoComplete="tel"
                  inputMode="tel"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="h-11 w-full rounded-md"
          disabled={form.formState.isSubmitting || !form.formState.isValid}
        >
          {form.formState.isSubmitting ? "..." : t("finalRegisterSubmit")}
        </Button>
      </form>
    </Form>
  );
}
