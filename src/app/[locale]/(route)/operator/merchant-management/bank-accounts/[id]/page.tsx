"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useBasePath } from "@/hooks/use-base-path";
import BankAccountDetail from "../_components/bank-account-detail";
import { PageBreadcrumb } from "@/components/page-breadcrumb";

export default function BankAccountDetailPage() {
  const t = useTranslations("Operator.BankAccounts");
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const { basePath } = useBasePath();

  const breadcrumbItems = [
    { label: t("title"), href: basePath },
    { label: id, active: true },
  ];

  if (!id) {
    return (
      <div className="space-y-4">
        <PageBreadcrumb items={breadcrumbItems} />
        <div className="text-muted-foreground text-sm">
          {t("messages.notFound")}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-[1280px] space-y-4">
      <PageBreadcrumb items={breadcrumbItems} />
      <BankAccountDetail bankAccountId={id} />
    </div>
  );
}
