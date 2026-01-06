"use client";

import { useBasePath } from "@/hooks/use-base-path";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import MidFeeDetail from "../_components/mid-fee-detail";

export default function MidFeeDetailPage() {
  const t = useTranslations("Operator.MIDFee");
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { basePath } = useBasePath();

  const breadcrumbItems = [
    { label: t("title"), href: basePath },
    { label: id, active: true },
  ];

  return (
    <div className="mx-auto w-[1280px] space-y-4">
      <PageBreadcrumb items={breadcrumbItems} />
      {id && <MidFeeDetail feeId={id} />}
    </div>
  );
}
