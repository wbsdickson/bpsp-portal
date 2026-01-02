import MidFeeDetail from "../_components/mid-fee-detail";

export default async function MidFeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <MidFeeDetail feeId={id} />;
}
