import MerchantUpsertForm from "../../_components/merchant-upsert-form";

const EditMerchantPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <MerchantUpsertForm merchantId={id} />;
};

export default EditMerchantPage;
