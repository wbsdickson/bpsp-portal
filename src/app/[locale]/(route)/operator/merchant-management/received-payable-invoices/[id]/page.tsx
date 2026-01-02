"use client";

import ReceivedPayableInvoiceDetail from "../_components/received-payable-invoice-detail";

const ReceivedPayableInvoiceDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <ReceivedPayableInvoiceDetail id={id} />;
};

export default ReceivedPayableInvoiceDetailPage;
