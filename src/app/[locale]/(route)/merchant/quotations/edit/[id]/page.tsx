import React from "react";

import QuotationUpsertForm from "../../_components/quotation-upsert-form";

const EditQuotationPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <QuotationUpsertForm quotationId={id} />;
};

export default EditQuotationPage;
