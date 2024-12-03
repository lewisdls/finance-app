import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.scss";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Dosantos Finance App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#F9F5F1] flex flex-col-reverse lg:flex-row">
        <Navbar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
