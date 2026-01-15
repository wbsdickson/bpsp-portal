"use client";
import BankAccountDetail from "../_components/bank-account-detail";
import { useParams } from "next/navigation";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import { useBasePath } from "@/hooks/use-base-path";
import { useTranslations } from "next-intl";

export default function BankAccountDetailPage() {
  const { id } = useParams();
  const t = useTranslations("Merchant.BankAccounts");
  const { basePath } = useBasePath();
  const breadcrumbItems = [
    { label: t("title"), href: basePath },
    { label: id as string, active: true },
  ];
  return (
    <div className="max-w-5xl">
      <PageBreadcrumb items={breadcrumbItems} />
      <BankAccountDetail bankAccountId={id as string} />
    </div>
  );
}
