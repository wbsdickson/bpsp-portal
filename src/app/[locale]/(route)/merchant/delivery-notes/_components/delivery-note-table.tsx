"use client";

import * as React from "react";

import { DataTable } from "@/components/data-table";
import { FilterChipMultiSelectPopover } from "@/components/filter-chip-multiselect-popover";
import { FilterChipPopover } from "@/components/filter-chip-popover";
import { Button } from "@/components/ui/button";
import { useClientStore, type ClientStoreState } from "@/store/client-store";
import { useDeliveryNoteStore } from "@/store/merchant/delivery-note-store";
import type { DeliveryNoteStatus } from "@/lib/types";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import useDeliveryNoteTableColumn, {
  type DeliveryNoteRow,
} from "../_hook/use-table-column";
import DateRangePicker from "@/components/date-range-picker";
import { asDateValue, toYmd } from "@/lib/date-utils";

const STATUS_OPTIONS: DeliveryNoteStatus[] = [
  "draft",
  "sent",
  "accepted",
  "rejected",
  "expired",
];

const selectClients = (s: ClientStoreState) => s.clients;

export default function DeliveryNoteTable({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Merchant.DeliveryNotes");

  const deliveryNotes = useDeliveryNoteStore((s) => s.deliveryNotes);
  const clients = useClientStore(selectClients);

  const [deliveryDateFrom, setDeliveryDateFrom] = React.useState<string>("");
  const [deliveryDateTo, setDeliveryDateTo] = React.useState<string>("");
  const deliveryDateFromValue = asDateValue(deliveryDateFrom);
  const deliveryDateToValue = asDateValue(deliveryDateTo);

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
    <div className="space-y-3">
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
                  label={t("filters.client")}
                  value={String(clientCol?.getFilterValue() ?? "")}
                  onChange={(v) => clientCol?.setFilterValue(v)}
                />
                <DateRangePicker
                  label={t("filters.deliveryDate")}
                  initialDateFrom={asDateValue(
                    deliveryDateFromValue ? toYmd(deliveryDateFromValue) : "",
                  )}
                  initialDateTo={asDateValue(
                    deliveryDateToValue ? toYmd(deliveryDateToValue) : "",
                  )}
                  onUpdate={({ range }) => {
                    setDeliveryDateFrom(range?.from ? toYmd(range.from) : "");
                    setDeliveryDateTo(range?.to ? toYmd(range.to) : "");
                  }}
                  align="start"
                />

                <Button
                  type="button"
                  size="sm"
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
