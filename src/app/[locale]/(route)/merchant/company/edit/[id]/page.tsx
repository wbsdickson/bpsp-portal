import MerchantCompanyUpsertForm from "../../_components/company-upsert-form";

const EditMerchantCompanyPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <MerchantCompanyUpsertForm companyId={id} />;
};

export default EditMerchantCompanyPage;
