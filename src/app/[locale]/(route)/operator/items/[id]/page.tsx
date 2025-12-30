"use client";

import ItemDetail from "../_components/item-detail";
import { useParams } from "next/navigation";

export default function ItemDetailPage() {
  const params = useParams();
  return <ItemDetail itemId={params.id as string} />;
}
