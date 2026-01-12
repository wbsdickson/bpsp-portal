"use client";

import { useBasePath } from "@/hooks/use-base-path";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import MidDetail from "../_components/mid-detail";

export default function MidDetailPage() {
  const t = useTranslations("Operator.MID");
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { basePath } = useBasePath();

  const breadcrumbItems = [
    { label: t("title"), href: basePath },
    { label: id, active: true },
  ];

  return (
    <div className="max-w-5xl space-y-4">
      <PageBreadcrumb items={breadcrumbItems} />
      {id && <MidDetail id={id} />}
    </div>
  );
}
