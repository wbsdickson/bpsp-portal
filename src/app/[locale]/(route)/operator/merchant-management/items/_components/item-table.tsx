"use client";

import * as React from "react";

import { DataTable } from "@/components/data-table";
import { FilterChipMultiSelectPopover } from "@/components/filter-chip-multiselect-popover";
import { FilterChipPopover } from "@/components/filter-chip-popover";
import { Button } from "@/components/ui/button";
import { useItemStore } from "@/store/item-store";
import { useTaxStore } from "@/store/tax-store";
import { Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import useItemTableColumn, { type ItemRow } from "../_hook/use-table-column";

export default function ItemTable({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Operator.Items");

  const items = useItemStore((s) => s.items);
  const taxes = useTaxStore((s) => s.taxes);

  const rows: ItemRow[] = React.useMemo(() => {
    const taxNameById = new Map(taxes.map((tx) => [tx.id, tx.name] as const));

    return items
      .filter((it) => !it.deletedAt)
      .map((it) => {
        const taxCategoryLabel = taxNameById.get(it.taxId) ?? it.taxId;
        const statusLabel =
          it.status === "inactive"
            ? t("statuses.inactive")
            : t("statuses.active");
        return {
          ...it,
          taxCategoryLabel,
          statusLabel,
        };
      });
  }, [items, t, taxes]);

  const { column } = useItemTableColumn({ addTab });

  const taxOptions = React.useMemo(
    () => taxes.map((tx) => ({ value: tx.name, label: tx.name })),
    [taxes],
  );

  const statusOptions = [
    { value: t("statuses.active"), label: t("statuses.active") },
    { value: t("statuses.inactive"), label: t("statuses.inactive") },
  ];

  return (
    <div className="space-y-3">
      <DataTable
        columns={column}
        data={rows}
        renderToolbar={(table) => {
          const nameCol = table.getColumn("name");
          const taxCategoryCol = table.getColumn("taxCategoryLabel");
          const statusCol = table.getColumn("statusLabel");

          const rawTax = taxCategoryCol?.getFilterValue();
          const taxValues = Array.isArray(rawTax)
            ? (rawTax as string[])
            : rawTax
              ? [String(rawTax)]
              : [];

          const rawStatus = statusCol?.getFilterValue();
          const statusValues = Array.isArray(rawStatus)
            ? (rawStatus as string[])
            : rawStatus
              ? [String(rawStatus)]
              : [];

          return (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <FilterChipPopover
                  label={t("filters.name")}
                  value={String(nameCol?.getFilterValue() ?? "")}
                  onChange={(v) => nameCol?.setFilterValue(v)}
                />

                <FilterChipMultiSelectPopover
                  label={t("filters.taxCategory")}
                  values={taxValues}
                  options={taxOptions}
                  onChange={(vals) =>
                    taxCategoryCol?.setFilterValue(
                      vals.length ? vals : undefined,
                    )
                  }
                  searchPlaceholder={t("filters.search")}
                  resetLabel={t("filters.reset")}
                  doneLabel={t("filters.done")}
                  placeholder={t("filters.all")}
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
                  type="button"
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
