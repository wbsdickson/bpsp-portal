"use client";

import * as React from "react";

import { DataTable } from "@/components/data-table";
import { FilterChipMultiSelectPopover } from "@/components/filter-chip-multiselect-popover";
import { FilterChipPopover } from "@/components/filter-chip-popover";
import { Button } from "@/components/ui/button";
import { useClientStore, type ClientStoreState } from "@/store/client-store";
import { useDeliveryNoteStore } from "@/store/delivery-note-store";
import type { DeliveryNoteStatus } from "@/lib/types";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import useDeliveryNoteTableColumn, {
  type DeliveryNoteRow,
} from "../_hook/use-table-column";

const STATUS_OPTIONS: DeliveryNoteStatus[] = ["draft", "issued"];

const selectClients = (s: ClientStoreState) => s.clients;

export default function DeliveryNoteTable({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Operator.DeliveryNotes");

  const deliveryNotes = useDeliveryNoteStore((s) => s.deliveryNotes);
  const clients = useClientStore(selectClients);

  const rows: DeliveryNoteRow[] = React.useMemo(() => {
    const clientNameById = new Map(
      clients.filter((c) => !c.deletedAt).map((c) => [c.id, c.name] as const),
    );

    return deliveryNotes
      .filter((dn) => !dn.deletedAt)
      .map((dn) => {
        const issueDateLabel = dn.deliveryDate
          ? (() => {
              const dt = new Date(dn.deliveryDate);
              return Number.isNaN(dt.getTime())
                ? dn.deliveryDate
                : dt.toLocaleDateString();
            })()
          : "—";

        return {
          ...dn,
          clientName: clientNameById.get(dn.clientId) ?? "—",
          issueDateLabel,
        };
      });
  }, [clients, deliveryNotes]);

  const { column } = useDeliveryNoteTableColumn({ addTab });

  return (
    <div className="space-y-3 p-4">
      <DataTable
        columns={column}
        data={rows}
        renderToolbar={(table) => {
          const numberCol = table.getColumn("deliveryNoteNumber");
          const clientCol = table.getColumn("clientName");
          const issueDateCol = table.getColumn("issueDateLabel");
          const statusCol = table.getColumn("status");

          const statusOptions = STATUS_OPTIONS.map((s) => ({
            value: s,
            label: t(`statuses.${s}`),
          }));

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
                  label={t("filters.number")}
                  value={String(numberCol?.getFilterValue() ?? "")}
                  onChange={(v) => numberCol?.setFilterValue(v)}
                />
                <FilterChipPopover
                  label={t("filters.client")}
                  value={String(clientCol?.getFilterValue() ?? "")}
                  onChange={(v) => clientCol?.setFilterValue(v)}
                />
                <FilterChipPopover
                  label={t("filters.issueDate")}
                  value={String(issueDateCol?.getFilterValue() ?? "")}
                  onChange={(v) => issueDateCol?.setFilterValue(v)}
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
