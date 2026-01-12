"use client";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import HeaderPage from "@/components/header-page";
import MerchantMemberDetail from "../_components/merchant-member-detail";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import { useBasePath } from "@/hooks/use-base-path";

export default function MerchantMemberDetailPage() {
  const t = useTranslations("Operator.MerchantMembers");
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
          {t("messages.userNotFound")}
        </div>
      </HeaderPage>
    );
  }

  return (
    <div className="max-w-5xl space-y-4">
      <PageBreadcrumb items={breadcrumbItems} />
      <MerchantMemberDetail userId={id} />
    </div>
  );
}
