"use client";

import * as React from "react";
import { MoreVertical } from "lucide-react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AppMerchantCard } from "@/store/merchant/merchant-card-store";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

const getCardTypeLabel = (cardBrand: string): string => {
  const normalizedBrand = cardBrand.toUpperCase();
  const brandMap: Record<string, string> = {
    VISA: "基本請求書",
    JCB: "個人事業主",
    MASTERCARD: "基本請求書",
    AMEX: "基本請求書",
  };
  return brandMap[normalizedBrand] || "基本請求書";
};

const formatCardNumber = (last4: string, cardBrand: string): string => {
  const normalizedBrand = cardBrand.toUpperCase();

  // AMEX cards have 15 digits (format: 4-6-5) and start with 34 or 37
  if (normalizedBrand === "AMEX") {
    // Format: 3700 0000 0000 002 (15 digits total)
    return `37000000000${last4 || "0002"}`;
  }

  // JCB cards - use example format: 3600 666633 3344
  if (normalizedBrand === "JCB") {
    // Format: 3600666633XXXX (16 digits)
    return `3600666633${last4 || "3344"}`;
  }

  // VISA: 4111 1111 1111 1111
  if (normalizedBrand === "VISA") {
    return `411111111111${last4 || "1111"}`;
  }

  // MASTERCARD: 5555 4444 3333 1111
  if (normalizedBrand === "MASTERCARD") {
    return `555544443333${last4 || "1111"}`;
  }

  // Default: Other cards have 16 digits (format: 4-4-4-4)
  return `000000000000${last4 || "0000"}`;
};

type CreditCardComponentProps = {
  card: AppMerchantCard;
  index: number;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
};

export function CreditCardComponent({
  card,
  index,
  onDelete,
  onEdit,
}: CreditCardComponentProps) {
  const t = useTranslations("Merchant.MerchantCards");
  const mm = String(card.expiryMonth ?? "").padStart(2, "0");
  const yy = String(card.expiryYear ?? "").slice(-2);
  const expiry = mm && yy ? `${mm}/${yy}` : "12/24";

  const cardNumber = formatCardNumber(
    card.last4 || "0000",
    card.cardBrand || "",
  );
  const cardHolder = "Kento Tanaka"; // This should come from card data or user data
  const cvc = "123"; // Placeholder since we don't store CVC

  return (
    <div className="relative w-full overflow-hidden rounded-lg">
      {/* React Credit Cards Component */}
      <style>
        {`.rccs {
          margin:0 !important;
          width:100% !important;
        }`}
      </style>
      <Cards
        number={cardNumber}
        expiry={expiry}
        cvc={cvc}
        name={cardHolder}
        focused=""
        preview={true}
        locale={{ valid: "VALID THRU" }}
      />

      {/* Menu Button Overlay */}
      <div className="absolute right-4 top-4 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground rounded-full"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(card.id)}>
                {t("actions.edit")}
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(card.id)}
                className="text-destructive"
              >
                {t("actions.delete")}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
