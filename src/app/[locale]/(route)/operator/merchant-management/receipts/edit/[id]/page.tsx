"use client";

import { ReceiptUpsertPage } from "../../_components/receipt-upsert";

const EditReceiptPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <ReceiptUpsertPage receiptId={id} />;
};

export default EditReceiptPage;
