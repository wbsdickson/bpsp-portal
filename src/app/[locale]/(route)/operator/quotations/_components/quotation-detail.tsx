"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useClientStore } from "@/store/client-store";
import { useQuotationStore } from "@/store/quotation-store";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function QuotationDetail({
  quotationId,
}: {
  quotationId: string;
}) {
  const t = useTranslations("Operator.Quotations");
  const router = useRouter();

  const quotation = useQuotationStore((s) => s.getQuotationById(quotationId));
  const client = useClientStore((s) =>
    quotation ? s.getClientById(quotation.clientId) : undefined,
  );

  if (!quotation || quotation.deletedAt) {
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

  const issueDateLabel = quotation.quotationDate
    ? (() => {
        const dt = new Date(quotation.quotationDate);
        return Number.isNaN(dt.getTime())
          ? quotation.quotationDate
          : dt.toLocaleDateString();
      })()
    : "—";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle>{quotation.quotationNumber}</CardTitle>
          <Button
            type="button"
            className="h-9 bg-indigo-600 hover:bg-indigo-700"
            onClick={() =>
              router.push(`/operator/quotations/edit/${quotation.id}`)
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
            <div className="font-medium">{quotation.quotationNumber}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.client")}
            </div>
            <div className="font-medium">
              {client?.name ?? quotation.clientId}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.amount")}
            </div>
            <div className="font-medium">
              {quotation.amount.toLocaleString()}
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
            <div className="font-medium">
              {t(`statuses.${quotation.status}`)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
