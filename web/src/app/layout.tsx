import type { Metadata } from "next";
import "./global.css";
import { ReactNode } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ForeclosedHub | Find Foreclosed Properties Across the Philippines",
  description:
    "Discover the best deals on foreclosed properties from top banks and mortgage providers in the Philippines. Aggregated listings, updated regularly — your smarter way to invest in real estate.",
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
