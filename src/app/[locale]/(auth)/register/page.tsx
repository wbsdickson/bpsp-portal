import { Card, CardContent } from "@/components/ui/card";

import { RegisterForm } from "./register-form";
import { UserRegistrationForm } from "./_components/registration/user-registration-form";

export default async function RegisterPage() {
  return (
    <Card className="bg-card w-full border-0 shadow-2xl backdrop-blur">
      <CardContent className="p-10">
        {/* <RegisterForm /> */}
        <UserRegistrationForm />
      </CardContent>
    </Card>
  );
}
