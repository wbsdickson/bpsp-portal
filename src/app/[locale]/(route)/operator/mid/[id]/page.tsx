import MidDetail from "../_components/mid-detail";

export default async function MidDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <MidDetail id={id} />;
}
