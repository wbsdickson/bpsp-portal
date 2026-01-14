'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition, useState, useEffect } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Toaster } from 'sonner';
import { toast } from 'sonner';

import {
  emailSchema,
  registerSchema,
  type EmailFormValues,
  type RegisterFormValues,
} from './schemas';
import {
  sendConfirmationEmail,
  verifyToken,
  completeRegistration,
} from './actions';

import { useTranslations } from 'next-intl';
import HeaderPage from '@/components/header-page';
import { useRegistrationStore } from '@/store/merchant/registration';

export default function MerchantRegistrationPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { step: storeStep, setStep: setStoreStep } = useRegistrationStore();
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

  const t = useTranslations("Merchant.Registration");


  useEffect(() => {
    if (token) {
      verifyToken(token).then((res) => {
        if (res.valid) {
          setIsTokenValid(true);
          setStoreStep('form');
        } else {
          setIsTokenValid(false);
        }
      });
    } else {
      setStoreStep('email');
    }
  }, [token]);

  if (isTokenValid === false) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-destructive">{t("invalidLink")}</CardTitle>
            <CardDescription>{t("linkExpired")}</CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Link href="/merchant/registration">
              <Button variant="outline">{t("backToRegistration")}</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <HeaderPage
      title={t("title")}
      capitalizeTitle={false}
    >

      <div className="flex flex-col items-center justify-center bg-muted/50 p-4">
        <div className="w-full max-w-md">
          {storeStep === 'email' && <MerchantEmailForm />}
          {storeStep === 'form' && <MerchantRegistrationForm token={token!} onSuccess={() => setStoreStep('success')} />}
          {storeStep === 'success' && <RegistrationSuccess />}
        </div>
        <Toaster />
      </div>
    </HeaderPage>
  );
}

const MerchantEmailForm = () => {
  const [isPending, startTransition] = useTransition();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const t = useTranslations("Merchant.Registration");
  const { step, setStep } = useRegistrationStore();

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (values: EmailFormValues) => {
    startTransition(async () => {
      try {
        const result = await sendConfirmationEmail(values);
        setSuccessMessage(result.message);
        toast.success("Confirmation email sent");
        setTimeout(() => {
          setStep('form');
        }, 2000);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Something went wrong");
      }
    });
  }

  if (successMessage) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("checkYourEmail")}</CardTitle>
          <CardDescription>{successMessage}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>
          {t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("emailPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? t("sending") : t("sendConfirmationLink")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

const MerchantRegistrationForm = ({ token, onSuccess }: { token: string, onSuccess: () => void }) => {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("Merchant.Registration");

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      merchantName: '',
      ownerName: '',
      phoneNumber: '',
      address: '',
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(values: RegisterFormValues) {
    startTransition(async () => {
      try {
        await completeRegistration(values, token);
        onSuccess();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Registration failed");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("completeRegistration")}</CardTitle>
        <CardDescription>
          {t("fillMerchantDetails")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="merchantName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("merchantName")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("merchantNamePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ownerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("ownerName")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("ownerNamePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("phoneNumber")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("phoneNumberPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("address")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("addressPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("password")}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder={t("passwordPlaceholder")} {...field} />
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
                    <FormLabel>{t("confirmPassword")}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder={t("confirmPasswordPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? t("registering") : t("completeRegistration")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

const RegistrationSuccess = () => {
  const t = useTranslations("Merchant.Registration");
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-green-600">{t("registrationComplete")}</CardTitle>
        <CardDescription>
          {t("registrationCompleteDescription")}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Link href="/signin" className="w-full">
          <Button className="w-full">{t("goToLogin")}</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
