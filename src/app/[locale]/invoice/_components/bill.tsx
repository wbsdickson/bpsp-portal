"use client";

import * as React from "react";

import type { Client, Merchant } from "@/lib/types";
import type { Invoice } from "@/types/invoice";
import { formattedAmount } from "@/lib/finance-utils";
import { useTranslations } from "next-intl";
import { convertUtcToJst } from "@/lib/date-utils";

function formatDateJa(dateIso: string) {
  const d = new Date(dateIso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}年${m}月${day}日`;
}

export function Bill({
  invoice,
  merchant,
  client,
}: {
  invoice: Invoice;
  merchant: Merchant | null;
  client: Client | null;
}) {
  const t = useTranslations("Operator.Invoice");
  const currency = invoice.currency || "JPY";

  const subtotal = React.useMemo(
    () =>
      (invoice.items ?? []).reduce(
        (sum, it) => sum + (it.quantity ?? 0) * (it.unitPrice ?? 0),
        0,
      ),
    [invoice.items],
  );

  const consumptionTax = React.useMemo(
    () => Math.round(subtotal * 0.1),
    [subtotal],
  );

  const withholding = React.useMemo(
    () => Math.round(invoice.amount - (subtotal + consumptionTax)),
    [invoice.amount, subtotal, consumptionTax],
  );

  const total = invoice.amount;

  const rows = React.useMemo(() => {
    const base = (invoice.items ?? []).map((it) => ({
      name: it.name,
      qty: it.quantity,
      unit: it.unitPrice,
      amount: it.quantity * it.unitPrice,
    }));

    const minRows = 5;
    while (base.length < minRows) {
      base.push({ name: "", qty: 0, unit: 0, amount: 0 });
    }
    return base;
  }, [invoice.items]);

  return (
    <div className="w-full bg-white text-black">
      <div className="border bg-white px-12 py-10">
        <div className="flex items-start justify-end">
          <div className="text-right text-xs leading-5">
            <div>{formatDateJa(invoice.invoiceDate)}</div>
            <div>
              {t("billNumberLabel")}: {invoice.invoiceNumber}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="text-2xl font-semibold tracking-widest">
            {t("billTitle")}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-10 text-sm">
          <div>
            <div className="font-medium">
              {(client?.name ?? invoice.recipientName ?? "").trim() || "—"} 御中
            </div>

            <div className="mt-2 text-xs text-black/70">{t("billIntro")}</div>

            <div className="mt-4 bg-black/5 px-4 py-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="font-medium">{t("billAmountLabel")}</div>
                <div className="font-semibold">
                  {formattedAmount(total, currency)}
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs">
              {t("billPaymentDueLabel")}:{" "}
              {invoice.dueDate ? convertUtcToJst(invoice.dueDate) : "—"}
            </div>
          </div>

          <div className="text-xs leading-5">
            <div className="font-medium">{merchant?.name ?? ""}</div>
            <div>{merchant?.address ?? ""}</div>
            <div>
              {merchant?.phoneNumber ? `TEL:${merchant.phoneNumber}` : ""}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <table className="w-full table-fixed border-collapse text-xs">
            <thead>
              <tr className="bg-black/60 text-white">
                <th className="w-[60%] border border-black/60 px-2 py-2 font-medium">
                  {t("billTableItem")}
                </th>
                <th className="w-[70px] border border-black/60 px-2 py-2 font-medium">
                  {t("billTableQty")}
                </th>
                <th className="w-[90px] border border-black/60 px-2 py-2 font-medium">
                  {t("billTableUnitPrice")}
                </th>
                <th className="w-[90px] border border-black/60 px-2 py-2 font-medium">
                  {t("billTableAmount")}
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r, idx) => (
                <tr key={idx} className="h-8">
                  <td className="w-[60%] border border-black/60 px-2">
                    {r.name}
                  </td>
                  <td className="border border-black/60 px-2 text-right">
                    {r.name ? r.qty : ""}
                  </td>
                  <td className="border border-black/60 px-2 text-right">
                    {r.name ? r.unit.toLocaleString("ja-JP") : ""}
                  </td>
                  <td className="border border-black/60 px-2 text-right">
                    {r.name ? r.amount.toLocaleString("ja-JP") : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex justify-end">
          <table className="border-collapse text-xs">
            <tbody>
              <tr>
                <td className="w-[140px] border border-black/60 px-3 py-2">
                  {t("billSubtotal")}
                </td>
                <td className="w-[120px] border border-black/60 px-3 py-2 text-right">
                  {subtotal.toLocaleString("ja-JP")}
                </td>
              </tr>
              <tr>
                <td className="border border-black/60 px-3 py-2">
                  {t("billConsumptionTax")}
                </td>
                <td className="border border-black/60 px-3 py-2 text-right">
                  {consumptionTax.toLocaleString("ja-JP")}
                </td>
              </tr>
              <tr>
                <td className="border border-black/60 px-3 py-2">
                  {t("billWithholdingTax")}
                </td>
                <td className="border border-black/60 px-3 py-2 text-right">
                  {withholding === 0
                    ? "0"
                    : withholding.toLocaleString("ja-JP")}
                </td>
              </tr>
              <tr>
                <td className="border border-black/60 px-3 py-2 font-medium">
                  {t("billTotal")}
                </td>
                <td className="border border-black/60 px-3 py-2 text-right font-semibold">
                  {total.toLocaleString("ja-JP")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <div className="w-[260px] text-[11px]">
            <div className="border-b border-black/60 pb-2">
              <div className="flex justify-between">
                <div>{t("billTax10Subject")}</div>
                <div>{subtotal.toLocaleString("ja-JP")}</div>
                <div className="w-4" />
                <div>{t("billTaxLabel")}</div>
                <div>{consumptionTax.toLocaleString("ja-JP")}</div>
              </div>

              <div className="mt-1 flex justify-between">
                <div>{t("billTax8Subject")}</div>
                <div>0</div>
                <div className="w-4" />
                <div>{t("billTaxLabel")}</div>
                <div>0</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-xs">
          <div>{t("billBankTransfer")}</div>
          <div className="mt-2 bg-black/5 px-4 py-3">
            三菱ＵＦＪ銀行 清和支店 普通 0153051 マツキケン
          </div>
        </div>
      </div>
    </div>
  );
}
