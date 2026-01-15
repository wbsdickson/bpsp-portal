import { Card, CardContent } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

import { FinalRegisterForm } from "./final-register-form";

export default async function FinalRegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await getTranslations({ locale, namespace: "Auth" });

  return (
    <Card className="bg-sidebar w-full border-0 shadow-2xl backdrop-blur">
      <CardContent className="p-10">
        <FinalRegisterForm />
      </CardContent>
    </Card>
  );
}
