import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { ReactNode } from "react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],

  display: "swap",

  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CRM Dashboard",
  description: "Production-ready CRM Dashboard built with Next.js 15 & TanStack Query",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
