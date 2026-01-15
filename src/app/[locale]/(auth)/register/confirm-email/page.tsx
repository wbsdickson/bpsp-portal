import { Card, CardContent } from "@/components/ui/card";

import { ConfirmEmailForm } from "./confirm-email-form";

export default async function ConfirmEmailPage() {
  return (
    <Card className="bg-sidebar w-full border-0 shadow-2xl backdrop-blur">
      <CardContent className="p-10">
        <ConfirmEmailForm />
      </CardContent>
    </Card>
  );
}
