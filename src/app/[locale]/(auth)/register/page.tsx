import { Card, CardContent } from "@/components/ui/card";

import { RegisterForm } from "./register-form";
import { UserRegistrationForm } from "./_components/registration/user-registration-form";

export default async function RegisterPage() {
  return (
    <Card className="bg-sidebar flex-col-center h-full w-full rounded-none border-0 p-4 shadow-2xl backdrop-blur transition-all duration-300 ease-in-out md:h-auto md:flex md:flex-col md:rounded-xl md:p-10">
      <CardContent>
        {/* <RegisterForm /> */}
        <UserRegistrationForm />
      </CardContent>
    </Card>
  );
}
