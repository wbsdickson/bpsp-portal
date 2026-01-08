"use client";

import * as React from "react";

import { DataTable } from "@/components/data-table";
import { FilterChipMultiSelectPopover } from "@/components/filter-chip-multiselect-popover";
import { FilterChipPopover } from "@/components/filter-chip-popover";
import { Button } from "@/components/ui/button";
import { useMerchantStore } from "@/store/merchant-store";
import { useMidStore } from "@/store/mid-store";
import type { MidStatus } from "@/types/mid";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import useMidTableColumn, { type MidRow } from "../_hook/use-table-column";

export default function MidTable({ addTab }: { addTab: (id: string) => void }) {
  const t = useTranslations("Operator.MID");

  const mids = useMidStore((s) => s.mids);
  const merchants = useMerchantStore((s) => s.merchants);

  const rows: MidRow[] = React.useMemo(() => {
    const merchantNameById = new Map(
      merchants.map((m) => [m.id, m.name] as const),
    );

    return mids.map((m) => {
      const linkedNames = (m.linkedMerchantIds ?? [])
        .map((id) => merchantNameById.get(id) ?? "—")
        .filter(Boolean);

      return {
        ...m,
        linkedMerchantsCount: (m.linkedMerchantIds ?? []).length,
        linkedMerchantNamesLabel: linkedNames.join(", "),
      };
    });
  }, [merchants, mids]);

  const { column } = useMidTableColumn({ addTab });

  return (
    <div className="space-y-3 p-4">
      <DataTable
        columns={column}
        data={rows}
        initialColumnVisibility={{ linkedMerchantNamesLabel: false }}
        renderToolbar={(table) => {
          const midCol = table.getColumn("mid");
          const brandCol = table.getColumn("brand");
          const statusCol = table.getColumn("status");
          const merchantCol = table.getColumn("linkedMerchantNamesLabel");

          const statusOptions: { value: MidStatus; label: string }[] = [
            { value: "active", label: t("statuses.active") },
            { value: "inactive", label: t("statuses.inactive") },
          ];

          const rawStatusValue = statusCol?.getFilterValue();
          const statusValues = Array.isArray(rawStatusValue)
            ? (rawStatusValue as string[])
            : rawStatusValue
              ? [String(rawStatusValue)]
              : [];

          return (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <FilterChipPopover
                  label={t("filters.mid")}
                  value={String(midCol?.getFilterValue() ?? "")}
                  onChange={(v) => midCol?.setFilterValue(v)}
                />

                <FilterChipPopover
                  label={t("filters.brand")}
                  value={String(brandCol?.getFilterValue() ?? "")}
                  onChange={(v) => brandCol?.setFilterValue(v)}
                />

                <FilterChipPopover
                  label={t("filters.merchant")}
                  value={String(merchantCol?.getFilterValue() ?? "")}
                  onChange={(v) => merchantCol?.setFilterValue(v)}
                />

                <FilterChipMultiSelectPopover
                  label={t("filters.status")}
                  values={statusValues}
                  options={statusOptions}
                  onChange={(vals) =>
                    statusCol?.setFilterValue(vals.length ? vals : undefined)
                  }
                  searchPlaceholder={t("filters.search")}
                  resetLabel={t("filters.reset")}
                  doneLabel={t("filters.done")}
                  placeholder={t("filters.all")}
                />

                <Button
                  variant="ghost-primary"
                  size="sm"
                  onClick={() => table.resetColumnFilters()}
                >
                  {t("buttons.clearFilters")}
                </Button>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
