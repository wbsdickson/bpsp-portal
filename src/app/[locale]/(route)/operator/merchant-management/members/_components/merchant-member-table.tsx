"use client";

import * as React from "react";

import { DataTable } from "@/components/data-table";
import { FilterChipMultiSelectPopover } from "@/components/filter-chip-multiselect-popover";
import { FilterChipPopover } from "@/components/filter-chip-popover";
import { Button } from "@/components/ui/button";
import { useMerchantMemberStore } from "@/store/merchant-member-store";
import { Plus, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import useMerchantMemberTableColumn, {
  MerchantMemberRow,
} from "../_hook/use-table-column";

export default function MerchantMemberTable({
  addTab,
}: {
  addTab: (item: MerchantMemberRow) => void;
}) {
  const t = useTranslations("Operator.MerchantMembers");
  const router = useRouter();
  const searchParams = useSearchParams();
  const merchantId = searchParams.get("merchantId");

  const allMembers = useMerchantMemberStore((s) => s.members);
  const active = allMembers.filter(
    (u) =>
      !u.deletedAt &&
      (u.role === "merchant_owner" ||
        u.role === "merchant_admin" ||
        u.role === "merchant_viewer"),
  );
  const members = !merchantId
    ? active
    : active.filter((u) => u.merchantId === merchantId);

  const { column } = useMerchantMemberTableColumn({ addTab });

  return (
    <div className="space-y-3 p-4">
      <DataTable
        columns={column}
        data={members}
        renderToolbar={(table) => {
          const nameCol = table.getColumn("name");
          const emailCol = table.getColumn("email");
          const statusCol = table.getColumn("status");

          const statusOptions = [
            { value: "active", label: t("statuses.active") },
            { value: "suspended", label: t("statuses.suspended") },
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
                  label={t("filters.name")}
                  value={String(nameCol?.getFilterValue() ?? "")}
                  onChange={(v) => nameCol?.setFilterValue(v)}
                />
                <FilterChipPopover
                  label={t("filters.email")}
                  value={String(emailCol?.getFilterValue() ?? "")}
                  onChange={(v) => emailCol?.setFilterValue(v)}
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
