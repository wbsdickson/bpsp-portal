"use client";

import { useRouter, useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { PageBreadcrumb } from "@/components/page-breadcrumb";
import { useQuotationStore } from "@/store/quotation-store";
import QuotationDetail from "../_components/quotation-detail";
import { useBasePath } from "@/hooks/use-base-path";

export default function OperatorQuotationDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const { basePath } = useBasePath();
  const locale = useLocale();
  const t = useTranslations("Operator.Quotations");

  const quotation = useQuotationStore((s) =>
    id ? s.getQuotationById(id) : undefined,
  );

  if (!id || !quotation) {
    // Ideally handle 404 or redirect
    return null;
  }

  return (
    <div className="max-w-5xl space-y-6">
      <PageBreadcrumb
        items={[
          { label: t("title"), href: basePath },
          {
            label: quotation.quotationNumber ?? "",
            href: `${basePath}/${id}`,
          },
        ]}
      />
      <QuotationDetail quotationId={id} />
    </div>
  );
}
