import type {Metadata} from "next";
import "./global.css";
import {ReactNode} from "react";
import {Inter} from 'next/font/google'
import {SidebarInset, SidebarProvider} from "@web/components/sidebar";
import {AppSidebar} from "@web/components/app-sidebar";

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
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset>
                {children}
            </SidebarInset>
        </SidebarProvider>
        </body>
        </html>
    );
}
