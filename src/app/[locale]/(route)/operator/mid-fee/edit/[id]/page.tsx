"use client";

import { useParams } from "next/navigation";

import MidFeeUpsertForm from "../../_components/mid-fee-upsert-form";

export default function EditMidFeePage() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  return <MidFeeUpsertForm feeId={id} />;
}
