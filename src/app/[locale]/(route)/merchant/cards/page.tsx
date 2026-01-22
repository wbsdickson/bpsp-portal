"use client";

import HeaderPage from "@/components/header-page";
import { useTranslations } from "next-intl";
import { CardGrid } from "./_components/card-grid";
import { PayerNameForm } from "./_components/payer-name-form";
import { Card } from "@/components/ui/card";

export default function MerchantCardsPage() {
  const t = useTranslations("Merchant.MerchantCards");

  const handleAddCard = () => {
    // TODO: Implement add card modal/dialog
    console.log("Add card clicked");
  };

  const handleEditCard = (id: string) => {
    // TODO: Implement edit card modal/dialog
    console.log("Edit card:", id);
  };

  return (
    <HeaderPage title={t("title")}>
      <div className="space-y-8">
        <CardGrid onAddCard={handleAddCard} onEditCard={handleEditCard} />
        <PayerNameForm />
      </div>
    </HeaderPage>
  );
}
