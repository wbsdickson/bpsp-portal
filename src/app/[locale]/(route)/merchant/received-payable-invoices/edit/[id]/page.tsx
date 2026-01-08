"use client";

import { ReceivedPayableInvoiceUpsertPage } from "../../_components/received-payable-invoice-upsert";

const EditReceivedPayableInvoicePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <ReceivedPayableInvoiceUpsertPage invoiceId={id} />;
};

export default EditReceivedPayableInvoicePage;
