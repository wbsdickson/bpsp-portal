"use client";

import * as React from "react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMerchantStore } from "@/store/merchant-store";
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
import { createMidSchema } from "../_lib/mid-schema";
import { MidStatus } from "@/types/mid";
import { Badge } from "@/components/ui/badge";
import { getMidSettingBadgeVariant } from "../_hook/status";

const STATUS_OPTIONS: MidStatus[] = ["active", "inactive"];

export default function MidDetail({ id }: { id: string }) {
  const t = useTranslations("Operator.MID");
  const router = useRouter();

  const mid = useMidStore((s) => (id ? s.getMidById(id) : undefined));
  const updateMid = useMidStore((s) => s.updateMid);
  const merchants = useMerchantStore((s) => s.merchants);

  const [isEditing, setIsEditing] = useState(false);

  const schema = React.useMemo(() => createMidSchema(t), [t]);
  type MidDetailValues = z.infer<typeof schema>;

  const form = useForm<MidDetailValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      mid: mid?.mid ?? "",
      brand: mid?.brand ?? "",
      connectionEndpoint: mid?.connectionEndpoint ?? "",
      status: (mid?.status ?? "active") as MidStatus,
    },
  });

  useEffect(() => {
    if (mid) {
      form.reset({
        mid: mid.mid,
        brand: mid.brand,
        connectionEndpoint: mid.connectionEndpoint ?? "",
        status: mid.status,
      });
    }
  }, [mid, form, isEditing]);

  const linkedMerchants = React.useMemo(() => {
    if (!mid) return [];
    const byId = new Map(merchants.map((m) => [m.id, m] as const));
    return (mid.linkedMerchantIds ?? [])
      .map((merchantId) => byId.get(merchantId))
      .filter((m): m is (typeof merchants)[number] => Boolean(m));
  }, [merchants, mid]);

  if (!mid) {
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
    updateMid(id, {
      mid: data.mid,
      brand: data.brand,
      connectionEndpoint: data.connectionEndpoint,
      status: data.status,
    });
    setIsEditing(false);
  });

  const onCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  return (
    <div className="bg-card space-y-4 rounded-lg p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-medium">{mid.mid}</h3>
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
              name="mid"
              label={t("columns.mid")}
              isEditing={isEditing}
              value={mid.mid}
              renderInput={(field) => <Input {...field} className="h-9" />}
            />

            <InlineEditField
              control={form.control}
              name="brand"
              label={t("columns.brand")}
              isEditing={isEditing}
              value={mid.brand}
              renderInput={(field) => <Input {...field} className="h-9" />}
            />

            <InlineEditField
              control={form.control}
              name="connectionEndpoint"
              label={t("columns.connectionEndpoint")}
              isEditing={isEditing}
              value={mid.connectionEndpoint || "—"}
              renderInput={(field) => <Input {...field} className="h-9" />}
            />

            <InlineEditField
              control={form.control}
              name="status"
              label={t("columns.status")}
              isEditing={isEditing}
              value={
                mid.status ? (
                  <Badge
                    variant={getMidSettingBadgeVariant(
                      (mid.status as MidStatus) || "active",
                    )}
                  >
                    {t(`statuses.${mid.status}`)}
                  </Badge>
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
          </div>
        </form>
      </Form>

      <Separator className="my-4" />

      <div>
        <div className="text-sm font-semibold">
          {t("columns.linkedMerchants")}
        </div>
        <div className="mt-2 space-y-1">
          {linkedMerchants.length ? (
            linkedMerchants.map((m) => (
              <div key={m.id} className="text-sm">
                {m.name ?? "—"}
              </div>
            ))
          ) : (
            <div className="text-muted-foreground text-sm">—</div>
          )}
        </div>
      </div>
    </div>
  );
}
