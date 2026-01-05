"use client";

import { DataTable } from "@/components/data-table";
import { FilterChipMultiSelectPopover } from "@/components/filter-chip-multiselect-popover";
import { FilterChipPopover } from "@/components/filter-chip-popover";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import useAccounTableColumn, { UserRow } from "../_hook/use-table-column";
import { useAccountStore } from "@/store/account-store";

export default function UserTable({
  addTab,
}: {
  addTab: (item: UserRow) => void;
}) {
  const t = useTranslations("Operator.Accounts");
  const accounts = useAccountStore((s) => s.accounts);
  const { column } = useAccounTableColumn({
    addTab,
  });

  return (
    <div className="space-y-3">
      <DataTable
        columns={column}
        data={accounts}
        renderToolbar={(table) => {
          const nameCol = table.getColumn("name");
          const emailCol = table.getColumn("email");
          const roleCol = table.getColumn("role");

          const roleOptions = [
            { value: "merchant", label: t("roles.merchant") },
            { value: "admin", label: t("roles.admin") },
            { value: "jpcc_admin", label: t("roles.jpcc_admin") },
            { value: "merchant_jpcc", label: t("roles.merchant_jpcc") },
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
