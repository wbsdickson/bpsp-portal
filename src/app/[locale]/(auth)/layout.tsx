import type { ReactNode } from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/login-bg.jpg)" }}
      />
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-10 lg:grid-cols-2">
        <div className="text-white">
          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight">
            Welcome
            <br />
            Back
          </h1>
          <p className="mt-6 max-w-md text-sm text-white/75">
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout.
          </p>
        </div>

        <div className="w-full max-w-xl justify-self-end">{children}</div>
      </div>
    </div>
  );
}
