import MerchantMemberUpsertForm from "../../_components/merchant-member-upsert-form";

const EditMerchantMemberPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <MerchantMemberUpsertForm userId={id} />;
};

export default EditMerchantMemberPage;
