import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { useRouter } from "next/navigation";
import { useMerchantFeeStore } from "@/store/merchant-fee-store";
import { useBasePath } from "@/hooks/use-base-path";
import { formattedAmount, getCurrencySymbol } from "@/lib/finance-utils";
import { Badge } from "@/components/ui/badge";
import ActionsCell from "../../_components/action-cell";

function InvoiceNumberCell({
  id,
  invoiceNumber,
  addTab,
}: {
  id: string;
  invoiceNumber: string;
  addTab: () => void;
}) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      onClick={addTab}
      className="hover:bg-primary/10 block h-full text-left"
    >
      {invoiceNumber}
    </Button>
  );
}

export type InvoiceRow = {
  id: string;
  total: number;
  currency: string;
  status:
    | "draft"
    | "pending"
    | "approved"
    | "paid"
    | "rejected"
    | "void"
    | "past_due"
    | "open";
  frequency?: string;
  invoiceNumber: string;
  merchantName: string;
  customerName: string;
  customerEmail: string;
  issueDate: string;
  created: string;
  invoiceDate: string;
  dueDate: string;
};

export default function useMerchantInvoiceTableColumn({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Merchant.InvoiceManagement");
  const { deleteFee } = useMerchantFeeStore();

  const router = useRouter();

  const { basePath } = useBasePath();

  const onOpenDetail = (item: InvoiceRow) => {
    router.push(`${basePath}/${item.id}`);
  };
  const onOpenEdit = (item: InvoiceRow) => {
    router.push(`${basePath}/edit/${item.id}`);
  };

  const onDelete = (item: InvoiceRow) => {
    deleteFee(item.id);
  };

  const column: ColumnDef<InvoiceRow>[] = [
    {
      accessorKey: "invoiceNumber",
      header: t("invoiceNumber"),
      cell: ({ row }) => (
        <InvoiceNumberCell
          id={row.original.id}
          invoiceNumber={String(row.getValue("invoiceNumber") ?? "")}
          addTab={() => addTab(row.original.id)}
        />
      ),
    },
    {
      accessorKey: "invoiceDate",
      header: t("invoiceDate"),
      cell: ({ row }) => <div>{row.getValue("invoiceDate")}</div>,
    },
    {
      accessorKey: "dueDate",
      header: t("dueDate"),
      cell: ({ row }) => <div>{row.getValue("dueDate")}</div>,
    },

    {
      id: "status",
      accessorKey: "status",
      header: t("status"),
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const rowValue = row.getValue(columnId);

        if (Array.isArray(filterValue)) {
          if (filterValue.length === 0) return true;
          return filterValue.includes(String(rowValue));
        }

        return String(rowValue) === String(filterValue);
      },
      cell: ({ row }) => {
        const inv = row.original;
        return (
          <div className="flex items-center gap-3">
            {inv.status === "draft" && (
              <Badge variant="outline-info">{t("statusDraft")}</Badge>
            )}

            {inv.status === "pending" && (
              <Badge variant="outline-warning">{t("statusPending")}</Badge>
            )}

            {inv.status === "approved" && (
              <Badge variant="outline-success">{t("statusApproved")}</Badge>
            )}

            {inv.status === "rejected" && (
              <Badge variant="outline-destructive">{t("statusRejected")}</Badge>
            )}

            {inv.status === "void" && (
              <Badge variant="outline-info">{t("statusVoid")}</Badge>
            )}

            {inv.status === "paid" && (
              <Badge variant="outline-success">{t("statusPaid")}</Badge>
            )}
            {inv.status === "past_due" && (
              <Badge variant="outline-warning">{t("statusPastDue")}</Badge>
            )}
            {inv.status === "open" && (
              <Badge variant="outline-info">{t("statusOpen")}</Badge>
            )}
          </div>
        );
      },
    },
    {
      id: "amount",
      header: t("totalAmount"),
      cell: ({ row }) => {
        const inv = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="font-medium">
              {`${getCurrencySymbol(inv.currency)} ${formattedAmount(
                inv.total,
                inv.currency,
              )}`}
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: t("actions.label"),
      size: 100,
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell<InvoiceRow>
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

  return { column };
}
