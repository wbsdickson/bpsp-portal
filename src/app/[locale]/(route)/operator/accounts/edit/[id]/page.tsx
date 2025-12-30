import UserUpsertForm from "../../_components/user-upsert-form";

const EditUserPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <UserUpsertForm userId={id} />;
};

export default EditUserPage;
