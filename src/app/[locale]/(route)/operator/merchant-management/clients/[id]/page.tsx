"use client";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import ClientDetail from "../_components/client-detail";
import { useParams } from "next/navigation";
import { useBasePath } from "@/hooks/use-base-path";
import { useTranslations } from "next-intl";

export default function ClientDetailPage() {
  const { id } = useParams();
  const t = useTranslations("Operator.Clients");
  const { basePath } = useBasePath();

  return (
    <div className="max-w-5xl space-y-4">
      <PageBreadcrumb
        items={[
          { label: t("title"), href: basePath },
          { label: id as string, active: true },
        ]}
      />
      <ClientDetail clientId={id as string} />
    </div>
  );
}
