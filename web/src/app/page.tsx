import {getListings} from "@web/grpc/client";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@web/components/common/sidebar";
import {AppSidebar} from "@web/components/app-sidebar";
import {Separator} from "@web/components/common/separator";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@web/components/common/breadcrumb";

type Props = {
    searchParams?: {
        after?: number,
        before?: number,
        limit?: number,
    }
}

export default async function Page({searchParams}: Props) {
    const {after = 0, before = 0, limit = 20} = (await searchParams) || {}
    const {listings, pageInfo} = await getListings({after, before, limit})

    return (
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset>
                <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1"/>
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                    />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage>October 2024</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-5">
                        {Array.from({length: 20}).map((_, i) => (
                            <div key={i} className="bg-muted/50 aspect-square rounded-xl"/>
                        ))}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
