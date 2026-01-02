"use client";

import { useParams } from "next/navigation";

import PayoutTransactionDetail from "../_components/payout-transaction-detail";

export default function OperatorPayoutTransactionDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  return <PayoutTransactionDetail id={id} />;
}
