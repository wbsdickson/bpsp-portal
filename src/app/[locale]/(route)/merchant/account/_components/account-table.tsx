"use client";

import * as React from "react";

import { DataTable } from "@/components/data-table";
import { FilterChipMultiSelectPopover } from "@/components/filter-chip-multiselect-popover";
import { FilterChipPopover } from "@/components/filter-chip-popover";
import { Button } from "@/components/ui/button";
import { useMerchantAccountStore } from "@/store/merchant/merchant-account-store";
import { Plus, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import useMerchantAccountTableColumn from "../_hook/use-table-column";

export default function MerchantAccountTable({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Merchant.AccountInformationManagement");
  const router = useRouter();
  const searchParams = useSearchParams();
  const merchantId = searchParams.get("merchantId");

  const allAccounts = useMerchantAccountStore((s) => s.accounts);
  const accounts = React.useMemo(() => {
    const active = allAccounts.filter((u) => !u.deletedAt);
    if (!merchantId) return active;
    return active.filter((a) => a.merchantId === merchantId);
  }, [allAccounts, merchantId]);

  const { column } = useMerchantAccountTableColumn({ addTab });

  return (
    <div className="space-y-3">
      <DataTable
        columns={column}
        data={accounts}
        renderToolbar={(table) => {
          const nameCol = table.getColumn("name");

          return (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <FilterChipPopover
                  label={t("filters.name")}
                  value={String(nameCol?.getFilterValue() ?? "")}
                  onChange={(v) => nameCol?.setFilterValue(v)}
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
