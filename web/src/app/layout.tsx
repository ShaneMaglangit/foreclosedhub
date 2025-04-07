import type {Metadata} from "next";
import "./global.css";
import {ReactNode} from "react";
import {Inter} from 'next/font/google'
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@web/components/sidebar";
import {AppSidebar} from "@web/components/app-sidebar";
import {Separator} from "@web/components/separator";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@web/components/breadcrumb";

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
                <header
                    className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="cursor-pointer -ml-1"/>
                        <Separator orientation="vertical" className="mr-2 h-4"/>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbPage>Listings</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                {children}
            </SidebarInset>
        </SidebarProvider>
        </body>
        </html>
    );
}
