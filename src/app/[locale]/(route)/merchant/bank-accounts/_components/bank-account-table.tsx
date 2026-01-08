"use client";

import { DataTable } from "@/components/data-table";
import { FilterChipPopover } from "@/components/filter-chip-popover";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import useBankAccountTableColumn from "../_hook/use-table-column";
import { useMerchantBankAccountStore } from "@/store/merchant/merchant-bank-account-store";

export default function BankAccountTable({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Merchant.BankAccounts");

  const bankAccounts = useMerchantBankAccountStore((s) => s.bankAccounts);
  const rows = bankAccounts.filter((a) => !a.deletedAt);

  const { column } = useBankAccountTableColumn({ addTab });

  return (
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
  );
}
