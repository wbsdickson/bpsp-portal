import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "../globals.css";

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { RoleThemeProvider } from "@/components/role-theme-provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ViewTransitions } from "next-view-transitions";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JPCC Portal",
  description: "Business Payment Solution Provider Portal",
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const safeLocale = locale === "en" || locale === "ja" ? locale : "en";
  const messages = await getMessages({ locale: safeLocale });

  return (
    <ViewTransitions>
      <html lang={safeLocale} suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SessionProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <NextIntlClientProvider locale={safeLocale} messages={messages}>
                <RoleThemeProvider>{children}</RoleThemeProvider>
              </NextIntlClientProvider>
              <Toaster />
            </ThemeProvider>
          </SessionProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
