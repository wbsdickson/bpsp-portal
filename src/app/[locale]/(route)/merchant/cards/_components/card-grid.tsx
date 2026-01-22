"use client";

import * as React from "react";
import { CreditCard as CreditCardIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMerchantCardStore } from "@/store/merchant/merchant-card-store";
import { useTranslations } from "next-intl";
import { CreditCardComponent } from "./credit-card";
import type { AppMerchantCard } from "@/store/merchant/merchant-card-store";
import { Card } from "@/components/ui/card";

type CardGridProps = {
  onAddCard?: () => void;
  onEditCard?: (id: string) => void;
  onDeleteCard?: (id: string) => void;
};

export function CardGrid({
  onAddCard,
  onEditCard,
  onDeleteCard,
}: CardGridProps) {
  const t = useTranslations("Merchant.MerchantCards");
  const cards = useMerchantCardStore((s) => s.cards);
  const deleteCard = useMerchantCardStore((s) => s.deleteCard);

  const activeCards = React.useMemo(
    () => cards.filter((c) => !c.deletedAt),
    [cards],
  );

  const handleDelete = (id: string) => {
    deleteCard(id);
    onDeleteCard?.(id);
  };

  return (
    <Card className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("cardInformation.title")}</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {t("cardInformation.subtitle")}
          </p>
        </div>
        <Button onClick={onAddCard} className="gap-2">
          <CreditCardIcon className="h-4 w-4" />
          {t("buttons.addCard")}
        </Button>
      </div>

      {/* Card Grid */}
      {activeCards.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
          <CreditCardIcon className="text-muted-foreground mb-4 h-12 w-12" />
          <p className="text-muted-foreground text-sm">{t("empty.noCards")}</p>
          <Button onClick={onAddCard} className="mt-4" variant="outline">
            {t("buttons.addCard")}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-4 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
          {activeCards.map((card, index) => (
            <div key={card.id} className="min-w-0">
              <CreditCardComponent
                card={card}
                index={index}
                onEdit={onEditCard}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
