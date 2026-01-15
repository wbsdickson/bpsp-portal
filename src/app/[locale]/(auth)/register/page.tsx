import { Card, CardContent } from "@/components/ui/card";

import { RegisterForm } from "./register-form";
import { UserRegistrationForm } from "./_components/registration/user-registration-form";

export default async function RegisterPage() {
  return (
    <Card className="bg-background/90 w-full border-0 shadow-2xl backdrop-blur p-10">
      <CardContent>
        {/* <RegisterForm /> */}
        <UserRegistrationForm />
      </CardContent>
    </Card>
  );
}
