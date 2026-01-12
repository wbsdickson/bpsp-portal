"use client";

import { useTranslations } from "next-intl";
import ReceivedPayableInvoiceDetail from "../_components/received-payable-invoice-detail";
import { useParams } from "next/navigation";
import { useBasePath } from "@/hooks/use-base-path";
import { PageBreadcrumb } from "@/components/page-breadcrumb";

export default function ReceivedPayableInvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations("Merchant.ReceivedPayableInvoiceAutoIssuance");
  const { basePath } = useBasePath();
  const breadcrumbItems = [
    { label: t("title"), href: basePath },
    { label: id, active: true },
  ];
  return (
    <div className="max-w-5xl">
      <PageBreadcrumb items={breadcrumbItems} />
      <ReceivedPayableInvoiceDetail id={id} />
    </div>
  );
}
