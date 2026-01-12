"use client";

import * as React from "react";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import HeaderPage from "@/components/header-page";
import { Button } from "@/components/ui/button";
import { useInvoiceStore } from "@/store/invoice-store";
import InvoiceDetail from "../_components/invoice-detail";
import { useBasePath } from "@/hooks/use-base-path";
import { PageBreadcrumb } from "@/components/page-breadcrumb";

export default function InvoiceAutoIssuanceDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const locale = useLocale();
  const t = useTranslations("Merchant.InvoiceAutoIssuance");
  const { basePath } = useBasePath();

  const breadcrumbItems = [
    { label: t("title"), href: basePath },
    { label: id, active: true },
  ];

  if (!id) {
    return (
      <HeaderPage title={t("invoiceNumber")}>
        <div className="space-y-4">
          <div className="text-muted-foreground text-sm">
            Missing invoice id.
          </div>
          <Button asChild variant="outline" className="h-9">
            <Link href={`/${locale}/merchant/invoice-auto-issuance`}>
              {t("payInfoBack")}
            </Link>
          </Button>
        </div>
      </HeaderPage>
    );
  }

  return (
    <div className="max-w-5xl space-y-4">
      <PageBreadcrumb items={breadcrumbItems} />
      <InvoiceDetail id={id} />
    </div>
  );
}
