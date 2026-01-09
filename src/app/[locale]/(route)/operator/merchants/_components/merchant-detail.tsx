"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useInvoiceStore } from "@/store/invoice-store";
import { useMerchantStore } from "@/store/merchant-store";
import { useMerchantFeeStore } from "@/store/merchant-fee-store";
import { useMerchantMemberStore } from "@/store/merchant-member-store";
import { Link } from "next-view-transitions";
import { useLocale, useTranslations } from "next-intl";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InlineEditField } from "@/components/inline-edit-field";
import { createMerchantSchema } from "../_lib/merchant-schema";
import { TitleField } from "@/components/title-field";

export default function MerchantDetail({ merchantId }: { merchantId: string }) {
  const locale = useLocale();
  const t = useTranslations("Operator.Merchants");

  const merchant = useMerchantStore((s) => s.getMerchantById(merchantId));
  const updateMerchant = useMerchantStore((s) => s.updateMerchant);
  const fees = useMerchantFeeStore((s) => s.fees);
  const invoices = useInvoiceStore((s) => s.invoices);
  const members = React.useMemo(
    () => useMerchantMemberStore.getState().getMembersByMerchantId(merchantId),
    [merchantId],
  );

  const [isEditing, setIsEditing] = React.useState(false);

  const schema = React.useMemo(() => createMerchantSchema(t), [t]);
  type MerchantDetailValues = z.infer<typeof schema>;

  const form = useForm<MerchantDetailValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: merchant?.name ?? "",
      address: merchant?.address ?? "",
    },
  });

  // Reset form when merchant changes or edit mode closes (cancel)
  React.useEffect(() => {
    if (merchant) {
      form.reset({
        name: merchant.name,
        address: merchant.address ?? "",
      });
    }
  }, [merchant, form, isEditing]);

  if (!merchant) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm">
            {t("messages.merchantNotFound")}
          </div>
        </CardContent>
      </Card>
    );
  }

  const onSubmit = form.handleSubmit((data) => {
    updateMerchant(merchantId, {
      name: data.name,
      address: data.address,
    });
    setIsEditing(false);
  });

  const onCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  const registrationLabel = merchant.createdAt
    ? (() => {
        const dt = new Date(merchant.createdAt);
        return Number.isNaN(dt.getTime())
          ? merchant.createdAt
          : dt.toLocaleString();
      })()
    : "—";

  const fee =
    fees.find((f) => f.merchantId === merchant.id && f.status === "active") ??
    fees.find((f) => f.merchantId === merchant.id);
  const feeRateLabel = fee ? `${fee.mdrPercent.toFixed(2)}%` : "—";

  const transactionAmount = React.useMemo(() => {
    return invoices
      .filter((inv) => !inv.deletedAt && inv.merchantId === merchant.id)
      .reduce(
        (acc, inv) =>
          acc +
          (typeof inv.amount === "number"
            ? inv.amount
            : Number(inv.amount ?? 0)),
        0,
      );
  }, [invoices, merchant.id]);

  const representative =
    members.find((m) => m.memberRole === "owner") ?? members[0];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{merchant.name}</h2>
        </div>
        <div className="flex items-center gap-2">
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
      <div className="bg-card rounded-lg p-4">
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <InlineEditField
                control={form.control}
                name="name"
                label={t("columns.name")}
                isEditing={isEditing}
                value={merchant.name}
                renderInput={(field) => <Input {...field} />}
              />

              <TitleField
                label={t("columns.merchantId")}
                value={<div className="font-medium">{merchant.id}</div>}
              />

              <InlineEditField
                control={form.control}
                name="address"
                label="Address"
                isEditing={isEditing}
                value={merchant.address ?? "—"}
                renderInput={(field) => <Input {...field} />}
              />

              <TitleField
                label={t("columns.registrationDate")}
                value={<div className="font-medium">{registrationLabel}</div>}
              />
            </div>
          </form>
        </Form>

        <Separator className="my-4" />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <TitleField
            label="Representative"
            value={
              <div className="font-medium">{representative?.name ?? "—"}</div>
            }
          />

          <TitleField
            label="Fee rate"
            value={<div className="font-medium">{feeRateLabel}</div>}
          />

          <TitleField
            label={t("columns.transactionCount")}
            value={
              <div className="font-medium">
                {merchant.transactionCount ?? 0}
              </div>
            }
          />

          <TitleField
            label="Transaction amount"
            value={
              <div className="font-medium">
                {transactionAmount.toLocaleString()}
              </div>
            }
          />

          <TitleField
            label="Contact person"
            value={
              <div className="font-medium">{representative?.name ?? "—"}</div>
            }
          />

          <TitleField
            label="Contact email"
            value={
              <div className="font-medium">{representative?.email ?? "—"}</div>
            }
          />
        </div>
      </div>
    </div>
  );
}
