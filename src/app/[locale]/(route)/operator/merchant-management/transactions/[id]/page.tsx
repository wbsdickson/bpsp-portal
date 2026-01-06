"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useBasePath } from "@/hooks/use-base-path";
import HeaderPage from "@/components/header-page";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import TransactionDetail from "../_components/transaction-detail";

export default function OperatorTransactionDetailPage() {
  const t = useTranslations("Operator.Transactions");
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const { basePath } = useBasePath();

  const breadcrumbItems = [
    { label: t("title"), href: basePath },
    { label: id, active: true },
  ];

  if (!id) {
    return (
      <HeaderPage title={t("title")}>
        <div className="text-muted-foreground text-sm">
          {t("messages.notFound")}
        </div>
      </HeaderPage>
    );
  }

  return (
    <div className="mx-auto w-[1280px] space-y-4">
      <PageBreadcrumb items={breadcrumbItems} />
      <TransactionDetail id={id} />
    </div>
  );
}
