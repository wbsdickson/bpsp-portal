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

import useMerchantCompanyTableColumn from "../_hook/use-table-column";
import { useMerchantCompanyStore } from "@/store/merchant/merchant-company-store";

export default function MerchantCompanyTable({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Merchant.CompanyInformationManagement");
  const searchParams = useSearchParams();
  const merchantId = searchParams.get("merchantId");

  const allCompanies = useMerchantCompanyStore((s) => s.companies);
  const companies = React.useMemo(() => {
    const active = allCompanies.filter((c) => !c.deletedAt);
    if (!merchantId) return active;
    return active.filter((c) => c.createdBy === merchantId);
  }, [allCompanies, merchantId]);

  const { column } = useMerchantCompanyTableColumn({ addTab });

  return (
    <DataTable
      columns={column}
      data={companies}
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
