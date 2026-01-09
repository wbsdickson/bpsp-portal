"use client";

import HeaderPage from "@/components/header-page";
import { useTranslations } from "next-intl";
import CompanyInformationForm from "./company-information-form";

export default function MerchantCompanyInformationPage() {
  const t = useTranslations("Merchant.CompanyInformationManagement");

  return (
    <HeaderPage title={t("title")}>
      <CompanyInformationForm />
    </HeaderPage>
  );
}
