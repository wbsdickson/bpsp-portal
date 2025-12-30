"use client";
import MerchantFeeDetail from "../_components/merchant-fee-detail";
import { useParams } from "next/navigation";

export default function MerchantFeeDetailPage() {
  const params = useParams();
  const id = params.id as string;
  return <MerchantFeeDetail feeId={id} />;
}
