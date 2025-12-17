import { Card, CardContent } from "@/components/ui/card";

import { RegisterForm } from "./register-form";

export default async function RegisterPage() {
  return (
    <Card className="bg-background/90 w-full border-0 shadow-2xl backdrop-blur">
      <CardContent className="p-10">
        <RegisterForm />
      </CardContent>
    </Card>
  );
}
