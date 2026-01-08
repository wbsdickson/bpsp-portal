"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useClientStore } from "@/store/client-store";
import { useDeliveryNoteStore } from "@/store/merchant/delivery-note-store";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useBasePath } from "@/hooks/use-base-path";
import { uuid } from "@/lib/utils";
import * as React from "react";
import { useState, useEffect } from "react";
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
import { createDeliveryNoteSchema } from "../_lib/delivery-note-schema";
import { DeliveryNoteStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export default function DeliveryNoteDetail({
  deliveryNoteId,
}: {
  deliveryNoteId: string;
}) {
  const t = useTranslations("Merchant.DeliveryNotes");
  const { basePath } = useBasePath();
  const [isEditing, setIsEditing] = useState(false);

  const deliveryNote = useDeliveryNoteStore((s) =>
    s.getDeliveryNoteById(deliveryNoteId),
  );
  const updateDeliveryNote = useDeliveryNoteStore((s) => s.updateDeliveryNote);

  const client = useClientStore((s) =>
    deliveryNote ? s.getClientById(deliveryNote.clientId) : undefined,
  );

  const schema = React.useMemo(() => createDeliveryNoteSchema(t), [t]);
  type DeliveryNoteValues = z.infer<typeof schema>;

  const form = useForm<DeliveryNoteValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      deliveryNoteNumber: deliveryNote?.deliveryNoteNumber ?? "",
      status: (deliveryNote?.status ?? "draft") as DeliveryNoteStatus,
      deliveryDate: deliveryNote?.deliveryDate ?? "",
      amount: deliveryNote?.amount ?? 0,
      items: deliveryNote?.items?.map((it) => ({
        itemId: it.itemId ?? "",
        description: it.name ?? "",
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        taxId: it.taxId,
      })) ?? [
        {
          itemId: "placeholder",
          description: "",
          quantity: 1,
          unitPrice: 0,
          taxId: "",
        },
      ],
    },
  });

  // Reset form when deliveryNote changes or edit mode closes (cancel)
  useEffect(() => {
    if (deliveryNote) {
      form.reset({
        deliveryNoteNumber: deliveryNote.deliveryNoteNumber,
        status: deliveryNote.status,
        deliveryDate: deliveryNote.deliveryDate,
        items: deliveryNote.items.map((it) => ({
          itemId: it.itemId ?? "",
          description: it.name ?? "",
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          taxId: it.taxId,
        })),
      });
    }
  }, [deliveryNote, form, isEditing]);

  if (!deliveryNote || deliveryNote.deletedAt) {
    return (
      <div className="bg-card rounded-md p-6">
        <h3 className="text-lg font-semibold">{t("title")}</h3>
        <div className="text-muted-foreground mt-4 text-sm">
          {t("messages.notFound")}
        </div>
      </div>
    );
  }

  const onSubmit = form.handleSubmit((data) => {
    updateDeliveryNote(deliveryNoteId, {
      deliveryNoteNumber: data.deliveryNoteNumber,
      status: data.status,
      deliveryDate: data.deliveryDate,
      amount: data.amount,
      items: data.items.map((it) => ({
        id: uuid("dni"),
        deliveryNoteId,
        itemId: it.itemId,
        name: it.description || "",
        quantity: Number(it.quantity),
        unitPrice: Number(it.unitPrice),
        taxId: it.taxId ?? "",
        amount: Number(it.quantity) * Number(it.unitPrice), // Approximate, recalculated in store/backend usually
      })),
    });
    setIsEditing(false);
  });

  const onCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  const issueDateLabel = deliveryNote.deliveryDate
    ? (() => {
        const dt = new Date(deliveryNote.deliveryDate);
        return Number.isNaN(dt.getTime())
          ? deliveryNote.deliveryDate
          : dt.toLocaleDateString();
      })()
    : "—";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-2xl font-bold tracking-tight">
          {deliveryNote?.deliveryNoteNumber}
        </h2>
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
              {t("actions.edit")}
            </Button>
          )}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit}>
          <div className="bg-card grid grid-cols-1 gap-4 rounded-md p-4 md:grid-cols-2">
            <InlineEditField
              control={form.control}
              name="deliveryNoteNumber"
              label={t("columns.deliveryNoteNumber")}
              isEditing={isEditing}
              value={deliveryNote.deliveryNoteNumber}
              renderInput={(field) => <Input {...field} />}
            />

            <div>
              <div className="text-muted-foreground mb-1 text-xs">
                {t("columns.client")}
              </div>
              <div className="flex h-9 items-center text-sm font-medium">
                {client?.name ?? deliveryNote.clientId}
              </div>
            </div>

            <InlineEditField
              control={form.control}
              name="deliveryDate"
              label={t("columns.deliveryDate")}
              isEditing={isEditing}
              value={issueDateLabel}
              renderInput={(field) => <Input {...field} type="date" />}
            />

            <InlineEditField
              control={form.control}
              name="status"
              label={t("columns.status")}
              isEditing={isEditing}
              value={
                <div className="flex items-center gap-3">
                  {deliveryNote.status === "draft" && (
                    <Badge
                      variant="secondary"
                      className="bg-indigo-50 capitalize text-indigo-700"
                    >
                      {t("statuses.draft")}
                    </Badge>
                  )}
                  {deliveryNote.status === "sent" && (
                    <Badge
                      variant="secondary"
                      className="bg-amber-50 capitalize text-amber-700"
                    >
                      {t("statuses.sent")}
                    </Badge>
                  )}
                  {deliveryNote.status === "accepted" && (
                    <Badge
                      variant="secondary"
                      className="bg-amber-50 capitalize text-amber-700"
                    >
                      {t("statuses.accepted")}
                    </Badge>
                  )}
                  {deliveryNote.status === "rejected" && (
                    <Badge
                      variant="secondary"
                      className="bg-red-50 capitalize text-red-700"
                    >
                      {t("statuses.rejected")}
                    </Badge>
                  )}
                  {deliveryNote.status === "expired" && (
                    <Badge
                      variant="secondary"
                      className="bg-amber-50 capitalize text-amber-700"
                    >
                      {t("statuses.expired")}
                    </Badge>
                  )}
                </div>
              }
              renderInput={(field) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
