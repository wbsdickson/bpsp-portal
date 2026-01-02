"use client";

import { useSearchParams } from "next/navigation";

import { InvoiceUpsertPage } from "../_components/invoice-upsert";

export default function CreateInvoicePage() {
  const searchParams = useSearchParams();
  const editInvoiceId = searchParams.get("id") ?? undefined;
  return <InvoiceUpsertPage invoiceId={editInvoiceId} />;
}
