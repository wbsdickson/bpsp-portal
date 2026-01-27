"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Table as TanstackTable,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnOrderState,
  type PaginationState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { ChevronDown, Columns3, GripVertical, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaginationControls } from "./ui/pagination-controls";

function getColumnDefId<TData>(column: ColumnDef<TData>): string {
  if ("id" in column && typeof column.id === "string") return column.id;
  if ("accessorKey" in column && typeof column.accessorKey === "string") {
    return column.accessorKey;
  }
  throw new Error(
    "All columns must have an 'id' or string 'accessorKey' to support column ordering.",
  );
}

function moveItem<T>(items: T[], fromIndex: number, toIndex: number) {
  const next = items.slice();
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

export type DataTableProps<TData> = {
  columns: ColumnDef<TData>[];
  data: TData[];
  filterColumnId?: string;
  filterPlaceholder?: string;
  enableColumnVisibility?: boolean;
  enableColumnReorder?: boolean;
  showToolbar?: boolean;
  showFooter?: boolean;
  toolbarRight?: React.ReactNode;
  renderToolbar?: (table: TanstackTable<TData>) => React.ReactNode;
  initialColumnVisibility?: VisibilityState;
  onReload?: () => Promise<void> | void;
  onPageChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
  pagination?: {
    pageIndex: number;
    pageSize: number;
  };
  totalCount?: number;
};

export function DataTable<TData>({
  columns,
  data,
  filterColumnId,
  filterPlaceholder,
  enableColumnVisibility = true,
  enableColumnReorder = true,
  showToolbar = true,
  showFooter = true,
  toolbarRight,
  renderToolbar,
  initialColumnVisibility,
  onReload,
  onPageChange,
  pagination,
  totalCount,
}: DataTableProps<TData>) {
  const t = useTranslations("CommonComponent.DataTable");

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(() => initialColumnVisibility ?? {});
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>(() =>
    columns.map(getColumnDefId),
  );
  const [rowSelection, setRowSelection] = React.useState({});
  const [draggingColumnId, setDraggingColumnId] = React.useState<string | null>(
    null,
  );
  const [internalPagination, setInternalPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });

  const isControlled = pagination !== undefined;
  const currentPagination: PaginationState = isControlled
    ? { pageIndex: pagination.pageIndex, pageSize: pagination.pageSize }
    : internalPagination;

  const handlePaginationChange = React.useCallback(
    (
      updater: PaginationState | ((old: PaginationState) => PaginationState),
    ) => {
      const newPagination =
        typeof updater === "function" ? updater(currentPagination) : updater;

      if (isControlled && onPageChange) {
        onPageChange({
          pageIndex: newPagination.pageIndex,
          pageSize: newPagination.pageSize,
        });
      } else {
        setInternalPagination(newPagination);
      }
    },
    [currentPagination, isControlled, onPageChange],
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: isControlled ? undefined : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onRowSelectionChange: setRowSelection,
    manualPagination: isControlled,
    pageCount:
      isControlled && totalCount
        ? Math.ceil(totalCount / currentPagination.pageSize)
        : undefined,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      columnOrder,
      rowSelection,
      pagination: currentPagination,
    },
  });

  const totalItems = isControlled
    ? (totalCount ?? data.length)
    : table.getFilteredRowModel().rows.length;
  const totalPages =
    isControlled && totalCount
      ? Math.ceil(totalCount / currentPagination.pageSize)
      : Math.max(1, table.getPageCount());
  const currentPage = currentPagination.pageIndex + 1;
  const itemsPerPage = currentPagination.pageSize;

  const fixedColumns = table.getAllLeafColumns().filter((c) => !c.getCanHide());
  const activeColumns = table.getAllLeafColumns().filter((c) => c.getCanHide());

  const setActiveColumnOrder = (sourceId: string, targetId: string) => {
    if (!enableColumnReorder) return;
    if (sourceId === targetId) return;

    table.setColumnOrder((prev) => {
      const leaf = table.getAllLeafColumns();
      const canHideById = new Map(leaf.map((c) => [c.id, c.getCanHide()]));

      const fixedIds = prev.filter((id) => !canHideById.get(id));
      const activeIds = prev.filter((id) => canHideById.get(id));

      const fromIndex = activeIds.indexOf(sourceId);
      const toIndex = activeIds.indexOf(targetId);
      if (fromIndex === -1 || toIndex === -1) return prev;

      const nextActive = moveItem(activeIds, fromIndex, toIndex);
      return [...fixedIds, ...nextActive];
    });
  };

  const filterColumn = filterColumnId
    ? table.getColumn(filterColumnId)
    : undefined;

  const [isReloading, setIsReloading] = React.useState(false);

  const handleReload = async () => {
    // if (!onReload) return;
    setIsReloading(true);
    try {
      await onReload?.();
    } finally {
      // Add a small delay for better visual feedback if the reload is too fast
      setTimeout(() => setIsReloading(false), 500);
    }
  };

  return (
    <div className="w-full">
      {showToolbar ? (
        <div className="flex items-center justify-between gap-2 py-4">
          {renderToolbar ? <>{renderToolbar(table)}</> : null}

          <div className="flex flex-wrap items-center gap-2">
            {toolbarRight ?? (
              <>
                {/* <Button variant="outline" size="sm" className="h-9 gap-2">
                  <Download className="h-4 w-4" /> Export
                </Button>
                <Button variant="outline" size="sm" className="h-9 gap-2">
                  <BarChart3 className="h-4 w-4" /> Analyze
                </Button> */}
                {enableColumnVisibility ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="ml-auto">
                        <Columns3 className="h-4 w-4" />
                        {t("editColumns")} <ChevronDown />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel className="text-muted-foreground">
                        {t("fixedColumns")}
                      </DropdownMenuLabel>
                      {fixedColumns.map((column) => (
                        <DropdownMenuItem
                          key={column.id}
                          className="capitalize"
                          onSelect={(e) => e.preventDefault()}
                        >
                          {t(column.id)}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="text-muted-foreground">
                        {t("activeColumns")}
                      </DropdownMenuLabel>
                      {activeColumns.map((column) => (
                        <DropdownMenuItem
                          key={column.id}
                          className="capitalize"
                          onDragOver={(e) => {
                            if (!enableColumnReorder) return;
                            if (
                              !draggingColumnId ||
                              draggingColumnId === column.id
                            )
                              return;
                            e.preventDefault();
                          }}
                          onDrop={() => {
                            if (!enableColumnReorder) return;
                            if (!draggingColumnId) return;
                            setActiveColumnOrder(draggingColumnId, column.id);
                            setDraggingColumnId(null);
                          }}
                          onSelect={(e) => e.preventDefault()}
                        >
                          <div className="flex w-full items-center gap-2">
                            <Checkbox
                              checked={column.getIsVisible()}
                              onCheckedChange={(value) =>
                                column.toggleVisibility(Boolean(value))
                              }
                              aria-label={`Toggle ${column.id} column`}
                            />
                            <div className="flex-1">
                              {column.columnDef.header as any}
                            </div>
                            {enableColumnReorder ? (
                              <div
                                className="text-muted-foreground cursor-grab"
                                aria-hidden
                                draggable
                                onDragStart={() =>
                                  setDraggingColumnId(column.id)
                                }
                                onDragEnd={() => setDraggingColumnId(null)}
                              >
                                <GripVertical className="h-4 w-4" />
                              </div>
                            ) : null}
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : null}
                <Button
                  variant="secondary"
                  size="icon-sm"
                  onClick={handleReload}
                  disabled={isReloading}
                >
                  <RotateCcw
                    className={cn(
                      "size-4",
                      isReloading && "direction-[reverse] animate-spin",
                    )}
                  />
                </Button>
              </>
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="dark:bg-background bg-blue-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-muted/50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t("noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {showFooter ? (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          onPageChange={(page) => {
            table.setPageIndex(Math.max(0, page - 1));
          }}
          onItemsPerPageChange={(value) => {
            if (isControlled && onPageChange) {
              onPageChange({ pageIndex: 0, pageSize: value });
            } else {
              table.setPageSize(value);
              table.setPageIndex(0);
            }
          }}
        />
      ) : null}
    </div>
  );
}
