import { Card, CardContent } from "@/components/ui/card";

import { RegisterForm } from "./register-form";
import { UserRegistrationForm } from "./_components/registration/user-registration-form";

export default async function RegisterPage() {
  return (
    <Card className="bg-sidebar w-full border-0 p-10 shadow-2xl backdrop-blur">
      <CardContent>
        {/* <RegisterForm /> */}
        <UserRegistrationForm />
      </CardContent>
    </Card>
  );
}
