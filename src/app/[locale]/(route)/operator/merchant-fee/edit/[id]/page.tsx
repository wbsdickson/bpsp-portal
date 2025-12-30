"use client";
import MerchantFeeUpsertForm from "../../_components/merchant-fee-upsert-form";
import { useParams } from "next/navigation";

export default function EditMerchantFeePage() {
  const { id } = useParams();
  return <MerchantFeeUpsertForm feeId={id as string} />;
}
