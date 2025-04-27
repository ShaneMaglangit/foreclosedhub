import type { Metadata } from "next";
import "./global.css";
import { ReactNode } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Foreclosed Properties Philippines | ForeclosedHub",
  description:
    "Browse updated listings of foreclosed properties across the Philippines. Find affordable homes, lots, and buildings from top banks and lenders with ForeclosedHub — your smart way to invest in Philippine real estate.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakartaSans.className}>
      <body>{children}</body>
    </html>
  );
}
