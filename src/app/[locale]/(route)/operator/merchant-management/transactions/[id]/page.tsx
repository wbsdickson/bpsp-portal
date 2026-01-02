"use client";

import { useParams } from "next/navigation";

import TransactionDetail from "../_components/transaction-detail";

export default function OperatorTransactionDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  return <TransactionDetail id={id} />;
}
