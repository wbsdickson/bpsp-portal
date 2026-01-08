"use client";

import * as React from "react";

import { DataTable } from "@/components/data-table";
import { FilterChipMultiSelectPopover } from "@/components/filter-chip-multiselect-popover";
import { FilterChipPopover } from "@/components/filter-chip-popover";
import { Button } from "@/components/ui/button";
import { useMidFeeStore } from "@/store/mid-fee-store";
import { useMidStore } from "@/store/mid-store";
import type { MidFeeStatus } from "@/types/mid-fee";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import useMidFeeTableColumn, {
  type MidFeeRow,
} from "../_hook/use-table-column";

export default function MidFeeTable({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Operator.MIDFee");

  const fees = useMidFeeStore((s) => s.fees);
  const mids = useMidStore((s) => s.mids);

  const rows: MidFeeRow[] = React.useMemo(() => {
    const midById = new Map(mids.map((m) => [m.id, m] as const));

    return fees.map((f) => {
      const mid = midById.get(f.midId);
      return {
        ...f,
        midLabel: mid?.mid ?? f.midId,
        brand: mid?.brand ?? "—",
      };
    });
  }, [fees, mids]);

  const { column } = useMidFeeTableColumn({ addTab });

  return (
    <div className="space-y-3 p-4">
      <DataTable
        columns={column}
        data={rows}
        renderToolbar={(table) => {
          const brandCol = table.getColumn("brand");
          const midCol = table.getColumn("midLabel");
          const statusCol = table.getColumn("status");

          const statusOptions: { value: MidFeeStatus; label: string }[] = [
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
                  label={t("filters.brand")}
                  value={String(brandCol?.getFilterValue() ?? "")}
                  onChange={(v) => brandCol?.setFilterValue(v)}
                />

                <FilterChipPopover
                  label={t("filters.mid")}
                  value={String(midCol?.getFilterValue() ?? "")}
                  onChange={(v) => midCol?.setFilterValue(v)}
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
