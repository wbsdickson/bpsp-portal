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
import { useMidStore } from "@/store/mid-store";
import type { MidStatus } from "@/types/mid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type MidUpsertValues = {
  mid: string;
  brand: string;
  connectionEndpoint: string;
  status: MidStatus;
};

const STATUS_OPTIONS: MidStatus[] = ["active", "inactive"];

interface MidUpsertFormProps {
  midId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export default function MidUpsertForm({
  midId,
  onSuccess,
  onCancel,
  isModal = false,
}: MidUpsertFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Operator.MID");

  const existing = useMidStore((s) =>
    midId ? s.getMidById(midId) : undefined,
  );
  const addMid = useMidStore((s) => s.addMid);
  const updateMid = useMidStore((s) => s.updateMid);

  const schema = React.useMemo(
    () =>
      z.object({
        mid: z.string().min(1, t("validation.midRequired")),
        brand: z.string().min(1, t("validation.brandRequired")),
        connectionEndpoint: z
          .string()
          .min(1, t("validation.connectionEndpointRequired")),
        status: z.enum(["active", "inactive"]),
      }),
    [t],
  );

  const form = useForm<MidUpsertValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      mid: existing?.mid ?? "",
      brand: existing?.brand ?? "",
      connectionEndpoint: existing?.connectionEndpoint ?? "",
      status: (existing?.status ?? "active") as MidStatus,
    },
  });

  useEffect(() => {
    form.reset({
      mid: existing?.mid ?? "",
      brand: existing?.brand ?? "",
      connectionEndpoint: existing?.connectionEndpoint ?? "",
      status: (existing?.status ?? "active") as MidStatus,
    });
  }, [existing, form]);

  const onSubmit = form.handleSubmit((data) => {
    if (midId) {
      updateMid(midId, {
        mid: data.mid.trim(),
        brand: data.brand.trim(),
        connectionEndpoint: data.connectionEndpoint.trim(),
        status: data.status,
      });
      toast.success(t("messages.updateSuccess"));
    } else {
      addMid({
        mid: data.mid.trim(),
        brand: data.brand.trim(),
        connectionEndpoint: data.connectionEndpoint.trim(),
        status: data.status,
        linkedMerchantIds: [],
      });
      toast.success(t("messages.createSuccess"));
    }

    if (onSuccess) {
      onSuccess();
    } else {
      router.push(`/${locale}/operator/mid-setting`);
    }
  });

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push(`/${locale}/operator/mid-setting`);
    }
  };

  const title = midId ? t("form.editTitle") : t("form.createTitle");

  return (
    <Card className={cn(isModal && "border-none shadow-none")}>
      {!isModal && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn(isModal && "p-0")}>
        <Form {...form}>
          <form className="space-y-4" onSubmit={onSubmit}>
            <FormField
              control={form.control}
              name="mid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.mid")}</FormLabel>
                  <FormControl>
                    <Input className="h-9" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.brand")}</FormLabel>
                  <FormControl>
                    <Input className="h-9" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="connectionEndpoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.connectionEndpoint")}</FormLabel>
                  <FormControl>
                    <Input className="h-9" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.status")}</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder={t("form.status")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {t(`statuses.${s}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter
              className={cn("justify-end gap-2 px-0", isModal && "pb-0")}
            >
              <Button
                type="button"
                variant="outline"
                className="h-9"
                onClick={handleCancel}
              >
                {t("buttons.cancel")}
              </Button>
              <Button type="submit" className="h-9">
                {t("buttons.save")}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
