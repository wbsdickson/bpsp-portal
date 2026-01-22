"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { requestPasswordReset } from "./actions";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

/**
 * Function ID: MERCHANT_002a
 * Function Name: Password Reset (Send Email)
 * Category: Screen Function (SSR)
 * Objective: Allow merchant users who have forgotten their password to receive a password-reset URL sent to their registered email address.
 */

export default function ForgotPasswordPage() {
  const t = useTranslations("Auth");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const locale = useLocale();

  const forgotPasswordSchema = z.object({
    email: z.string().email({ message: t("invalidEmail") }),
  });

  type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: ForgotPasswordFormValues) {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("email", data.email);

    try {
      const result = await requestPasswordReset(formData);

      if (result.success) {
        setIsSubmitted(true);
        toast.success(t("forgotPasswordToastSuccess"));
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error(t("forgotPasswordToastUnexpectedError"));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isSubmitted) {
    return (
      <Card className="bg-card w-full border-0 shadow-2xl backdrop-blur">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="bg-success/10 dark:bg-success/20 rounded-full p-3">
              <CheckCircle2 className="text-success h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-foreground text-xl">
            {t("forgotPasswordEmailSentTitle")}
          </CardTitle>
          <CardDescription className="text-muted-foreground whitespace-pre-line">
            {t("forgotPasswordEmailSentDescription")}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button variant="link" asChild>
            <Link href={`/${locale}/signin`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("backToLogin")}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="mb-16 items-center gap-1">
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center rounded-lg">
            <Image
              src="/logo.png"
              alt="JPCC Logo"
              width={32}
              height={32}
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-primary text-4xl font-bold">JPCC</span>
          </div>
        </div>
        <div>
          <span className="text-primary text-xs">{t("logoSubtitle")}</span>
        </div>
      </div>
      <div className="mb-6 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("forgotPasswordTitle")}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t("forgotPasswordDescription")}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    floatingLabel={true}
                    label={t("forgotPasswordEmailLabel")}
                    className="bg-card"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="bg-primary w-full hover:bg-blue-700"
            disabled={isLoading || !form.formState.isValid}
          >
            {isLoading
              ? t("forgotPasswordSubmitting")
              : t("forgotPasswordSubmit")}
          </Button>

          <div className="text-center">
            <Button
              variant="link"
              asChild
              className="text-muted-foreground text-sm"
            >
              <Link href={`/${locale}/signin`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("backToLogin")}
              </Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
