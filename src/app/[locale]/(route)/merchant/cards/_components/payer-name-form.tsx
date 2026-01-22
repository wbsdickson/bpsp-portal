"use client";

import * as React from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

export function PayerNameForm() {
  const t = useTranslations("Merchant.MerchantCards");
  const [payerName, setPayerName] = React.useState("タナカ ケント");
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Implement actual save logic
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
    toast.success(t("payerName.saveSuccess"));
  };

  return (
    <Card>
      <div>
        <h2 className="text-2xl font-bold">{t("payerName.title")}</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          {t("payerName.subtitle")}
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-muted-foreground text-sm">
          {t("payerName.instructions")}
        </p>
        <Input
          value={payerName}
          onChange={(e) => setPayerName(e.target.value)}
          placeholder={t("payerName.placeholder")}
          maxLength={30}
          className="h-12"
        />
        <Button onClick={handleSave} disabled={isSaving} className="mt-6 gap-2">
          <Save className="h-4 w-4" />
          {t("buttons.save")}
        </Button>
      </div>
    </Card>
  );
}
