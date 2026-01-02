"use client";

import ReceiptDetail from "../_components/receipt-detail";

const ReceiptDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <ReceiptDetail id={id} />;
};

export default ReceiptDetailPage;
