import type {Metadata} from "next";
import "./global.css";
import {ReactNode} from "react";
import {Inter} from 'next/font/google'

const inter = Inter({subsets: ['latin']})

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
        <html lang="en" className={inter.className}>
        <body>
        {children}
        </body>
        </html>
    );
}
