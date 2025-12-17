"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTranslations } from "next-intl";

export function PayInfo({
  onBack,
  onConfirm,
}: {
  onBack?: () => void;
  onConfirm?: () => void;
}) {
  const t = useTranslations("Operator.Invoice");
  const [businessType, setBusinessType] = React.useState<"corp" | "sole">(
    "corp",
  );

  return (
    <div className="bg-background rounded-md border">
      <div className="bg-blue-100 px-6 py-5 dark:bg-blue-950/40">
        <div className="text-center text-base font-semibold text-slate-900 dark:text-slate-100">
          {t("payInfoHeader")}
        </div>
      </div>

      <div className="px-6 py-8">
        <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          {t("payInfoTitle")}
        </div>

        <div className="mt-8 space-y-6">
          <div className="space-y-3">
            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {t("payInfoBusinessType")}
            </div>
            <RadioGroup
              value={businessType}
              onValueChange={(v) => setBusinessType(v as "corp" | "sole")}
              className="flex flex-wrap gap-10"
            >
              <label className="flex items-center gap-3">
                <RadioGroupItem value="corp" />
                <div className="text-sm text-slate-900 dark:text-slate-100">
                  {t("payInfoBusinessTypeCorp")}
                </div>
              </label>

              <label className="flex items-center gap-3">
                <RadioGroupItem value="sole" />
                <div className="text-sm text-slate-900 dark:text-slate-100">
                  {t("payInfoBusinessTypeSole")}
                </div>
              </label>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {t("payInfoRepresentativeName")}
            </Label>
            <Input placeholder="Value" className="h-12" />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {t("payInfoCompanyName")}
            </Label>
            <Input placeholder="Value" className="h-12" />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {t("payInfoEmail")}
            </Label>
            <Input placeholder="Value" className="h-12" />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {t("payInfoTransferName")}
            </Label>
            <Input placeholder="Value" className="h-12" />
          </div>

          <div className="text-sm leading-6 text-slate-900 dark:text-slate-100">
            {t("payInfoTransferHelp1")}
            <br />
            {t("payInfoTransferHelp2")}
          </div>

          <div className="pt-10">
            <div className="flex items-center justify-between gap-4">
              <Button
                type="button"
                variant="ghost"
                className="h-12 px-6 text-slate-900 dark:text-slate-100"
                onClick={onBack}
              >
                {t("payInfoBack")}
              </Button>

              <Button
                type="button"
                className="h-12 rounded-xl bg-slate-900 px-8 text-base text-white hover:bg-slate-900/90 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-100/90"
                onClick={onConfirm}
              >
                {t("payInfoConfirm")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
