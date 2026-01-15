import React, { useMemo, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  FormCaption,
  FormHeader,
  FormHeaderSection,
  FormWrapper,
  PasswordFormSchema,
  STAGE,
} from "./user-registration-form";

type PasswordConstraint =
  | "length"
  | "capital"
  | "lowercase"
  | "number"
  | "special"
  | "same";

interface Props {
  setStage: React.Dispatch<React.SetStateAction<STAGE>>;
  form: UseFormReturn<z.infer<typeof PasswordFormSchema>>;
  email: string;
}

const SetPassword = ({ setStage, form, email }: Props) => {
  const t = useTranslations("Auth.SetupPassword");
  const tReg = useTranslations("Auth.Registration");
  const router = useRouter();
  const [isSuccessfullyRegistered, setIsSuccessfullyRegistered] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const createUserWithPasswordMutation = useMutation({
  //   mutationFn: UaaService.createUserWithPassword,
  // });
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl");

  async function onCreateUserWithPassword(
    data: z.infer<typeof PasswordFormSchema>,
  ) {
    setIsSubmitting(true);
    toast.promise(
      async () => {
        // await createUserWithPasswordMutation.mutateAsync({
        //   email,
        //   password: data.password,
        // });
        setIsSuccessfullyRegistered(true);
        // signIn("credentials", {
        //   username: email,
        //   password: data.password,
        //   redirect: true,
        //   callbackUrl: "/signin", // Redirect to the home page or another page after sign-in
        // });
        const callbackUrl = searchParams.get("callbackUrl");
        const safeCallbackUrl = callbackUrl
          ? callbackUrl.replace(/^\/+/, "").replace(/^https?:\/\//, "")
          : null;
        const nextHref = safeCallbackUrl ? `/${safeCallbackUrl}` : `/signin`;
        router.push(nextHref);
      },
      {
        loading: tReg("registering"),
        success: tReg("registrationSuccess"),
        error: () => {
          setIsSubmitting(false);
          return tReg("registrationFailed");
        },
      },
    );
  }

  const validatePassword = () => {
    const errors: Array<string> = [];
    const password = form.getValues("password");

    const confirmPassword = form.getValues("confirmPassword");
    if (!password)
      return ["length", "capital", "lowercase", "number", "special", "same"];
    if (password.length < 8) errors.push("length");
    if (!password.match(/[A-Z]/)) errors.push("capital");
    if (!password.match(/[a-z]/)) errors.push("lowercase");
    if (!password.match(/\d/)) errors.push("number");
    if (!password.match(/[~!@#$%^&*()\-_=+]/)) errors.push("special");
    if (password !== confirmPassword) errors.push("same");

    return errors;
  };
  const passwordValidationResult = useMemo(() => {
    return validatePassword();
  }, [form.watch().password, form.watch().confirmPassword]);

  const PasswordConstraintMessage: Record<PasswordConstraint, string> = {
    length: t("nLength", { n: 8 }),
    capital: t("nCapitalLetter", { n: 1 }),
    lowercase: t("nLowerCaseLetter", { n: 1 }),
    number: t("nNumericCharacter", { n: 1 }),
    special: t("nSpecialCharacter", { n: 1 }),
    same: t("same"),
  };

  const PasswordConstraintItemsJSX = [
    "length",
    "capital",
    "lowercase",
    "number",
    "special",
    "same",
  ].map((key) => {
    return (
      <li key={key} className="flex items-start text-sm transition-all">
        <AnimatePresence mode="wait">
          {passwordValidationResult.includes(key) ? (
            <motion.div
              key={`x-${key}`}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <XCircle className="text-destructive mr-2 mt-[2px] h-4 w-4" />
            </motion.div>
          ) : (
            <motion.div
              key={`check-${key}`}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <CheckCircle2 className="mr-2 mt-[2px] h-4 w-4 text-green-700" />
            </motion.div>
          )}
        </AnimatePresence>
        <span>{PasswordConstraintMessage[key as PasswordConstraint]}</span>
      </li>
    );
  });
  return (
    <FormWrapper>
      <FormHeaderSection>
        <FormHeader heading={tReg("setPassword")} />
        <FormCaption caption={tReg("createPasswordDescription")} />
      </FormHeaderSection>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onCreateUserWithPassword)}
          className="space-y-6 text-left"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tReg("passwordLabel")}</FormLabel>
                <FormControl>
                  <Input {...field} type="password" className="font-mono" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tReg("confirmPasswordLabel")}</FormLabel>
                <FormControl>
                  <Input {...field} type="password" className="font-mono" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="p-2">
            <ul className="list-decimal space-y-2 py-2 font-mono">
              {PasswordConstraintItemsJSX}
            </ul>
          </div>
          <Button
            disabled={isSubmitting || isSuccessfullyRegistered}
            className="w-full"
            type="submit"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>{tReg("confirm")}</>
            )}
          </Button>
        </form>
      </Form>
    </FormWrapper>
  );
};

export default SetPassword;
