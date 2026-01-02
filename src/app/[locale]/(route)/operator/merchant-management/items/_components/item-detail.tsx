"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useItemStore } from "@/store/item-store";
import { useTaxStore } from "@/store/tax-store";
import { useTranslations } from "next-intl";
import { useBasePath } from "@/hooks/use-base-path";

export default function ItemDetail({ itemId }: { itemId: string }) {
  const t = useTranslations("Operator.Items");
  const { basePath } = useBasePath();
  const item = useItemStore((s) => s.getItemById(itemId));
  const tax = useTaxStore((s) =>
    item?.taxId ? s.getTaxById(item.taxId) : undefined,
  );

  if (!item || item.deletedAt) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.name")}
            </div>
            <div className="font-medium">{item.name}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.unitPrice")}
            </div>
            <div className="font-medium">
              {(item.unitPrice ?? 0).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.taxCategory")}
            </div>
            <div className="font-medium">{tax?.name ?? item.taxId}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.description")}
            </div>
            <div className="font-medium">{item.description?.trim() || "—"}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.status")}
            </div>
            <div className="font-medium">
              {item.status === "inactive"
                ? t("statuses.inactive")
                : t("statuses.active")}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
