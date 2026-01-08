"use client";

import { useParams } from "next/navigation";

import MidUpsertForm from "../../_components/mid-upsert-form";

export default function EditMidPage() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  return <MidUpsertForm midId={id} />;
}
