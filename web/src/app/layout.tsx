import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "ForeclosedHub | Foreclosed Properties for Sale in the Philippines",
  description:
    "Discover updated listings of foreclosed properties in the Philippines. Buy bank-foreclosed homes, lots, and commercial buildings at affordable prices.",
  keywords: [
    "foreclosed properties",
    "foreclosed homes Philippines",
    "bank foreclosures",
    "real estate investing",
    "cheap lots for sale",
    "foreclosed listings Philippines",
  ],
  metadataBase: new URL("https://www.foreclosedhub.com"),
  openGraph: {
    title: "ForeclosedHub | Foreclosed Properties in the Philippines",
    description:
      "Explore bank-foreclosed homes, land, and buildings across the Philippines. Find affordable investment opportunities with ForeclosedHub.",
    url: "https://www.foreclosedhub.com",
    siteName: "ForeclosedHub",
    images: [
      {
        url: "https://ogimage.vercel.app/**ForeclosedHub**.png?theme=light&md=1&fontSize=75px",
        width: 1200,
        height: 630,
        alt: "ForeclosedHub - Foreclosed Properties in the Philippines",
      },
    ],
    locale: "en_PH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ForeclosedHub | Bank-Foreclosed Properties in the Philippines",
    description:
      "Affordable foreclosed homes, land, and buildings for sale across the Philippines. Updated daily.",
    images: [
      "https://ogimage.vercel.app/**ForeclosedHub**.png?theme=light&md=1&fontSize=75px",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${jetBrainsMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
