"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useClientStore } from "@/store/client-store";
import { useDeliveryNoteStore } from "@/store/delivery-note-store";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function DeliveryNoteDetail({
  deliveryNoteId,
}: {
  deliveryNoteId: string;
}) {
  const t = useTranslations("Operator.DeliveryNotes");
  const router = useRouter();

  const deliveryNote = useDeliveryNoteStore((s) =>
    s.getDeliveryNoteById(deliveryNoteId),
  );
  const client = useClientStore((s) =>
    deliveryNote ? s.getClientById(deliveryNote.clientId) : undefined,
  );

  if (!deliveryNote || deliveryNote.deletedAt) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm">
            {t("messages.notFound")}
          </div>
        </CardContent>
      </Card>
    );
  }

  const issueDateLabel = deliveryNote.deliveryDate
    ? (() => {
        const dt = new Date(deliveryNote.deliveryDate);
        return Number.isNaN(dt.getTime())
          ? deliveryNote.deliveryDate
          : dt.toLocaleDateString();
      })()
    : "—";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle>{deliveryNote.deliveryNoteNumber}</CardTitle>
          <Button
            type="button"
            className="h-9 bg-indigo-600 hover:bg-indigo-700"
            onClick={() =>
              router.push(`/operator/delivery-notes/edit/${deliveryNote.id}`)
            }
          >
            {t("actions.edit")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.number")}
            </div>
            <div className="font-medium">{deliveryNote.deliveryNoteNumber}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.client")}
            </div>
            <div className="font-medium">
              {client?.name ?? deliveryNote.clientId}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.amount")}
            </div>
            <div className="font-medium">
              {deliveryNote.amount.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.issueDate")}
            </div>
            <div className="font-medium">{issueDateLabel}</div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.status")}
            </div>
            <div className="font-medium capitalize">{deliveryNote.status}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
