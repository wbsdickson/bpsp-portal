import ActionsCell from "../../_components/action-cell";
import { Button } from "@/components/ui/button";
import type { BankAccount } from "@/lib/types";
import { useBankAccountStore } from "@/store/bank-account-store";
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
  const t = useTranslations("Operator.BankAccounts");
  const router = useRouter();
  const deleteBankAccount = useBankAccountStore((s) => s.deleteBankAccount);

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

  const column: ColumnDef<BankAccountRow>[] = [
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell<BankAccountRow>
          item={row.original}
          onOpenDetail={onOpenDetail}
          onOpenEdit={onOpenEdit}
          onDelete={onDelete}
          t={t}
        />
      ),
    },
    {
      accessorKey: "bankName",
      header: t("columns.bankName"),
      cell: ({ row }) => (
        <Button
          type="button"
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
    {
      accessorKey: "createdAt",
      header: t("columns.registrationDate"),
      cell: ({ row }) => {
        const raw = row.getValue("createdAt");
        const value = typeof raw === "string" ? raw : "";
        if (!value) return <div className="text-muted-foreground">—</div>;
        const dt = new Date(value);
        const label = Number.isNaN(dt.getTime()) ? value : dt.toLocaleString();
        return <div>{label}</div>;
      },
    },
  ];

  return { column };
}
