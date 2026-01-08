"use client";

import * as React from "react";

import { DataTable } from "@/components/data-table";
import { FilterChipPopover } from "@/components/filter-chip-popover";
import { Button } from "@/components/ui/button";
import { useMerchantClientStore } from "@/store/merchant/merchant-client-store";
import { useMerchantMemberStore } from "@/store/merchant-member-store";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import useClientTableColumn, {
  type ClientRow,
} from "../_hook/use-table-column";

export default function ClientTable({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Merchant.Clients");

  const clients = useMerchantClientStore((s) => s.clients);
  const members = useMerchantMemberStore((s) => s.members);

  const rows: ClientRow[] = React.useMemo(() => {
    const memberNameById = new Map(members.map((u) => [u.id, u.name] as const));
    return clients
      .filter((c) => !c.deletedAt)
      .map((c) => ({
        ...c,
        contactPerson: c.createdBy
          ? (memberNameById.get(c.createdBy) ?? "—")
          : "—",
      }));
  }, [clients, members]);

  const { column } = useClientTableColumn({ addTab });

  return (
    <div className="space-y-3">
      <DataTable
        columns={column}
        data={rows}
        renderToolbar={(table) => {
          const nameCol = table.getColumn("name");
          const phoneCol = table.getColumn("phoneNumber");
          const emailCol = table.getColumn("email");

          return (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <FilterChipPopover
                  label={t("filters.name")}
                  value={String(nameCol?.getFilterValue() ?? "")}
                  onChange={(v) => nameCol?.setFilterValue(v)}
                />
                <FilterChipPopover
                  label={t("filters.phoneNumber")}
                  value={String(phoneCol?.getFilterValue() ?? "")}
                  onChange={(v) => phoneCol?.setFilterValue(v)}
                />
                <FilterChipPopover
                  label={t("filters.email")}
                  value={String(emailCol?.getFilterValue() ?? "")}
                  onChange={(v) => emailCol?.setFilterValue(v)}
                />

                <Button size="sm" onClick={() => table.resetColumnFilters()}>
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
