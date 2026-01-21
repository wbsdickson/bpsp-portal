"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
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
import { type User, type UserRole } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useAccountStore } from "@/store/account-store";
import { Eye, EyeOff } from "lucide-react";
import { createUserSchema } from "../_lib/user-schema";

const ROLE_OPTIONS: UserRole[] = [
  "backoffice_admin",
  "backoffice_staff",
  "merchant_owner",
  "merchant_admin",
  "merchant_viewer",
];

export interface UserUpsertFormProps {
  userId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export interface UserUpsertFormHandle {
  isDirty: boolean;
}

const UserUpsertForm = React.forwardRef<
  UserUpsertFormHandle,
  UserUpsertFormProps
>(({ userId, onSuccess, onCancel }, ref) => {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Operator.Accounts");
  const [showPassword, setShowPassword] = useState(false);

  const user = useAccountStore((s) =>
    userId ? s.accounts.find((u) => u.id === userId) : undefined,
  );
  const updateUser = useAccountStore((s) => s.updateAccount);
  const addMember = useAccountStore((s) => s.addAccount);

  const schema = React.useMemo(() => createUserSchema(t), [t]);

  type UserUpsertValues = z.infer<typeof schema>;

  const form = useForm<UserUpsertValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      role: (user?.role ?? "merchant_viewer") as UserRole,
      password: "",
    },
  });

  React.useImperativeHandle(ref, () => ({
    isDirty: form.formState.isDirty,
  }));

  useEffect(() => {
    form.reset({
      name: user?.name ?? "",
      email: user?.email ?? "",
      role: (user?.role ?? "merchant_viewer") as UserRole,
      password: "",
    });
  }, [form, user]);

  const onSubmit = form.handleSubmit((data) => {
    if (userId) {
      updateUser(userId, {
        name: data.name.trim(),
        email: data.email.trim(),
        role: data.role,
        ...(data.password?.trim()
          ? ({ password: data.password } satisfies Partial<User>)
          : {}),
      });
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(`/${locale}/operator/accounts`);
      }
      return;
    }

    const newUser: User = {
      id: generateId("u"),
      name: data.name.trim(),
      email: data.email.trim(),
      role: data.role,
      ...(data.password?.trim()
        ? ({ password: data.password } satisfies Partial<User>)
        : {}),
      lastLoginAt: new Date().toISOString(),
      status: "active",
    };

    addMember(newUser);
    if (onSuccess) {
      onSuccess();
    } else {
      router.push(`/${locale}/operator/accounts`);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("columns.name")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("form.namePlaceholder")} {...field} />
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
                  <Input placeholder={t("form.emailPlaceholder")} {...field} />
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
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder=""
                      {...field}
                    />
                    <Button
                      
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button
            
            variant="outline"
            className="h-9"
            onClick={() => {
              if (onCancel) {
                onCancel();
              } else {
                router.push(`/${locale}/operator/accounts`);
              }
            }}
          >
            {t("buttons.cancel")}
          </Button>
          <Button
            type="submit"
            className="h-9"
            disabled={form.formState.isSubmitting}
          >
            {t("buttons.save")}
          </Button>
        </div>
      </form>
    </Form>
  );
});

export default UserUpsertForm;
