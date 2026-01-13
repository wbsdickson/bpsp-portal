"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/lib/store";
import { AppUser } from "@/types/user";
import { User } from "@/lib/types";

type AccountInformationValues = {
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
};

export default function AccountInformationForm() {
  const t = useTranslations("Merchant.AccountInformationManagement");

  const { data: session } = useSession();
  const currentUser = session?.user as AppUser | undefined;
  const updateUser = useAppStore((s) => s.updateUser);

  const schema = React.useMemo(
    () =>
      z
        .object({
          name: z.string().min(1, t("validation.nameRequired")),
          email: z
            .string()
            .min(1, t("validation.emailRequired"))
            .email(t("validation.emailInvalid")),
          password: z.string().optional(),
          confirmPassword: z.string().optional(),
        })
        .refine(
          (data) => {
            if (data.password && data.password.length > 0) {
              return data.password === data.confirmPassword;
            }
            return true;
          },
          {
            message: t("validation.passwordMismatch"),
            path: ["confirmPassword"],
          },
        ),
    [t],
  );

  const form = useForm<AccountInformationValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: currentUser?.name ?? "",
      email: currentUser?.email ?? "",
      password: "",
      confirmPassword: "",
    },
  });

  React.useEffect(() => {
    if (currentUser) {
      form.reset({
        name: currentUser.name,
        email: currentUser.email,
        password: "",
        confirmPassword: "",
      });
    }
  }, [currentUser, form]);

  const onSubmit = form.handleSubmit((data) => {
    if (!currentUser) {
      toast.error(t("messages.userNotFound"));
      return;
    }

    const users = useAppStore.getState().users;
    const emailExists = users.some(
      (user) => user.email === data.email && user.id !== currentUser.id,
    );

    if (emailExists) {
      toast.error(t("messages.emailAlreadyInUse"));
      return;
    }

    const updateData: Partial<AppUser> = {
      name: data.name.trim(),
      email: data.email.trim(),
    };

    if (data.password && data.password.length > 0) {
      (updateData as any).password = data.password;
    }

    updateUser(currentUser.id, updateData as Partial<User>);
    toast.success(t("messages.updateSuccess"));

    form.setValue("password", "");
    form.setValue("confirmPassword", "");
  });

  if (!currentUser) {
    return (
      <div className="space-y-4">
        <div className="text-muted-foreground text-sm">
          {t("messages.userNotFound")}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("form.personalInformation")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("form.name")} <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form.namePlaceholder")}
                          className="h-9"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("form.email")}{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t("form.emailPlaceholder")}
                          className="h-9"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <div>
                <div className="mb-2">
                  <CardTitle>{t("form.changePassword")}</CardTitle>
                </div>
                <div className="mb-4">
                  <CardDescription>{t("form.passwordNote")}</CardDescription>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.newPassword")}</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder={t("form.passwordPlaceholder")}
                            className="h-9"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.confirmPassword")}</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder={t("form.confirmPasswordPlaceholder")}
                            className="h-9"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="h-9"
                  disabled={form.formState.isSubmitting}
                >
                  {t("buttons.updateAccount")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
