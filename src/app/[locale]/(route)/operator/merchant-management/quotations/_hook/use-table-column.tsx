import ActionsCell from "../../_components/action-cell";
import { Button } from "@/components/ui/button";
import type { Quotation } from "@/lib/types";
import { useQuotationStore } from "@/store/quotation-store";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useBasePath } from "@/hooks/use-base-path";

export type QuotationRow = Quotation & {
  clientName: string;
  issueDateLabel: string;
};

export default function useQuotationTableColumn({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Operator.Quotations");
  const router = useRouter();
  const deleteQuotation = useQuotationStore((s) => s.deleteQuotation);
  const { basePath } = useBasePath();

  const onOpenDetail = (item: QuotationRow) => {
    router.push(`${basePath}/${item.id}`);
  };

  const onOpenEdit = (item: QuotationRow) => {
    router.push(`${basePath}/edit/${item.id}`);
  };

  const onDelete = (item: QuotationRow) => {
    deleteQuotation(item.id);
  };

  const column: ColumnDef<QuotationRow>[] = [
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell<QuotationRow>
          item={row.original}
          onOpenDetail={onOpenDetail}
          onOpenEdit={onOpenEdit}
          onDelete={onDelete}
          t={t}
        />
      ),
    },
    {
      accessorKey: "quotationNumber",
      header: t("columns.number"),
      cell: ({ row }) => (
        <Button
          type="button"
          variant="ghost"
          className="h-8 px-2 font-medium"
          onClick={() => addTab(row.original.id)}
        >
          {String(row.getValue("quotationNumber") ?? "")}
        </Button>
      ),
    },
    {
      accessorKey: "clientName",
      header: t("columns.client"),
      cell: ({ row }) => <div>{String(row.getValue("clientName") ?? "")}</div>,
    },
    {
      accessorKey: "amount",
      header: t("columns.amount"),
      cell: ({ row }) => {
        const v = row.getValue("amount");
        const num = typeof v === "number" ? v : Number(v ?? 0);
        return <div>{num.toLocaleString()}</div>;
      },
    },
    {
      accessorKey: "issueDateLabel",
      header: t("columns.quotationDate"),
      cell: ({ row }) => (
        <div>{String(row.getValue("issueDateLabel") ?? "")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: t("columns.status"),
      cell: ({ row }) => (
        <div className="capitalize">{String(row.getValue("status") ?? "")}</div>
      ),
      filterFn: (row, id, value) => {
        const cellValue = String(row.getValue(id) ?? "");
        if (Array.isArray(value)) return value.includes(cellValue);
        return cellValue === String(value ?? "");
      },
    },
  ];

  return { column };
}
