"use client";

import { DataTable } from "@/components/data-table";
import { FilterChipPopover } from "@/components/filter-chip-popover";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import useMerchantTableColumn from "../_hook/use-table-column";
import { useMerchantStore } from "@/store/merchant-store";

export default function MerchantTable({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Operator.Merchants");
  const merchants = useMerchantStore((s) => s.merchants);
  const router = useRouter();

  const { column } = useMerchantTableColumn({ addTab });

  return (
    <div className="space-y-3">
      <DataTable
        columns={column}
        data={merchants}
        renderToolbar={(table) => {
          const idCol = table.getColumn("id");
          const nameCol = table.getColumn("name");

          return (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <FilterChipPopover
                  label={t("filters.merchantId")}
                  value={String(idCol?.getFilterValue() ?? "")}
                  onChange={(v) => idCol?.setFilterValue(v)}
                />
                <FilterChipPopover
                  label={t("filters.name")}
                  value={String(nameCol?.getFilterValue() ?? "")}
                  onChange={(v) => nameCol?.setFilterValue(v)}
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
