import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import Link from "next/link";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
});

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
    <html lang="en">
      <body
        className={`${plusJakartaSans.className} h-dvh flex flex-col antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}

function Header() {
  return (
    <nav className="flex items-center h-[64px] px-4 py-2 bg-surface-secondary border border-border-primary">
      <menu>
        <li>
          <Link href="/" className="font-bold">
            Homepage
          </Link>
        </li>
      </menu>
    </nav>
  );
}
