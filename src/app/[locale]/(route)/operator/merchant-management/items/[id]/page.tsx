"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useBasePath } from "@/hooks/use-base-path";
import HeaderPage from "@/components/header-page";
import ItemDetail from "../_components/item-detail";
import { PageBreadcrumb } from "@/components/page-breadcrumb";

export default function ItemDetailPage() {
  const t = useTranslations("Operator.Items");
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
    <div className="max-w-5xl space-y-4">
      <PageBreadcrumb items={breadcrumbItems} />
      <ItemDetail itemId={id} />
    </div>
  );
}
