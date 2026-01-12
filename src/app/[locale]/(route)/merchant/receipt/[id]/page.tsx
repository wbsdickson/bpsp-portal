"use client";

import { PageBreadcrumb } from "@/components/page-breadcrumb";
import ReceiptDetail from "../_components/receipt-detail";
import { useParams } from "next/navigation";
import { useBasePath } from "@/hooks/use-base-path";
import { useTranslations } from "next-intl";

export default function ReceiptDetailPage() {
  const t = useTranslations("Merchant.Receipt");
  const { id } = useParams<{ id: string }>();
  const { basePath } = useBasePath();
  const breadcrumbItems = [
    { label: t("title"), href: basePath },
    { label: id, active: true },
  ];
  return (
    <div className="max-w-5xl space-y-4">
      <PageBreadcrumb items={breadcrumbItems} />
      <ReceiptDetail id={id} />
    </div>
  );
}
