import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import type { AppMerchantFee } from "@/types/merchant-fee";
import { useRouter } from "next/navigation";
import { useMerchantFeeStore } from "@/store/merchant-fee-store";
import { useBasePath } from "@/hooks/use-base-path";
import { formattedAmount, getCurrencySymbol } from "@/lib/finance-utils";
import { Badge } from "@/components/ui/badge";
import ActionsCell from "@/components/action-cell";
import { useModalStore } from "@/store/modal-store";

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
  status: "open" | "draft" | "past_due" | "paid";
  frequency?: string;
  invoiceNumber: string;
  merchantName: string;
  customerName: string;
  customerEmail: string;
  issueDate: string;
  created: string;
};

export default function useMerchantInvoiceTableColumn({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Operator.Invoice");
  const { deleteFee } = useMerchantFeeStore();
  const { onOpen } = useModalStore();

  const router = useRouter();

  const { basePath } = useBasePath();

  const onOpenDetail = (item: InvoiceRow) => {
    router.push(`${basePath}/${item.id}`);
  };
  const onOpenEdit = (item: InvoiceRow) => {
    onOpen("edit-invoice", { invoiceId: item.id });
  };

  const onDelete = (item: InvoiceRow) => {
    deleteFee(item.id);
  };

  const column: ColumnDef<InvoiceRow>[] = [
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell<InvoiceRow>
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
              variant: "destructive",
              onPress: (item) => onDelete(item),
            },
          ]}
          t={t}
        />
      ),
    },
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
      accessorKey: "merchantName",
      header: t("merchant"),
      cell: ({ row }) => <div>{row.getValue("merchantName")}</div>,
    },
    {
      accessorKey: "customerName",
      header: t("client"),
      cell: ({ row }) => <div>{row.getValue("customerName")}</div>,
    },
    {
      id: "amount",
      header: t("amount"),
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
      accessorKey: "issueDate",
      header: t("issueDate"),
      cell: ({ row }) => <div>{row.getValue("issueDate")}</div>,
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
            {inv.status === "open" && (
              <Badge
                variant="secondary"
                className="bg-indigo-50 text-indigo-700"
              >
                {t("statusOpen")}
              </Badge>
            )}
            {inv.status === "draft" && (
              <Badge variant="secondary">{t("statusDraft")}</Badge>
            )}
            {inv.status === "past_due" && (
              <Badge variant="secondary" className="bg-amber-50 text-amber-700">
                {t("statusPastDue")}
              </Badge>
            )}
            {inv.status === "paid" && (
              <Badge
                variant="secondary"
                className="bg-emerald-50 text-emerald-700"
              >
                {t("statusPaid")}
              </Badge>
            )}
          </div>
        );
      },
    },
  ];

  return { column };
}
