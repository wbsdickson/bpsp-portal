import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { useRouter } from "next/navigation";
import { useInvoiceAutoIssuanceStore } from "@/store/merchant/invoice-auto-issuance-store";
import { useBasePath } from "@/hooks/use-base-path";
import { Badge } from "@/components/ui/badge";
import ActionsCell from "../../_components/action-cell";

function ScheduleNameCell({
  id,
  scheduleName,
  addTab,
}: {
  id: string;
  scheduleName: string;
  addTab: () => void;
}) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      onClick={addTab}
      className="hover:bg-primary/10 block h-full text-left"
    >
      {scheduleName}
    </Button>
  );
}

export type AutoIssuanceRow = {
  id: string;
  scheduleName: string;
  targetClient: string;
  issuanceFrequency: string;
  nextIssuanceDate: string;
  enabled: boolean;
  enabledStatus: string;
  createdAt: string;
};

export default function useInvoiceAutoIssuanceTableColumn({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Merchant.InvoiceAutoIssuance");
  const { deleteAutoIssuance } = useInvoiceAutoIssuanceStore();

  const router = useRouter();

  const { basePath } = useBasePath();

  const onOpenDetail = (item: AutoIssuanceRow) => {
    router.push(`${basePath}/${item.id}`);
  };
  const onOpenEdit = (item: AutoIssuanceRow) => {
    router.push(`${basePath}/edit/${item.id}`);
  };

  const onDelete = (item: AutoIssuanceRow) => {
    deleteAutoIssuance(item.id);
  };

  const column: ColumnDef<AutoIssuanceRow>[] = [
    {
      accessorKey: "scheduleName",
      header: t("scheduleName"),
      cell: ({ row }) => (
        <ScheduleNameCell
          id={row.original.id}
          scheduleName={String(row.getValue("scheduleName") ?? "")}
          addTab={() => addTab(row.original.id)}
        />
      ),
    },
    {
      accessorKey: "targetClient",
      header: t("targetClient"),
      cell: ({ row }) => <div>{row.getValue("targetClient")}</div>,
    },
    {
      accessorKey: "issuanceFrequency",
      header: t("issuanceFrequency"),
      cell: ({ row }) => <div>{row.getValue("issuanceFrequency")}</div>,
    },
    {
      accessorKey: "nextIssuanceDate",
      header: t("nextIssuanceDate"),
      cell: ({ row }) => <div>{row.getValue("nextIssuanceDate")}</div>,
    },
    {
      id: "enabledStatus",
      accessorKey: "enabledStatus",
      header: t("enabledStatus"),
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
        const autoIssuance = row.original;
        return (
          <div className="flex items-center gap-3">
            {autoIssuance.enabled ? (
              <Badge variant="outline-success">{t("enabled")}</Badge>
            ) : (
              <Badge variant="outline-warning">{t("disabled")}</Badge>
            )}
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
        <ActionsCell<AutoIssuanceRow>
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
