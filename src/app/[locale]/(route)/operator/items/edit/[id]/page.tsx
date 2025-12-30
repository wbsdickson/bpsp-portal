"use client";

import ItemUpsertForm from "../../_components/item-upsert-form";
import { useParams } from "next/navigation";

export default function EditItemPage() {
  const params = useParams();
  return <ItemUpsertForm itemId={params.id as string} />;
}
