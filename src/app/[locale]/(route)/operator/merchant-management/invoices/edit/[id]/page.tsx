import React from "react";
import { InvoiceUpsertPage } from "../../_components/invoice-upsert";

const EditInvoicePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <InvoiceUpsertPage invoiceId={id} />;
};

export default EditInvoicePage;
