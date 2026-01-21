import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import {
  EmailFormSchema,
  FormCaption,
  FormHeader,
  FormHeaderSection,
  FormWrapper,
  STAGE,
} from "./user-registration-form";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { MotionVariant2 } from "@/lib/constants";
import { Link } from "next-view-transitions";
import { useConfigurationContext } from "@/context/configuration-context";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "next-intl";

interface Props {
  setStage: React.Dispatch<React.SetStateAction<STAGE>>;
  form: UseFormReturn<z.infer<typeof EmailFormSchema>>;
  setOtpSize: React.Dispatch<React.SetStateAction<number>>;
  setCodeTtl: React.Dispatch<React.SetStateAction<number>>;
}

const Email = ({ setStage, form, setOtpSize, setCodeTtl }: Props) => {
  const t = useTranslations("Auth.Registration");
  const [isEmailTaken, setIsEmailTaken] = useState(false);

  // const getOtpMutation = useMutation({
  //   mutationFn: UaaService.registerUser,
  // });

  useEffect(() => {
    setIsEmailTaken(false);
  }, [form.watch("email")]);

  async function onGetOTP(data: z.infer<typeof EmailFormSchema>) {
    toast.promise(
      async () => {
        try {
          // const res = await getOtpMutation.mutateAsync(data.email);
          // if (res.code === "OTP2001") {
          //   setStage(STAGE.SET_PASSWORD);
          //   return "OTP2001";
          // }
          // if (process.env.NEXT_PUBLIC_ENV === "uat") {
          //   alert(`OTP tips for development use: ${res.data.code}`);
          // }
          // setOtpSize(res.data.code.length);
          // setCodeTtl(res.data.ttl);
          setStage(STAGE.OTP);
        } catch (e: any) {
          const { code: sysCode, data } = e.response.data;

          if (sysCode === "OTP0429") {
            setStage(STAGE.OTP);
            setCodeTtl(data.ttl);
            return "OTP0429";
          }
          throw e;
        }
      },
      {
        loading: t("loading"),
        success: (result) => {
          if (result === "OTP0429") {
            return t("checkPreviousOtp");
          }
          if (result === "OTP2001") {
            return t("emailVerified");
          }
          return t("otpSentSuccess");
        },
        error: (error: any) => {
          const sysCode = error.response.data.code;
          if (sysCode === "UAA0409") {
            setIsEmailTaken(true);
            return t("emailTaken");
          }
          return `${sysCode} ${t("errorSendingOtp")} `;
        },
      },
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground text-sm">
          {useConfigurationContext()?.configProfile?.register
            ?.accountCreation || t("description")}
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onGetOTP)}
          className="space-y-4 text-left"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormControl>
                    <Input
                      {...field}
                      floatingLabel={true}
                      label={t("emailPlaceholder")}
                      className="bg-card rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isEmailTaken ? <EmailTaken /> : <AlreadyHaveAccount />}
          </div>
          <FormField
            control={form.control}
            name="isTncConfirmed"
            render={() => (
              <FormItem>
                <FormField
                  control={form.control}
                  name="isTncConfirmed"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key="tnc"
                        className="flex flex-row items-start gap-0 space-x-3 space-y-0"
                      >
                        <FormControl>
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300"
                            checked={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.checked);
                            }}
                          />
                        </FormControl>
                        <div className="flex flex-col gap-2">
                          <label
                            htmlFor="tnc"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {t("termsAgreement")}{" "}
                            <Link
                              className="text-primary"
                              href={
                                // eslint-disable-next-line react-hooks/rules-of-hooks
                                useConfigurationContext()?.configProfile
                                  ?.documents?.termsOfService || "/"
                              }
                              target="_blank"
                            >
                              {t("termsLink")}
                            </Link>
                          </label>
                        </div>
                      </FormItem>
                    );
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            // disabled={getOtpMutation.isPending}
            className="bg-primary w-full"
            type="submit"
          >
            {/* {getOtpMutation.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>{t("getVerificationCode")}</>
              )} */}
            {t("getVerificationCode")}
          </Button>
        </form>
      </Form>
      {/* </FormWrapper> */}
      <div className="mt-10 text-sm">
        <span>
          {t("policyAgreement")}{" "}
          <Link
            className="text-blue-600"
            href={
              useConfigurationContext()?.configProfile?.documents
                ?.termsOfService || "/"
            }
            target="_blank"
          >
            {t("termsLink")}
          </Link>
          . {t("policyDescription")}{" "}
          {/*{useConfigurationContext()?.configProfile?.companyName}&#39;s */}
          {/* privacy practices, please refer to the{" "} */}
          <Link
            className="text-blue-600"
            href={
              useConfigurationContext()?.configProfile?.documents
                ?.privacyStatement || "/"
            }
            target="_blank"
          >
            {t("privacyLink")}
          </Link>
          .
        </span>
      </div>
    </div>
  );
};

export default Email;

const AlreadyHaveAccount = () => {
  const t = useTranslations("Auth.Registration");
  return (
    <motion.div
      className="text-sm"
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {t("alreadyHaveAccount")}{" "}
      <Link className="ml-1 p-0 text-blue-600" href="/signin">
        {t("signIn")}
      </Link>
    </motion.div>
  );
};

const EmailTaken = () => {
  const t = useTranslations("Auth.Registration");
  return (
    <motion.div
      className="text-sm"
      variants={MotionVariant2}
      initial="hidden"
      animate="visible"
    >
      {t("emailTakenMessage")}
      <Link className="mx-1 p-0 text-blue-600" href="/resume-application">
        {t("here")}
      </Link>
      {t("toSignIn")}
    </motion.div>
  );
};
