"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { useBasePath } from "@/hooks/use-base-path";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import PayoutTransactionDetail from "../_components/payout-transaction-detail";

export default function OperatorPayoutTransactionDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { basePath } = useBasePath();

  const t = useTranslations("Operator.PayoutTransactions");

  const breadcrumbItems = [
    { label: t("title"), href: basePath },
    { label: id, active: true },
  ];

  return (
    <div className="max-w-5xl space-y-4">
      <PageBreadcrumb items={breadcrumbItems} />
      <PayoutTransactionDetail id={id} />
    </div>
  );
}
