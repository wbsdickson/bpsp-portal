"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { DataTable } from "@/components/data-table";
import { FilterChipPopover } from "@/components/filter-chip-popover";
import { Button } from "@/components/ui/button";
import ActionsCell from "@/components/action-cell";
import { useBasePath } from "@/hooks/use-base-path";
import { useMerchantBankAccountStore } from "@/store/merchant/merchant-bank-account-store";
import type { BankAccount } from "@/lib/types";

export type BankAccountRow = BankAccount;

export default function BankAccountTable({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Merchant.BankAccounts");
  const router = useRouter();
  const { basePath } = useBasePath();

  const bankAccounts = useMerchantBankAccountStore((s) => s.bankAccounts);
  const deleteBankAccount = useMerchantBankAccountStore(
    (s) => s.deleteBankAccount,
  );

  const rows = React.useMemo<BankAccountRow[]>(() => {
    return bankAccounts.filter((a) => !a.deletedAt);
  }, [bankAccounts]);

  const onOpenDetail = (item: BankAccountRow) => {
    router.push(`${basePath}/${item.id}`);
  };

  const onOpenEdit = (item: BankAccountRow) => {
    router.push(`${basePath}/edit/${item.id}`);
  };

  const onDelete = (item: BankAccountRow) => {
    deleteBankAccount(item.id);
  };

  const columns = React.useMemo<ColumnDef<BankAccountRow>[]>(
    () => [
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => (
          <ActionsCell<BankAccountRow>
            item={row.original}
            actions={[
              {
                title: t("actions.view"),
                onPress: (item) => onOpenDetail(item),
              },
              {
                title: t("actions.edit"),
                onPress: (item) => onOpenEdit(item),
              },
              {
                title: t("actions.delete"),
                onPress: (item) => onDelete(item),
              },
            ]}
            t={t}
          />
        ),
      },
      {
        accessorKey: "bankName",
        header: t("columns.bankName"),
        cell: ({ row }) => (
          <Button
            variant="ghost"
            className="h-8 px-2 font-medium"
            onClick={() => addTab(row.original.id)}
          >
            {String(row.getValue("bankName") ?? "")}
          </Button>
        ),
      },
      {
        accessorKey: "branchName",
        header: t("columns.branchName"),
        cell: ({ row }) => {
          const v = row.getValue("branchName");
          return v ? (
            <div>{String(v)}</div>
          ) : (
            <div className="text-muted-foreground">—</div>
          );
        },
      },
      {
        accessorKey: "accountType",
        header: t("columns.accountType"),
        cell: ({ row }) => {
          const v = String(row.getValue("accountType") ?? "");
          return <div>{v ? t(`accountTypes.${v}`) : "—"}</div>;
        },
      },
      {
        accessorKey: "accountNumber",
        header: t("columns.accountNumber"),
        cell: ({ row }) => (
          <div>{String(row.getValue("accountNumber") ?? "")}</div>
        ),
      },
      {
        accessorKey: "accountHolder",
        header: t("columns.accountHolder"),
        cell: ({ row }) => (
          <div>{String(row.getValue("accountHolder") ?? "")}</div>
        ),
      },
    ],
    [addTab, deleteBankAccount, router, t],
  );

  return (
    <DataTable
      columns={columns}
      data={rows}
      renderToolbar={(table) => {
        const bankNameCol = table.getColumn("bankName");
        const branchNameCol = table.getColumn("branchName");
        const accountHolderCol = table.getColumn("accountHolder");

        return (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <FilterChipPopover
                label={t("filters.bankName")}
                value={String(bankNameCol?.getFilterValue() ?? "")}
                onChange={(v) => bankNameCol?.setFilterValue(v)}
              />
              <FilterChipPopover
                label={t("filters.branchName")}
                value={String(branchNameCol?.getFilterValue() ?? "")}
                onChange={(v) => branchNameCol?.setFilterValue(v)}
              />
              <FilterChipPopover
                label={t("filters.accountHolder")}
                value={String(accountHolderCol?.getFilterValue() ?? "")}
                onChange={(v) => accountHolderCol?.setFilterValue(v)}
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
