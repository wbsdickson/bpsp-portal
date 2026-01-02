"use client";

import * as React from "react";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import HeaderPage from "@/components/header-page";
import { Button } from "@/components/ui/button";
import { useInvoiceStore } from "@/store/invoice-store";
import InvoiceDetail from "../_components/invoice-detail";

export default function OperatorInvoiceDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const locale = useLocale();
  const t = useTranslations("Operator.Invoice");

  const invoice = useInvoiceStore((s) =>
    id ? s.getInvoiceById(id) : undefined,
  );

  if (!id) {
    return (
      <HeaderPage title={t("invoiceNumber")}>
        <div className="space-y-4">
          <div className="text-muted-foreground text-sm">
            Missing invoice id.
          </div>
          <Button asChild variant="outline" className="h-9">
            <Link href={`/${locale}/operator/invoices`}>
              {t("payInfoBack")}
            </Link>
          </Button>
        </div>
      </HeaderPage>
    );
  }

  if (!invoice) {
    return (
      <HeaderPage title={t("invoiceNumber")}>
        <div className="space-y-4">
          <div className="text-muted-foreground text-sm">
            Invoice not found.
          </div>
          <Button asChild variant="outline" className="h-9">
            <Link href={`/${locale}/operator/invoices`}>
              {t("payInfoBack")}
            </Link>
          </Button>
        </div>
      </HeaderPage>
    );
  }

  return (
    <HeaderPage title={invoice.invoiceNumber}>
      <InvoiceDetail id={id} />
    </HeaderPage>
  );
}
