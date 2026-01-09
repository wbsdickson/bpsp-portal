"use client";

import HeaderPage from "@/components/header-page";
import { useTranslations } from "next-intl";
import AccountInformationForm from "./account-information-form";

export default function AccountInformationPage() {
  const t = useTranslations("Merchant.AccountInformationManagement");

  return (
    <HeaderPage title={t("title")}>
      <div className="p-6">
        <AccountInformationForm />
      </div>
    </HeaderPage>
  );
}
