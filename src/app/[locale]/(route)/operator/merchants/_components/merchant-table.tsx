"use client";

import { DataTable } from "@/components/data-table";
import { FilterChipSelectPopover } from "@/components/filter-chip-select-popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useMemo } from "react";

import useMerchantTableColumn from "../_hook/use-table-column";
import { useMerchantsApi } from "../_hook/use-merchants-api";
import type { MerchantStatus } from "@/types/merchant";

export default function MerchantTable({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Operator.Merchants");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<MerchantStatus | undefined>(undefined);
  const [sortBy, setSortBy] = useState<
    "name" | "createdAt" | "transactionCount"
  >("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { merchants, isLoading, isFetching, error, pagination, refetch } =
    useMerchantsApi({
      page,
      limit: 10,
      status,
      search: search || undefined,
      sortBy,
      sortOrder,
    });

  const { column } = useMerchantTableColumn({
    addTab,
    refetch: async () => {
      await refetch();
    },
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page on search
  };

  const handleStatusChange = (value: string | undefined) => {
    const statusValue = value as MerchantStatus | undefined;
    setStatus(statusValue);
    setPage(1); // Reset to first page on filter change
  };

  const handleSortChange = (
    newSortBy: "name" | "createdAt" | "transactionCount",
  ) => {
    if (sortBy === newSortBy) {
      // Toggle sort order if same column
      const newOrder = sortOrder === "asc" ? "desc" : "asc";
      setSortOrder(newOrder);
    } else {
      // New column, default to ascending
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const statusOptions = useMemo(
    () => [
      { value: "active", label: t("statuses.active") || "Active" },
      { value: "suspended", label: t("statuses.suspended") || "Suspended" },
    ],
    [t],
  );

  if (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to load merchants";
    return (
      <div className="space-y-3 p-4">
        <div className="border-destructive bg-destructive/10 rounded-lg border p-4">
          <p className="text-destructive font-medium">
            {t("errors.loadFailed") || "Failed to load merchants"}
          </p>
          <p className="text-destructive/80 mt-1 text-sm">{errorMessage}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => void refetch()}
          >
            {t("buttons.retry") || "Retry"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4">
      {/* Filters and Search */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Input
            placeholder={t("filters.search") || "Search merchants..."}
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="h-8 w-[200px]"
          />
          <FilterChipSelectPopover
            label={t("filters.status") || "Status"}
            value={status ?? ""}
            options={statusOptions}
            onChange={(v) => handleStatusChange(v || undefined)}
            placeholder={t("filters.allStatuses") || "All Statuses"}
          />
          <Button
            variant="ghost-primary"
            size="sm"
            onClick={() => {
              setSearch("");
              setStatus(undefined);
              setPage(1);
            }}
          >
            {t("buttons.clearFilters") || "Clear Filters"}
          </Button>
        </div>
      </div>

      {/* Table */}
      {isLoading || isFetching ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <>
          <DataTable
            columns={column}
            data={merchants}
            showToolbar={false}
            showFooter={false}
            renderToolbar={() => null}
          />
          {pagination && pagination.totalPages > 0 && (
            <PaginationControls
              currentPage={page}
              totalPages={pagination.totalPages}
              itemsPerPage={pagination.limit}
              totalItems={pagination.total}
              onPageChange={(newPage) => {
                handlePageChange(newPage);
              }}
              onItemsPerPageChange={(newLimit) => {
                handlePageChange(1);
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
