import ActionsCell from "../../_components/action-cell";
import { Button } from "@/components/ui/button";
import type { BankAccount } from "@/lib/types";
import { useMerchantBankAccountStore } from "@/store/merchant/merchant-bank-account-store";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useBasePath } from "@/hooks/use-base-path";

export type BankAccountRow = BankAccount;

export default function useBankAccountTableColumn({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Merchant.BankAccounts");
  const router = useRouter();
  const deleteBankAccount = useMerchantBankAccountStore(
    (s) => s.deleteBankAccount,
  );

  const { basePath } = useBasePath();

  const onOpenDetail = (item: BankAccountRow) => {
    router.push(`${basePath}/${item.id}`);
  };

  const onOpenEdit = (item: BankAccountRow) => {
    router.push(`${basePath}/edit/${item.id}`);
  };

  const onDelete = (item: BankAccountRow) => {
    deleteBankAccount(item.id);
  };

  const columns: ColumnDef<BankAccountRow>[] = [
    {
      accessorKey: "bankName",
      header: t("columns.bankName"),
      cell: ({ row }) => (
        <Button
          variant="ghost"
          className="hover:bg-secondary h-8 px-2 font-medium hover:underline"
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
    {
      id: "actions",
      header: t("columns.actions"),
      size: 100,
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell<BankAccountRow>
          item={row.original}
          onOpenDetail={onOpenDetail}
          onOpenEdit={onOpenEdit}
          onDelete={onDelete}
          t={t}
          variant="verbose"
        />
      ),
    },
  ];

  return { columns };
}
