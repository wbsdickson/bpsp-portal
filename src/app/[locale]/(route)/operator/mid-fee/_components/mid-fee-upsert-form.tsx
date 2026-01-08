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
import { useMidFeeStore } from "@/store/mid-fee-store";
import { useMidStore } from "@/store/mid-store";
import type { MidFeeStatus } from "@/types/mid-fee";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type MidFeeUpsertValues = {
  midId: string;
  mdrPercent: string;
  fixedFeeAmount: string;
  status: MidFeeStatus;
};

const STATUS_OPTIONS: MidFeeStatus[] = ["active", "inactive"];

export default function MidFeeUpsertForm({ feeId }: { feeId?: string }) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Operator.MIDFee");

  const fee = useMidFeeStore((s) => (feeId ? s.getFeeById(feeId) : undefined));
  const mids = useMidStore((s) => s.mids);

  const addFee = useMidFeeStore((s) => s.addFee);
  const updateFee = useMidFeeStore((s) => s.updateFee);

  const numberString = (message: string) =>
    z
      .string()
      .min(1, message)
      .refine((v) => {
        const n = Number(v);
        return Number.isFinite(n);
      }, message);

  const schema = React.useMemo(
    () =>
      z.object({
        midId: z.string().min(1, t("validation.midRequired")),
        mdrPercent: numberString(t("validation.mdrMin"))
          .refine((v) => Number(v) >= 0, t("validation.mdrMin"))
          .refine((v) => Number(v) <= 100, t("validation.mdrMax")),
        fixedFeeAmount: numberString(t("validation.fixedFeeMin")).refine(
          (v) => Number(v) >= 0,
          t("validation.fixedFeeMin"),
        ),
        status: z.enum(["active", "inactive"]),
      }),
    [t],
  );

  const form = useForm<MidFeeUpsertValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      midId: fee?.midId ?? "",
      mdrPercent: String(fee?.mdrPercent ?? ""),
      fixedFeeAmount: String(fee?.fixedFeeAmount ?? ""),
      status: (fee?.status ?? "active") as MidFeeStatus,
    },
  });

  useEffect(() => {
    form.reset({
      midId: fee?.midId ?? "",
      mdrPercent: String(fee?.mdrPercent ?? ""),
      fixedFeeAmount: String(fee?.fixedFeeAmount ?? ""),
      status: (fee?.status ?? "active") as MidFeeStatus,
    });
  }, [fee, form]);

  const onSubmit = form.handleSubmit((data) => {
    const mdrPercent = Number(data.mdrPercent);
    const fixedFeeAmount = Number(data.fixedFeeAmount);

    if (feeId) {
      updateFee(feeId, {
        midId: data.midId,
        mdrPercent,
        fixedFeeAmount,
        status: data.status,
      });
      router.push(`/${locale}/operator/mid-fee`);
      return;
    }

    addFee({
      midId: data.midId,
      mdrPercent,
      fixedFeeAmount,
      status: data.status,
    });

    router.push(`/${locale}/operator/mid-fee`);
  });

  const title = feeId ? t("form.editTitle") : t("form.createTitle");

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
                name="midId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.mid")}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-9 w-full">
                          <SelectValue placeholder={t("form.selectMid")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mids.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.mid}
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.status")}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-9 w-full">
                          <SelectValue placeholder={t("form.selectStatus")} />
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

              <FormField
                control={form.control}
                name="mdrPercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.mdr")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
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
                name="fixedFeeAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.fixedFeeAmount")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        className="h-9"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className="mt-4 justify-end gap-2">
            <Button
              
              variant="outline"
              className="h-9"
              onClick={() => router.push(`/${locale}/operator/mid-fee`)}
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
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
