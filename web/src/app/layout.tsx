import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@web/components/ui/sonner";

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
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%2280%22 font-size=%2290%22>🏠</text></svg>",
        type: "image/svg+xml",
      },
    ],
  },
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
        <Toaster
          position="top-center"
          toastOptions={{
            className: "mt-[48px]",
          }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
