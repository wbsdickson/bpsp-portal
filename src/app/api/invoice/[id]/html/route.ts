import { NextRequest, NextResponse } from "next/server";
import { formattedAmount } from "@/lib/finance-utils";
import { convertUtcToJst } from "@/lib/date-utils";
import type { Invoice } from "@/types/invoice";
import type { Client, Merchant } from "@/lib/types";

function formatDateJa(dateIso: string) {
  const d = new Date(dateIso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}年${m}月${day}日`;
}

function generateInvoiceHTML(
  invoice: Invoice,
  merchant: Merchant | null,
  client: Client | null,
  translations: Record<string, string>,
) {
  const currency = invoice.currency || "JPY";

  const subtotal = (invoice.items ?? []).reduce(
    (sum, it) => sum + (it.quantity ?? 0) * (it.unitPrice ?? 0),
    0,
  );

  const consumptionTax = Math.round(subtotal * 0.1);
  const withholding = Math.round(invoice.amount - (subtotal + consumptionTax));
  const total = invoice.amount;

  const rows = (invoice.items ?? []).map((it) => ({
    name: it.name,
    qty: it.quantity,
    unit: it.unitPrice,
    amount: it.quantity * it.unitPrice,
  }));

  const minRows = 5;
  while (rows.length < minRows) {
    rows.push({ name: "", qty: 0, unit: 0, amount: 0 });
  }

  const t = (key: string) => translations[key] || key;

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t("billTitle")} - ${invoice.invoiceNumber}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: white;
      color: black;
      padding: 40px;
    }
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border: 1px solid #e5e5e5;
      padding: 48px;
    }
    .header {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 32px;
    }
    .header-content {
      text-align: right;
      font-size: 12px;
      line-height: 1.5;
    }
    .title {
      text-align: center;
      font-size: 24px;
      font-weight: 600;
      letter-spacing: 0.1em;
      margin-bottom: 32px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 32px;
      font-size: 14px;
    }
    .amount-box {
      background: rgba(0, 0, 0, 0.05);
      padding: 8px 16px;
      margin-top: 8px;
      font-size: 14px;
    }
    .amount-box-row {
      display: flex;
      justify-content: space-between;
      font-weight: 500;
    }
    .amount-box-total {
      font-weight: 600;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      margin-bottom: 12px;
    }
    th {
      background: rgba(0, 0, 0, 0.6);
      color: white;
      border: 1px solid rgba(0, 0, 0, 0.6);
      padding: 8px;
      font-weight: 500;
      text-align: left;
    }
    th:nth-child(2),
    th:nth-child(3),
    th:nth-child(4) {
      text-align: right;
    }
    td {
      border: 1px solid rgba(0, 0, 0, 0.6);
      padding: 8px;
      height: 32px;
    }
    td:nth-child(2),
    td:nth-child(3),
    td:nth-child(4) {
      text-align: right;
    }
    .summary-table {
      margin-left: auto;
      width: auto;
    }
    .summary-table td {
      width: 140px;
      padding: 8px 12px;
    }
    .summary-table td:first-child {
      width: 140px;
    }
    .summary-table td:last-child {
      width: 120px;
    }
    .tax-info {
      width: 260px;
      margin-left: auto;
      margin-top: 24px;
      font-size: 11px;
    }
    .tax-info-row {
      display: flex;
      justify-content: space-between;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.6);
      margin-bottom: 4px;
    }
    .bank-info {
      margin-top: 40px;
      font-size: 12px;
    }
    .bank-box {
      background: rgba(0, 0, 0, 0.05);
      padding: 12px 16px;
      margin-top: 8px;
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header">
      <div class="header-content">
        <div>${formatDateJa(invoice.invoiceDate)}</div>
        <div>${t("billNumberLabel")}: ${invoice.invoiceNumber}</div>
      </div>
    </div>

    <div class="title">${t("billTitle")}</div>

    <div class="info-grid">
      <div>
        <div style="font-weight: 500;">
          ${(client?.name ?? invoice.recipientName ?? "").trim() || "—"} 御中
        </div>
        <div style="margin-top: 8px; font-size: 12px; color: rgba(0, 0, 0, 0.7);">
          ${t("billIntro")}
        </div>
        <div class="amount-box">
          <div class="amount-box-row">
            <div style="font-weight: 500;">${t("billAmountLabel")}</div>
            <div style="font-weight: 600;">${formattedAmount(total, currency)}</div>
          </div>
        </div>
        <div style="margin-top: 16px; font-size: 12px;">
          ${t("billPaymentDueLabel")}: ${invoice.dueDate ? convertUtcToJst(invoice.dueDate) : "—"}
        </div>
      </div>

      <div style="font-size: 12px; line-height: 1.5;">
        <div style="font-weight: 500;">${merchant?.name ?? ""}</div>
        <div>${merchant?.address ?? ""}</div>
        <div>${merchant?.phoneNumber ? `TEL:${merchant.phoneNumber}` : ""}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 60%;">${t("billTableItem")}</th>
          <th style="width: 70px;">${t("billTableQty")}</th>
          <th style="width: 90px;">${t("billTableUnitPrice")}</th>
          <th style="width: 90px;">${t("billTableAmount")}</th>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (r) => `
        <tr>
          <td>${r.name}</td>
          <td>${r.name ? r.qty : ""}</td>
          <td>${r.name ? r.unit.toLocaleString("ja-JP") : ""}</td>
          <td>${r.name ? r.amount.toLocaleString("ja-JP") : ""}</td>
        </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>

    <table class="summary-table">
      <tbody>
        <tr>
          <td>${t("billSubtotal")}</td>
          <td style="text-align: right;">${subtotal.toLocaleString("ja-JP")}</td>
        </tr>
        <tr>
          <td>${t("billConsumptionTax")}</td>
          <td style="text-align: right;">${consumptionTax.toLocaleString("ja-JP")}</td>
        </tr>
        <tr>
          <td>${t("billWithholdingTax")}</td>
          <td style="text-align: right;">${withholding === 0 ? "0" : withholding.toLocaleString("ja-JP")}</td>
        </tr>
        <tr>
          <td style="font-weight: 500;">${t("billTotal")}</td>
          <td style="text-align: right; font-weight: 600;">${total.toLocaleString("ja-JP")}</td>
        </tr>
      </tbody>
    </table>

    <div class="tax-info">
      <div class="tax-info-row">
        <div>${t("billTax10Subject")}</div>
        <div>${subtotal.toLocaleString("ja-JP")}</div>
        <div style="width: 16px;"></div>
        <div>${t("billTaxLabel")}</div>
        <div>${consumptionTax.toLocaleString("ja-JP")}</div>
      </div>
      <div class="tax-info-row">
        <div>${t("billTax8Subject")}</div>
        <div>0</div>
        <div style="width: 16px;"></div>
        <div>${t("billTaxLabel")}</div>
        <div>0</div>
      </div>
    </div>

    <div class="bank-info">
      <div>${t("billBankTransfer")}</div>
      <div class="bank-box">三菱ＵＦＪ銀行 清和支店 普通 0153051 マツキケン</div>
    </div>
  </div>
</body>
</html>`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const invoiceNumber = decodeURIComponent(id);

  // TODO: Fetch invoice, merchant, and client data from your database/API
  // For now, return a placeholder HTML
  // In a real implementation, you would:
  // const invoice = await getInvoiceByNumber(invoiceNumber);
  // const merchant = await getMerchant(invoice.merchantId);
  // const client = await getClient(invoice.clientId);
  // const translations = await getTranslations("Operator.Invoice");

  const placeholderHTML = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>Invoice ${invoiceNumber}</title>
</head>
<body>
  <h1>Invoice ${invoiceNumber}</h1>
  <p>Invoice HTML generation - data fetching needs to be implemented</p>
</body>
</html>`;

  return new NextResponse(placeholderHTML, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
