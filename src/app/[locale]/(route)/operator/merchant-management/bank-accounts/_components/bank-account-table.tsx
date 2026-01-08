"use client";

import { DataTable } from "@/components/data-table";
import { FilterChipPopover } from "@/components/filter-chip-popover";
import { Button } from "@/components/ui/button";
import { useBankAccountStore } from "@/store/bank-account-store";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import useBankAccountTableColumn from "../_hook/use-table-column";

export default function BankAccountTable({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Operator.BankAccounts");

  const bankAccounts = useBankAccountStore((s) => s.bankAccounts);
  const rows = bankAccounts.filter((a) => !a.deletedAt);

  const { column } = useBankAccountTableColumn({ addTab });

  return (
    <div className="space-y-3 p-4">
      <DataTable
        columns={column}
        data={rows}
        renderToolbar={(table) => {
          const bankNameCol = table.getColumn("bankName");
          const branchNameCol = table.getColumn("branchName");
          const accountHolderCol = table.getColumn("accountHolder");

          return (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <FilterChipPopover
                  label={t("filters.bankName")}
                  value={String(bankNameCol?.getFilterValue() ?? "")}
                  onChange={(v) => bankNameCol?.setFilterValue(v)}
                />
                <FilterChipPopover
                  label={t("filters.branchName")}
                  value={String(branchNameCol?.getFilterValue() ?? "")}
                  onChange={(v) => branchNameCol?.setFilterValue(v)}
                />
                <FilterChipPopover
                  label={t("filters.accountHolder")}
                  value={String(accountHolderCol?.getFilterValue() ?? "")}
                  onChange={(v) => accountHolderCol?.setFilterValue(v)}
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
