import MerchantAccountUpsertForm from "../../_components/account-upsert-form";

const EditMerchantAccountPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <MerchantAccountUpsertForm accountId={id} />;
};

export default EditMerchantAccountPage;
