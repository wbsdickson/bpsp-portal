import React from "react";

import QuotationUpsertForm from "../../_components/purchase-order-upsert-form";
import PurchaseOrderUpsertForm from "../../_components/purchase-order-upsert-form";

const EditPurchaseOrderPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <PurchaseOrderUpsertForm purchaseOrderId={id} />;
};

export default EditPurchaseOrderPage;
