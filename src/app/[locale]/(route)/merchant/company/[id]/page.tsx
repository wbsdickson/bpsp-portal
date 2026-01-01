"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import HeaderPage from "@/components/header-page";
import { Button } from "@/components/ui/button";
import MerchantCompanyDetail from "../_components/company-detail";

export default function MerchantCompanyDetailPage() {
  const t = useTranslations("Merchant.CompanyInformationManagement");
  const params = useParams<{ id: string }>();
  const companyId = params?.id;
  const locale = useLocale();

  if (!companyId) {
    return (
      <HeaderPage title={t("detailTitle")}>
        <div className="space-y-4">
          <div className="text-muted-foreground text-sm">
            Company not found.
          </div>
          <Button asChild variant="outline" className="h-9">
            <Link href={`/${locale}/merchant/company`}>Back</Link>
          </Button>
        </div>
      </HeaderPage>
    );
  }

  return (
    <HeaderPage title={t("detailTitle")}>
      <MerchantCompanyDetail companyId={companyId} />
    </HeaderPage>
  );
}
