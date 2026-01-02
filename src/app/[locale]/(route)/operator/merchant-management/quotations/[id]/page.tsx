"use client";

import * as React from "react";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import HeaderPage from "@/components/header-page";
import { Button } from "@/components/ui/button";
import { useQuotationStore } from "@/store/quotation-store";
import QuotationDetail from "../_components/quotation-detail";

export default function OperatorQuotationDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const locale = useLocale();
  const t = useTranslations("Operator.Quotations");

  const quotation = useQuotationStore((s) =>
    id ? s.getQuotationById(id) : undefined,
  );

  if (!id) {
    return (
      <HeaderPage title={t("title")}>
        <div className="space-y-4">
          <div className="text-muted-foreground text-sm">
            Missing quotation id.
          </div>
          <Button asChild variant="outline" className="h-9">
            <Link href={`/${locale}/operator/quotations`}>
              {t("buttons.back")}
            </Link>
          </Button>
        </div>
      </HeaderPage>
    );
  }

  if (!quotation) {
    return (
      <HeaderPage title={t("title")}>
        <div className="space-y-4">
          <div className="text-muted-foreground text-sm">
            {t("messages.notFound")}
          </div>
          <Button asChild variant="outline" className="h-9">
            <Link href={`/${locale}/operator/quotations`}>
              {t("buttons.back")}
            </Link>
          </Button>
        </div>
      </HeaderPage>
    );
  }

  return (
    <HeaderPage title={quotation.quotationNumber}>
      <QuotationDetail quotationId={id} />
    </HeaderPage>
  );
}
