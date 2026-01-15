"use client";
import ClientDetail from "../_components/client-detail";
import { useParams } from "next/navigation";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import { useBasePath } from "@/hooks/use-base-path";
import { useTranslations } from "next-intl";

export default function ClientDetailPage() {
  const { id } = useParams();
  const t = useTranslations("Merchant.Clients");
  const { basePath } = useBasePath();
  const breadcrumbItems = [
    { label: t("title"), href: basePath },
    { label: id as string, active: true },
  ];
  return (
    <div className="max-w-5xl">
      <PageBreadcrumb items={breadcrumbItems} />
      <ClientDetail clientId={id as string} />
    </div>
  );
}
