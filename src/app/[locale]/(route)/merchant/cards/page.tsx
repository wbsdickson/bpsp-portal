"use client";

import HeaderPage from "@/components/header-page";
import { useTranslations } from "next-intl";

import MerchantCardTable from "./_components/merchant-card-table";

export default function MerchantCardsPage() {
  const t = useTranslations("Merchant.MerchantCards");

  return (
    <HeaderPage title={t("title")}>
      <div className="rounded-lg bg-white p-4">
        <MerchantCardTable />
      </div>
    </HeaderPage>
  );
}
