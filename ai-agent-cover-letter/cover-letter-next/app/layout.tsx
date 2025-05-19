import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/app-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cover Letter & Cold Email Generator",
  description: "AI-powered tool to generate personalized cover letters and cold emails",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
