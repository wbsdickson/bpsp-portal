"use client";

import * as React from "react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMidFeeStore } from "@/store/mid-fee-store";
import { useMidStore } from "@/store/mid-store";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InlineEditField } from "@/components/inline-edit-field";
import { createMidFeeSchema } from "../_lib/mid-fee-schema";
import { MidFeeStatus } from "@/types/mid-fee";
import { StatusBadge } from "@/components/status-badge";
import { getMidFeeStatusBadgeVariant } from "../_hook/status";

const STATUS_OPTIONS: MidFeeStatus[] = ["active", "inactive"];

export default function MidFeeDetail({ feeId }: { feeId: string }) {
  const t = useTranslations("Operator.MIDFee");
  const router = useRouter();

  const fee = useMidFeeStore((s) => (feeId ? s.getFeeById(feeId) : undefined));
  const updateFee = useMidFeeStore((s) => s.updateFee);
  const mid = useMidStore((s) =>
    fee?.midId ? s.getMidById(fee.midId) : undefined,
  );

  const [isEditing, setIsEditing] = useState(false);

  const schema = React.useMemo(() => createMidFeeSchema(t), [t]);
  type MidFeeDetailValues = z.infer<typeof schema>;

  const form = useForm<MidFeeDetailValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: (fee?.status ?? "active") as MidFeeStatus,
      mdrPercent: fee?.mdrPercent ?? 0,
      fixedFeeAmount: fee?.fixedFeeAmount ?? 0,
    },
  });

  useEffect(() => {
    if (fee) {
      form.reset({
        status: fee.status,
        mdrPercent: fee.mdrPercent,
        fixedFeeAmount: fee.fixedFeeAmount,
      });
    }
  }, [fee, form, isEditing]);

  if (!fee) {
    return (
      <div className="bg-card rounded-lg p-4">
        <h3 className="text-lg font-medium">{t("title")}</h3>
        <div className="text-muted-foreground mt-2 text-sm">
          {t("messages.notFound")}
        </div>
      </div>
    );
  }

  const onSubmit = form.handleSubmit((data) => {
    updateFee(feeId, {
      status: data.status,
      mdrPercent: data.mdrPercent,
      fixedFeeAmount: data.fixedFeeAmount,
    });
    setIsEditing(false);
  });

  const onCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  const updatedAtLabel = fee.updatedAt
    ? (() => {
        const dt = new Date(fee.updatedAt);
        return Number.isNaN(dt.getTime()) ? fee.updatedAt : dt.toLocaleString();
      })()
    : "—";

  return (
    <div className="bg-card space-y-4 rounded-lg p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-medium">{mid?.mid ?? fee.midId}</h3>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="secondary"
                size="xs"
                onClick={onCancel}
                title={t("buttons.cancel")}
              >
                Discard
              </Button>
              <Button
                variant="secondary"
                size="xs"
                onClick={onSubmit}
                title={t("buttons.save")}
              >
                Save
              </Button>
            </>
          ) : (
            <Button
              variant="secondary"
              size="xs"
              onClick={() => setIsEditing(true)}
              title={t("actions.edit")}
            >
              Edit
            </Button>
          )}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <InlineEditField
              control={form.control}
              name="status"
              label={t("columns.status")}
              isEditing={isEditing}
              value={
                fee.status ? (
                  <StatusBadge
                    variant={getMidFeeStatusBadgeVariant(
                      (fee.status as MidFeeStatus) || "active",
                    )}
                  >
                    {t(`statuses.${fee.status}`)}
                  </StatusBadge>
                ) : (
                  t("statuses.active")
                )
              }
              renderInput={(field) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {t(`statuses.${s}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            <div className="space-y-1">
              <div className="text-muted-foreground text-sm font-medium">
                {t("columns.mid")}
              </div>
              <div className="flex h-9 items-center text-sm font-medium">
                {mid?.mid ?? fee.midId}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-muted-foreground text-sm font-medium">
                {t("columns.brand")}
              </div>
              <div className="flex h-9 items-center text-sm font-medium">
                {mid?.brand ?? "—"}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-muted-foreground text-sm font-medium">
                {t("columns.updatedAt")}
              </div>
              <div className="flex h-9 items-center text-sm font-medium">
                {updatedAtLabel}
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <InlineEditField
              control={form.control}
              name="mdrPercent"
              label={t("columns.mdr")}
              isEditing={isEditing}
              value={`${fee.mdrPercent.toFixed(2)}%`}
              renderInput={(field) => (
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  className="h-9"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />

            <InlineEditField
              control={form.control}
              name="fixedFeeAmount"
              label={t("columns.fixedFeeAmount")}
              isEditing={isEditing}
              value={fee.fixedFeeAmount.toFixed(2)}
              renderInput={(field) => (
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  className="h-9"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
