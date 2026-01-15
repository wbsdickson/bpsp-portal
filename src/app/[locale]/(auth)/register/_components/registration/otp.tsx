import React, { useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import {
  FormCaption,
  FormHeader,
  FormHeaderSection,
  FormWrapper,
  STAGE,
} from "./user-registration-form";
import { useCountdown } from "@/hooks/use-countdown";
import { useTranslations } from "next-intl";

interface Props {
  setStage: React.Dispatch<React.SetStateAction<STAGE>>;
  form: UseFormReturn<z.infer<any>>;
  email: string;
  otpSize: number;
  codeTtl: number;
  setCodeTtl: React.Dispatch<React.SetStateAction<number>>;
  onBack?: () => void;
}

const OTP = ({
  setStage,
  form,
  email,
  otpSize,
  codeTtl,
  setCodeTtl,
  onBack,
}: Props) => {
  const t = useTranslations("Auth.Registration");
  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: codeTtl,
      intervalMs: 1000,
    });

  // const verifyOtpMutation = useMutation({
  //   mutationFn: UaaService.verifyRegister,
  // });

  // const reTriggerOtpMutation = useMutation({
  //   mutationFn: UaaService.reTriggerRegisterOtp,
  // });

  async function onGetOTP(data: z.infer<any>) {
    toast.promise(
      async () => {
        // await verifyOtpMutation.mutateAsync({
        //   email,
        //   otp: data.otp,
        // });
        setStage(STAGE.SET_PASSWORD);
      },
      {
        loading: t("verifying"),
        success: t("verifySuccess"),
        error: t("verifyFail"),
      },
    );
  }

  async function reTriggerOtp() {
    toast.promise(
      async () => {
        // let res = await reTriggerOtpMutation.mutateAsync({
        //   email,
        // });
        // if (process.env.NEXT_PUBLIC_ENV === "uat") {
        //   alert(`OTP tips : ${res.data.code}`);
        // }
        // setCodeTtl(res.data.ttl);
      },
      {
        loading: t("loading"),
        success: t("otpSentSuccess"),
        error: (error: any) => {
          const sysCode = error.response.data.code;
          return `${sysCode} ${t("errorSendingOtp")} `;
        },
      },
    );
  }

  useEffect(() => {
    resetCountdown();
    startCountdown();
  }, [codeTtl]);

  return (
    <div className="relative">
      {onBack && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="absolute left-0 top-0"
        >
          <ChevronLeft />
        </Button>
      )}
      <FormWrapper>
        <div className="space-y-4 text-center">
          <FormHeader heading={t("enterVerificationCode")} />
          <FormCaption caption={t("verificationCodeSent", { email })} />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onGetOTP)}
            className="space-y-6 text-center"
          >
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP
                      maxLength={otpSize}
                      containerClassName="justify-center"
                      {...field}
                      onChange={(value) => {
                        console.log(field);
                        console.log(value);
                        field.onChange(value);
                        if (value.length === otpSize) {
                          form.handleSubmit(onGetOTP)();
                        }
                      }}
                    >
                      <InputOTPGroup className="mx-auto">
                        {Array.from({ length: otpSize }).map((_, index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className="bg-card h-12 w-12 text-lg"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full">
              {/* {verifyOtpMutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>{t("verify")}</>
            )} */}
              <>{t("verify")}</>
            </Button>
            <div>{t("checkSpam")}</div>
            <div>
              <span className="text-sm">{t("noCode")} </span>
              <Button
                type="button"
                className="p-0 text-blue-600"
                variant="link"
                disabled={count > 0}
                onClick={reTriggerOtp}
              >
                {t("resendCode")} {count > 0 ? t("inSeconds", { count }) : ""}
              </Button>
            </div>
          </form>
        </Form>
      </FormWrapper>
    </div>
  );
};

export default OTP;
