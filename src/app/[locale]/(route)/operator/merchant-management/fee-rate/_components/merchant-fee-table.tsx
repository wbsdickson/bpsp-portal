"use client";

import * as React from "react";

import { DataTable } from "@/components/data-table";
import { FilterChipPopover } from "@/components/filter-chip-popover";
import { FilterChipMultiSelectPopover } from "@/components/filter-chip-multiselect-popover";
import { Button } from "@/components/ui/button";
import { useMerchantFeeStore } from "@/store/merchant-fee-store";
import { useMerchantStore } from "@/store/merchant-store";
import type { AppMerchantFee, PaymentMethodType } from "@/types/merchant-fee";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import useMerchantFeeTableColumn from "../_hook/use-table-column";

type MerchantFeeRow = AppMerchantFee & { merchantName: string };

const PAYMENT_METHOD_TYPES: PaymentMethodType[] = ["card", "bank"];

export default function MerchantFeeTable({
  addTab,
}: {
  addTab: (id: string) => void;
}) {
  const t = useTranslations("Operator.MerchantFees");
  const router = useRouter();

  const fees = useMerchantFeeStore((s) => s.fees);
  const merchants = useMerchantStore((s) => s.merchants);

  const rows: MerchantFeeRow[] = React.useMemo(() => {
    const merchantNameById = new Map(
      merchants.map((m) => [m.id, m.name] as const),
    );
    return fees.map((f) => ({
      ...f,
      merchantName: merchantNameById.get(f.merchantId) ?? "—",
    }));
  }, [fees, merchants]);

  const { column } = useMerchantFeeTableColumn({ addTab });

  return (
    <div className="space-y-3 p-4">
      <DataTable
        columns={column}
        data={rows}
        renderToolbar={(table) => {
          const merchantNameCol = table.getColumn("merchantName");
          const brandCol = table.getColumn("brand");
          const paymentMethodTypeCol = table.getColumn("paymentMethodType");

          const paymentMethodOptions = PAYMENT_METHOD_TYPES.map((v) => ({
            value: v,
            label: t(`paymentMethodTypes.${v}`),
          }));

          const rawPaymentValue = paymentMethodTypeCol?.getFilterValue();
          const paymentValues = Array.isArray(rawPaymentValue)
            ? (rawPaymentValue as string[])
            : rawPaymentValue
              ? [String(rawPaymentValue)]
              : [];

          return (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <FilterChipPopover
                  label={t("filters.merchantName")}
                  value={String(merchantNameCol?.getFilterValue() ?? "")}
                  onChange={(v) => merchantNameCol?.setFilterValue(v)}
                />
                <FilterChipPopover
                  label={t("filters.brand")}
                  value={String(brandCol?.getFilterValue() ?? "")}
                  onChange={(v) => brandCol?.setFilterValue(v)}
                />

                <FilterChipMultiSelectPopover
                  label={t("filters.paymentMethodType")}
                  values={paymentValues}
                  options={paymentMethodOptions}
                  onChange={(vals) =>
                    paymentMethodTypeCol?.setFilterValue(
                      vals.length ? vals : undefined,
                    )
                  }
                  searchPlaceholder={t("filters.search")}
                  resetLabel={t("filters.reset")}
                  doneLabel={t("filters.done")}
                  placeholder={t("filters.all")}
                />

                <Button
                  
                  variant="ghost"
                  size="sm"
                  className="h-9 text-indigo-600 hover:text-indigo-700"
                  onClick={() => table.resetColumnFilters()}
                >
                  {t("buttons.clearFilters")}
                  <X className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
