import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import type { Company } from "@/lib/types";
import ActionsCell from "../../_components/action-cell";
import { useMerchantCompanyStore } from "@/store/merchant/merchant-company-store";
import { Badge } from "@/components/ui/badge";

export type MerchantCompanyRow = Company;

export default function useMerchantCompanyTableColumn({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Merchant.CompanyInformationManagement");
  const router = useRouter();
  const searchParams = useSearchParams();

  const deleteCompany = useMerchantCompanyStore((s) => s.deleteCompany);

  const onOpenDetail = (item: MerchantCompanyRow) => {
    console.log(item);
    router.push(`/merchant/company/${item.id}`);
  };

  const onOpenEdit = (item: MerchantCompanyRow) => {
    router.push(`/merchant/company/edit/${item.id}`);
  };

  const onDelete = (item: MerchantCompanyRow) => {
    deleteCompany(item.id);
  };

  const column: ColumnDef<MerchantCompanyRow>[] = [
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell<MerchantCompanyRow>
          item={row.original}
          onOpenDetail={onOpenDetail}
          onOpenEdit={onOpenEdit}
          onDelete={onDelete}
          t={t}
        />
      ),
    },
    {
      accessorKey: "id",
      header: t("columns.id"),
      cell: ({ row }) => (
        <Button
          variant="ghost"
          className="h-8 px-2 font-medium"
          onClick={() => addTab(String(row.getValue("id") ?? ""))}
        >
          {String(row.getValue("id") ?? "")}
        </Button>
      ),
    },
    {
      accessorKey: "name",
      header: t("columns.name"),
      cell: ({ row }) => <div>{String(row.getValue("name") ?? "")}</div>,
    },
    {
      accessorKey: "address",
      header: t("columns.address"),
      cell: ({ row }) => <div>{String(row.getValue("address") ?? "")}</div>,
    },
    {
      accessorKey: "phoneNumber",
      header: t("columns.phoneNumber"),
      cell: ({ row }) => {
        return (
          <div className="capitalize">
            {String(row.getValue("phoneNumber") ?? "—")}
          </div>
        );
      },
    },
    {
      accessorKey: "invoiceEmail",
      header: t("columns.invoiceEmail"),
      cell: ({ row }) => (
        <div>{String(row.getValue("invoiceEmail") ?? "")}</div>
      ),
    },
    {
      accessorKey: "websiteUrl",
      header: t("columns.websiteUrl"),
      cell: ({ row }) => <div>{String(row.getValue("websiteUrl") ?? "")}</div>,
    },
    {
      accessorKey: "invoicePrefix",
      header: t("columns.invoicePrefix"),
      cell: ({ row }) => (
        <div>{String(row.getValue("invoicePrefix") ?? "")}</div>
      ),
    },
    {
      accessorKey: "enableCreditPayment",
      header: t("columns.enableCreditPayment"),
      cell: ({ row }) => (
        <Badge
          className={
            row.getValue("enableCreditPayment") ? "bg-green-500" : "bg-red-500"
          }
        >
          {String(row.getValue("enableCreditPayment") ?? "")}
        </Badge>
      ),
    },
  ];

  return { column };
}
