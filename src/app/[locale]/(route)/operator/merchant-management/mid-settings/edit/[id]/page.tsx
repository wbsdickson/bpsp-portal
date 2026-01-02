"use client";
import { useParams } from "next/navigation";
import MerchantMidUpsertForm from "../../_components/merchant-mid-upsert-form";

export default function EditMerchantMidPage() {
  const params = useParams();
  return <MerchantMidUpsertForm midId={params.id as string} />;
}
