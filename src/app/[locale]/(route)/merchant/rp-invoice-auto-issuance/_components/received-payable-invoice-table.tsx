"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/data-table";
import { FilterChipPopover } from "@/components/filter-chip-popover";
import { FilterChipMultiSelectPopover } from "@/components/filter-chip-multiselect-popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { useAppStore } from "@/lib/store";
import { useBasePath } from "@/hooks/use-base-path";
import { useReceivedPayableInvoiceAutoIssuanceStore } from "@/store/merchant/rp-invoice-auto-issuance-store";
import { asDateValue } from "@/lib/date-utils";
import ActionsCell from "../../_components/action-cell";

export type PayableInvoiceRow = {
  id: string;
  settingName: string;
  targetClient: string;
  issuanceCycle: string;
  nextIssuanceDate: string;
  status: string;
  direction: string;
  template: string;
  enabled: boolean;
  notes: string;
};

export default function ReceivedPayableInvoiceTable({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Merchant.ReceivedPayableInvoiceAutoIssuance");

  const clients = useAppStore((s) => s.clients);

  const invoices = useReceivedPayableInvoiceAutoIssuanceStore(
    (s) => s.invoices,
  );
  const { deleteInvoice } = useReceivedPayableInvoiceAutoIssuanceStore();
  const { basePath } = useBasePath();

  const rows = React.useMemo<PayableInvoiceRow[]>(() => {
    return invoices.map((inv) => {
      return {
        id: inv.id,
        settingName: inv.settingName,
        targetClient: inv.targetClient,
        issuanceCycle: inv.issuanceCycle,
        nextIssuanceDate: inv.nextIssuanceDate,
        status: inv.status,
        direction: inv.direction,
        template: inv.template,
        enabled: inv.enabled,
        notes: inv.notes ?? "",
      };
    });
  }, [clients, invoices]);

  const onOpenDetail = (item: PayableInvoiceRow) => {
    router.push(`${basePath}/${item.id}`);
  };

  const onOpenEdit = (item: PayableInvoiceRow) => {
    router.push(`${basePath}/edit/${item.id}`);
  };

  const onDelete = (item: PayableInvoiceRow) => {
    deleteInvoice(item.id);
  };

  const columns = React.useMemo<ColumnDef<PayableInvoiceRow>[]>(
    () => [
      {
        accessorKey: "settingName",
        header: t("columns.settingName"),
        cell: ({ row }) => (
          <Button
            variant="ghost"
            className="h-8 px-2 font-medium"
            onClick={() => addTab(row.original.id)}
          >
            {String(row.getValue("settingName") ?? "")}
          </Button>
        ),
      },
      {
        accessorKey: "targetClient",
        header: t("columns.targetClient"),
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true;
          const rowValue = row.getValue(columnId);

          if (Array.isArray(filterValue)) {
            if (filterValue.length === 0) return true;
            return filterValue.includes(String(rowValue).slice(0, 7));
          }

          return String(rowValue).slice(0, 7) === String(filterValue);
        },
        cell: ({ row }) => (
          <div>{String(row.getValue("targetClient") ?? "")}</div>
        ),
      },
      {
        accessorKey: "issuanceCycle",
        header: t("columns.issuanceCycle"),
        cell: ({ row }) => (
          <div className="capitalize">
            {String(row.getValue("issuanceCycle") ?? "")}
          </div>
        ),
      },
      {
        accessorKey: "nextIssuanceDate",
        header: t("columns.nextIssuanceDate"),
        cell: ({ row }) => {
          const inv = row.original;
          return (
            <div className="font-medium">
              {String(row.getValue("nextIssuanceDate") ?? "")}
            </div>
          );
        },
      },

      {
        accessorKey: "status",
        header: t("columns.status"),
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true;
          const rowValue = row.getValue(columnId);

          if (Array.isArray(filterValue)) {
            if (filterValue.length === 0) return true;
            return filterValue.includes(String(rowValue));
          }

          return String(rowValue) === String(filterValue);
        },
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            {row.original.enabled ? (
              <Badge variant="outline-success">{t("enabled")}</Badge>
            ) : (
              <Badge variant="outline-warning">{t("disabled")}</Badge>
            )}
          </div>
        ),
      },
      {
        id: "actions",
        header: t("columns.actions"),
        size: 100,
        enableHiding: false,
        cell: ({ row }) => (
          <ActionsCell<PayableInvoiceRow>
            item={row.original}
            onOpenDetail={onOpenDetail}
            onOpenEdit={onOpenEdit}
            onDelete={onDelete}
            t={t}
            variant="verbose"
          />
        ),
      },
    ],
    [addTab, deleteInvoice, locale, router, t],
  );

  return (
    <div className="space-y-3 p-4">
      <DataTable
        columns={columns}
        data={rows}
        renderToolbar={(table) => {
          const clientNameCol = table.getColumn("targetClient");
          const statusCol = table.getColumn("status");

          const settingTypeCol = table.getColumn("settingType");
          const settingTypeOptions = [
            { value: "receivable", label: "receivable" },
            { value: "payable", label: "payable" },
          ];

          const rawSettingTypeValue = settingTypeCol?.getFilterValue();
          const settingTypeValues = Array.isArray(rawSettingTypeValue)
            ? (rawSettingTypeValue as string[])
            : rawSettingTypeValue
              ? [String(rawSettingTypeValue)]
              : [];

          const statusOptions = [
            { value: "enabled", label: "enabled" },
            { value: "disabled", label: "disabled" },
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
                  label={t("filters.clientName")}
                  value={String(clientNameCol?.getFilterValue() ?? "")}
                  onChange={(v) => clientNameCol?.setFilterValue(v)}
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

                <FilterChipMultiSelectPopover
                  label={t("filters.settingType")}
                  values={settingTypeValues}
                  options={settingTypeOptions}
                  onChange={(vals) =>
                    settingTypeCol?.setFilterValue(
                      vals.length ? vals : undefined,
                    )
                  }
                  searchPlaceholder={t("filters.search")}
                  resetLabel={t("filters.reset")}
                  doneLabel={t("filters.done")}
                  placeholder={t("filters.all")}
                />

                <Button
                  size="sm"
                  variant="ghost-primary"
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
