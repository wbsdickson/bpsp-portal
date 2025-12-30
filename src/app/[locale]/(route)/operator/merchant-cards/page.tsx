"use client";

import HeaderPage from "@/components/header-page";
import { useTranslations } from "next-intl";

import MerchantCardTable from "./_components/merchant-card-table";

export default function MerchantCardsPage() {
  const t = useTranslations("Operator.MerchantCards");

  return (
    <HeaderPage title={t("title")}>
      <MerchantCardTable />
    </HeaderPage>
  );
}
