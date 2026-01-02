"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import { type User, type UserRole } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { useAccountStore } from "@/store/account-store";

const ROLE_OPTIONS: UserRole[] = [
  "merchant",
  "admin",
  "jpcc_admin",
  "merchant_jpcc",
];

type UserUpsertValues = {
  name: string;
  email: string;
  role: UserRole;
  password: string;
};

export default function UserUpsertForm({ userId }: { userId?: string }) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Operator.Accounts");

  const user = useAccountStore((s) =>
    userId ? s.accounts.find((u) => u.id === userId) : undefined,
  );
  const updateUser = useAccountStore((s) => s.updateAccount);
  const addMember = useAccountStore((s) => s.addAccount);

  const schema = React.useMemo(
    () =>
      z.object({
        name: z.string().min(1, t("validation.nameRequired")),
        email: z
          .string()
          .min(1, t("validation.emailRequired"))
          .email(t("validation.emailInvalid")),
        role: z.enum(["merchant", "admin", "jpcc_admin", "merchant_jpcc"]),
        password: z.string(),
      }),
    [t],
  );

  type UserUpsertValues = z.infer<typeof schema>;

  const form = useForm<UserUpsertValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      role: (user?.role ?? "merchant") as UserRole,
      password: "",
    },
  });

  useEffect(() => {
    form.reset({
      name: user?.name ?? "",
      email: user?.email ?? "",
      role: (user?.role ?? "merchant") as UserRole,
      password: "",
    });
  }, [form, user]);

  const onSubmit = form.handleSubmit((data) => {
    if (userId) {
      updateUser(userId, {
        name: data.name.trim(),
        email: data.email.trim(),
        role: data.role,
        ...(data.password.trim()
          ? ({ password: data.password } satisfies Partial<User>)
          : {}),
      });
      router.push(`/${locale}/operator/accounts`);
      return;
    }

    const newUser: User = {
      id: generateId("u"),
      name: data.name.trim(),
      email: data.email.trim(),
      role: data.role,
      ...(data.password.trim()
        ? ({ password: data.password } satisfies Partial<User>)
        : {}),
      lastLoginAt: new Date().toISOString(),
      status: "active",
    };

    addMember(newUser);
    router.push(`/${locale}/operator/accounts`);
  });

  const title = userId ? t("form.editTitle") : t("form.createTitle");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.name")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.namePlaceholder")}
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
                    <FormLabel>{t("columns.email")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.emailPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.role")}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-9 w-full">
                          <SelectValue placeholder={t("form.selectRole")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ROLE_OPTIONS.map((r) => (
                          <SelectItem key={r} value={r}>
                            {t(`roles.${r}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className="mt-4 justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-9"
              onClick={() => {
                router.push(`/${locale}/operator/accounts`);
              }}
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              type="submit"
              className="h-9 bg-indigo-600 hover:bg-indigo-700"
              disabled={form.formState.isSubmitting}
            >
              {t("buttons.save")}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
