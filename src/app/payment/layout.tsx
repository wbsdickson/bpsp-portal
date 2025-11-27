import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export default function PaymentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`min-h-screen bg-gray-50 ${inter.className}`}>
            <div className="container mx-auto py-8 px-4 max-w-3xl">
                {children}
            </div>
            <Toaster />
        </div>
    );
}
