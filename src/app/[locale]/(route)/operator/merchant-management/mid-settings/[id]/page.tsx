import MerchantMidDetail from "../_components/merchant-mid-detail";

export default async function MerchantMidDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <MerchantMidDetail midId={id} />;
}
