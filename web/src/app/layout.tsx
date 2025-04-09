import type { Metadata } from "next";
import "./global.css";
import { ReactNode } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { cn } from "@web/lib/utils";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Homagochi",
  description: "Properties fore you",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(plusJakartaSans.className, "overflow-x-hidden")}
    >
      <body>{children}</body>
    </html>
  );
}
