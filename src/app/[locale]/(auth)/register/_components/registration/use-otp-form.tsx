import * as z from "zod";

interface Props {
  otpSize: number;
  t?: (key: string) => string;
}

const UseOtpForm = ({ otpSize, t }: Props) => {
  const OtpFormSchema = z.object({
    otp: z.string().min(otpSize, {
      message: t ? t("Registration.invalidOtp") : "Invalid OTP",
    }),
  });
  return { OtpFormSchema };
};

export default UseOtpForm;
