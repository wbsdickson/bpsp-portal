"use client";

import * as React from "react";

import { DataTable } from "@/components/data-table";
import { FilterChipMultiSelectPopover } from "@/components/filter-chip-multiselect-popover";
import { FilterChipPopover } from "@/components/filter-chip-popover";
import { Button } from "@/components/ui/button";
import { useMerchantMemberStore } from "@/store/merchant/merchant-member-store";
import { Plus, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import useMerchantMemberTableColumn from "../_hook/use-table-column";

export default function MerchantMemberTable({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Merchant.MerchantMembers");
  const searchParams = useSearchParams();
  const merchantId = searchParams.get("merchantId");

  const allMembers = useMerchantMemberStore((s) => s.members);
  const active = allMembers.filter((u) => !u.deletedAt);
  const members = !merchantId
    ? active
    : active.filter((u) => u.merchantId === merchantId);

  const { column } = useMerchantMemberTableColumn({ addTab });

  return (
    <DataTable
      columns={column}
      data={members}
      renderToolbar={(table) => {
        const nameCol = table.getColumn("name");
        const emailCol = table.getColumn("email");
        const roleCol = table.getColumn("role");

        const roleOptions = [
          { value: "owner", label: t("memberRoles.owner") },
          { value: "staff", label: t("memberRoles.staff") },
          { value: "viewer", label: t("memberRoles.viewer") },
        ];

        const rawRoleValue = roleCol?.getFilterValue();
        const roleValues = Array.isArray(rawRoleValue)
          ? (rawRoleValue as string[])
          : rawRoleValue
            ? [String(rawRoleValue)]
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
                label={t("filters.role")}
                values={roleValues}
                options={roleOptions}
                onChange={(vals) =>
                  roleCol?.setFilterValue(vals.length ? vals : undefined)
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
  );
}
