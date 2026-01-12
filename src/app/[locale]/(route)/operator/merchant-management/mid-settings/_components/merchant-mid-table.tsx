"use client";

import * as React from "react";

import { DataTable } from "@/components/data-table";
import { FilterChipMultiSelectPopover } from "@/components/filter-chip-multiselect-popover";
import { FilterChipPopover } from "@/components/filter-chip-popover";
import { Button } from "@/components/ui/button";
import { useMerchantStore } from "@/store/merchant-store";
import { useMerchantMidStore } from "@/store/merchant-mid-store";
import type { AppMerchantMid, MerchantMidStatus } from "@/types/merchant-mid";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import useMerchantMidTableColumn, {
  type MerchantMidRow,
} from "../_hook/use-table-column";

export default function MerchantMidTable({
  addTab,
}: {
  addTab: (item: MerchantMidRow) => void;
}) {
  const t = useTranslations("Operator.MerchantMIDs");
  const router = useRouter();

  const mids = useMerchantMidStore((s) => s.mids);
  const merchants = useMerchantStore((s) => s.merchants);

  const rows: MerchantMidRow[] = React.useMemo(() => {
    const merchantNameById = new Map(
      merchants.map((m) => [m.id, m.name] as const),
    );
    return mids.map((m) => ({
      ...m,
      merchantName: merchantNameById.get(m.merchantId) ?? "—",
      cardBrand: m.brand,
    }));
  }, [mids, merchants]);

  const { column } = useMerchantMidTableColumn({ addTab });

  return (
    <div className="space-y-3 p-4">
      <DataTable
        columns={column}
        data={rows}
        renderToolbar={(table) => {
          const merchantNameCol = table.getColumn("merchantName");
          const midCol = table.getColumn("mid");
          const brandCol = table.getColumn("cardBrand");
          const statusCol = table.getColumn("status");

          const statusOptions: { value: MerchantMidStatus; label: string }[] = [
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
                  label={t("filters.merchantName")}
                  value={String(merchantNameCol?.getFilterValue() ?? "")}
                  onChange={(v) => merchantNameCol?.setFilterValue(v)}
                />
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
