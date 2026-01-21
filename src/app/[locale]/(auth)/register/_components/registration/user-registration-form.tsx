"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Email from "./email";
import OTP from "./otp";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Password from "./password";
import { AnimatePresence, motion } from "framer-motion";
import { MotionVariant2 } from "@/lib/constants";
import { useConfigurationContext } from "@/context/configuration-context";
import UseOtpForm from "./use-otp-form";

export enum STAGE {
  EMAIL = "EMAIL",
  OTP = "OTP",
  SET_PASSWORD = "SET_PASSWORD",
}

const stages = [STAGE.EMAIL, STAGE.OTP, STAGE.SET_PASSWORD];

export const EmailFormSchema = z.object({
  email: z.string().email(),
  isTncConfirmed: z.boolean().refine((val) => val, {
    message: "Terms and conditions must be accepted.",
  }),
});

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;

export const PasswordFormSchema = z
  .object({
    representativeName: z.string().min(1, "Required"),
    companyName: z.string().min(1, "Required"),
    phoneNumber: z.string().min(1, "Required"),
    legalForm: z.enum(["corporation", "individual"]),
    password: z.string().min(1, "Required").regex(passwordRegex, {
      message: "Password does not meet requirements",
    }),
    confirmPassword: z.string().min(1, "Required"),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Password should be identical to confirm password",
    path: ["confirmPassword"],
  });

export const UserRegistrationForm: React.FC = () => {
  useConfigurationContext().setTitle("Registration - {{name}}");
  const t = useTranslations("Auth");
  const [stage, setStage] = useState<STAGE>(STAGE.EMAIL);
  const [otpSize, setOtpSize] = useState(6);
  const [codeTtl, setCodeTtl] = useState(60);

  const { OtpFormSchema } = UseOtpForm({ otpSize, t });

  const emailFormSchema = z.object({
    email: z.string().email(),
    isTncConfirmed: z.boolean().refine((val) => val, {
      message: t("Registration.termsRequired"),
    }),
  });

  const emailForm = useForm<z.infer<typeof EmailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
      isTncConfirmed: false,
    },
  });

  const otpForm = useForm<z.infer<typeof OtpFormSchema>>({
    resolver: zodResolver(OtpFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  const passwordFormSchema = z
    .object({
      representativeName: z.string().min(1, t("requiredError")),
      companyName: z.string().min(1, t("requiredError")),
      phoneNumber: z.string().min(1, t("requiredError")),
      legalForm: z.enum(["corporation", "individual"]),
      password: z
        .string()
        .min(1, t("requiredError"))
        .regex(passwordRegex, {
          message: t("Registration.passwordRequirements"),
        }),
      confirmPassword: z.string().min(1, t("requiredError")),
    })
    .refine((data) => data.confirmPassword === data.password, {
      message: t("Registration.passwordMismatch"),
      path: ["confirmPassword"],
    });

  const passwordForm = useForm<z.infer<typeof PasswordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      representativeName: "",
      companyName: "",
      phoneNumber: "",
      legalForm: "corporation",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (stage === STAGE.EMAIL) {
      otpForm.reset();
      passwordForm.reset();
    }
    if (stage === STAGE.OTP) {
      passwordForm.reset();
    }
  }, [stage, otpForm, passwordForm]);

  const StepContent = () => {
    switch (stage) {
      case STAGE.EMAIL:
        return (
          <Email
            setStage={setStage}
            form={emailForm}
            setOtpSize={setOtpSize}
            setCodeTtl={setCodeTtl}
          />
        );
      case STAGE.OTP:
        return (
          <OTP
            codeTtl={codeTtl}
            setCodeTtl={setCodeTtl}
            setStage={setStage}
            form={otpForm}
            otpSize={otpSize}
            email={emailForm.getValues("email")}
            onBack={goBack}
          />
        );
      case STAGE.SET_PASSWORD:
        return (
          <Password
            email={emailForm.getValues("email")}
            setStage={setStage}
            form={passwordForm}
            onBack={goBack}
          />
        );
      default:
        return null;
    }
  };

  const goBack = () => {
    const currentIndex = stages.indexOf(stage);
    if (currentIndex > 0) {
      setStage(STAGE.EMAIL);
    }
  };

  return (
    <div className="relative h-full">
      <div className="flex h-full w-full flex-col justify-start">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            variants={MotionVariant2}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="h-full"
          >
            {StepContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export const FormHeader: React.FC<{ heading: string }> = ({ heading }) => (
  <h1 className="text-center text-2xl font-semibold tracking-tight">
    {heading}
  </h1>
);

export const FormCaption: React.FC<{ caption: string }> = ({ caption }) => (
  <p className="text-muted-foreground text-center text-sm">{caption}</p>
);

export const FormHeaderSection: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="space-y-4 text-center">{children}</div>;

export const FormWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div
    className={cn(
      "mx-auto w-2/3 min-w-[300px] max-w-[360px] space-y-8 md:max-w-[400px]",
      className,
    )}
  >
    {children}
  </div>
);
