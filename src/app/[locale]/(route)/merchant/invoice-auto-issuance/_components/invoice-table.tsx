"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { FilterChipPopover } from "@/components/filter-chip-popover";
import { FilterChipMultiSelectPopover } from "@/components/filter-chip-multiselect-popover";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus, X } from "lucide-react";
import { useLocale } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/lib/store";
import { useTranslations } from "next-intl";
import useInvoiceAutoIssuanceTableColumn from "../_hooks/use-table-column";
import { useInvoiceAutoIssuanceStore } from "@/store/merchant/invoice-auto-issuance-store";
import { useAutoIssuancesApi } from "../_hooks/use-auto-issuances-api";
import { useQueryClient } from "@tanstack/react-query";
import { autoIssuanceKeys } from "../_hooks/query-keys";

function ActionsCell({ id }: { id: string }) {
  const locale = useLocale();
  const deleteAutoIssuance = useInvoiceAutoIssuanceStore(
    (s) => s.deleteAutoIssuance,
  );
  const queryClient = useQueryClient();
  const t = useTranslations("Merchant.InvoiceAutoIssuance");

  const handleDelete = async () => {
    const confirmed = window.confirm(t("deleteConfirm"));
    if (!confirmed) return;

    try {
      await deleteAutoIssuance(id);
      queryClient.invalidateQueries({ queryKey: autoIssuanceKeys.lists() });
    } catch (error) {
      console.error("Failed to delete auto issuance:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only"> {t("openMenu")}</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/${locale}/merchant/invoice-auto-issuance/edit/${id}`}>
            {t("editAutoIssuance")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleDelete}>
          {t("deleteAutoIssuance")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type AutoIssuanceRow = {
  id: string;
  scheduleName: string;
  targetClient: string;
  issuanceFrequency: string;
  nextIssuanceDate: string;
  enabled: boolean;
  enabledStatus: string;
  createdAt: string;
};

export default function InvoiceAutoIssuanceTable({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Merchant.InvoiceAutoIssuance");

  const clients = useAppStore((s) => s.clients);

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [sortBy, setSortBy] = React.useState<
    "scheduleName" | "targetClient" | "nextIssuanceDate" | "createdAt"
  >("createdAt");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");

  const { autoIssuances, isLoading, isFetching, error, pagination } =
    useAutoIssuancesApi({
      page,
      limit: pageSize,
      search: search || undefined,
      sortBy,
      sortOrder,
    });

  const rows = React.useMemo<AutoIssuanceRow[]>(() => {
    return autoIssuances.map((autoIssuance) => {
      const client = clients.find((c) => c.name === autoIssuance.targetClient);
      return {
        id: autoIssuance.id,
        scheduleName: autoIssuance.scheduleName,
        targetClient: autoIssuance.targetClient,
        issuanceFrequency: autoIssuance.issuanceFrequency,
        nextIssuanceDate: autoIssuance.nextIssuanceDate,
        enabled: autoIssuance.enabled,
        enabledStatus: autoIssuance.enabled ? "enabled" : "disabled",
        createdAt: autoIssuance.createdAt || "",
      };
    });
  }, [autoIssuances, clients]);

  const { column } = useInvoiceAutoIssuanceTableColumn({ addTab });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <>
      <DataTable
        columns={column}
        data={rows}
        pagination={{
          pageIndex: page - 1,
          pageSize: pageSize,
        }}
        totalCount={pagination?.total ?? 0}
        onPageChange={({ pageIndex, pageSize: newPageSize }) => {
          setPage(pageIndex + 1);
          setPageSize(newPageSize);
        }}
        renderToolbar={(table) => {
          const scheduleNameCol = table.getColumn("scheduleName");
          const targetClientCol = table.getColumn("targetClient");
          const enabledStatusCol = table.getColumn("enabledStatus");

          const enabledStatusOptions = [
            { value: "enabled", label: t("enabled") },
            { value: "disabled", label: t("disabled") },
          ];

          const rawEnabledStatusValue = enabledStatusCol?.getFilterValue();
          const enabledStatusValues = Array.isArray(rawEnabledStatusValue)
            ? (rawEnabledStatusValue as string[])
            : rawEnabledStatusValue
              ? [String(rawEnabledStatusValue)]
              : [];

          return (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <FilterChipPopover
                  label={t("scheduleName")}
                  value={String(scheduleNameCol?.getFilterValue() ?? "")}
                  onChange={(v) => scheduleNameCol?.setFilterValue(v)}
                />
                <FilterChipPopover
                  label={t("targetClient")}
                  value={String(targetClientCol?.getFilterValue() ?? "")}
                  onChange={(v) => targetClientCol?.setFilterValue(v)}
                />

                <FilterChipMultiSelectPopover
                  label={t("enabledStatus")}
                  values={enabledStatusValues}
                  options={enabledStatusOptions}
                  onChange={(vals) =>
                    enabledStatusCol?.setFilterValue(
                      vals.length ? vals : undefined,
                    )
                  }
                  searchPlaceholder={t("search")}
                  resetLabel="Reset"
                  doneLabel="Done"
                  placeholder="All"
                />

                <Button
                  variant="ghost-primary"
                  size="sm"
                  onClick={() => table.resetColumnFilters()}
                >
                  {t("clearFilters")}
                </Button>
              </div>
            </div>
          );
        }}
      />
    </>
  );
}
