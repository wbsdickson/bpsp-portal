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
    <div className="bg-background relative -top-[30px] rounded-b-md border">
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
                <RadioGroupItem
                  value="corp"
                  className="border-gray-400 bg-white"
                />
                <div className="text-sm text-slate-900 dark:text-slate-100">
                  {t("payInfoBusinessTypeCorp")}
                </div>
              </label>

              <label className="flex items-center gap-3">
                <RadioGroupItem
                  value="sole"
                  className="border-gray-400 bg-white"
                />
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
            <Input className="h-12 bg-white" />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {t("payInfoCompanyName")}
            </Label>
            <Input className="h-12 bg-white" />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {t("payInfoEmail")}
            </Label>
            <Input className="h-12 bg-white" />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {t("payInfoTransferName")}
            </Label>
            <Input className="h-12 bg-white" />
          </div>

          <div className="text-sm leading-6 text-slate-900 dark:text-slate-100">
            {t("payInfoTransferHelp1")}
            <br />
            {t("payInfoTransferHelp2")}
          </div>

          <div className="pt-10">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="h-12 flex-1 px-6 text-slate-900 dark:text-slate-100"
                onClick={onBack}
              >
                {t("payInfoBack")}
              </Button>

              <Button
                className="h-12 flex-1 bg-slate-900 px-8 text-base text-white hover:bg-slate-900/90 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-100/90"
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
