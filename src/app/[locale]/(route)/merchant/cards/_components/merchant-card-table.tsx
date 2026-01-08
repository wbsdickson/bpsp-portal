"use client";

import * as React from "react";

import { DataTable } from "@/components/data-table";
import { FilterChipPopover } from "@/components/filter-chip-popover";
import { Button } from "@/components/ui/button";
import { useMerchantCardStore } from "@/store/merchant/merchant-card-store";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import useMerchantCardTableColumn, {
  type MerchantCardRow,
} from "../_hook/use-table-column";
import { useMerchantStore } from "@/store/merchant-store";

export default function MerchantCardTable() {
  const t = useTranslations("Merchant.MerchantCards");

  const cards = useMerchantCardStore((s) => s.cards);
  const getCardStatus = useMerchantCardStore((s) => s.getCardStatus);

  const merchants = useMerchantStore((s) => s.merchants);

  const rows: MerchantCardRow[] = React.useMemo(() => {
    return cards
      .filter((c) => !c.deletedAt)
      .map((c) => {
        const status = getCardStatus(c);
        const statusLabel = t(`statuses.${status}`);

        const mm = String(c.expiryMonth ?? "").padStart(2, "0");
        const yy = String(c.expiryYear ?? "");
        const expirationLabel = mm && yy ? `${mm}/${yy}` : "—";
        const merchantNameById = new Map(
          merchants.map((m) => [m.id, m.name] as const),
        );

        return {
          ...c,
          statusLabel,
          expirationLabel,
          merchantName: merchantNameById.get(c.merchantId) ?? "—",
        };
      });
  }, [cards, getCardStatus, t]);

  const { column } = useMerchantCardTableColumn();

  return (
    <div className="space-y-3">
      <DataTable
        columns={column}
        data={rows}
        renderToolbar={(table) => {
          const brandCol = table.getColumn("cardBrand");
          const last4Col = table.getColumn("last4");
          const expirationCol = table.getColumn("expirationLabel");

          return (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <FilterChipPopover
                  label={t("filters.brand")}
                  value={String(brandCol?.getFilterValue() ?? "")}
                  onChange={(v) => brandCol?.setFilterValue(v)}
                />
                <FilterChipPopover
                  label={t("filters.last4")}
                  value={String(last4Col?.getFilterValue() ?? "")}
                  onChange={(v) => last4Col?.setFilterValue(v)}
                />
                <FilterChipPopover
                  label={t("filters.expirationDate")}
                  value={String(expirationCol?.getFilterValue() ?? "")}
                  onChange={(v) => expirationCol?.setFilterValue(v)}
                />

                <Button
                  
                  variant="ghost"
                  size="sm"
                  className="h-9 text-indigo-600 hover:text-indigo-700"
                  onClick={() => table.resetColumnFilters()}
                >
                  {t("buttons.clearFilters")}
                  <X className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
