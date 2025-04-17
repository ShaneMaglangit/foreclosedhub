import { getListings } from "@web/lib/grpc/client";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@web/components/common/sidebar";
import { AppSidebar } from "@web/app/app-sidebar";
import { listingParams } from "@web/app/schema";
import { Listing } from "@web/app/listing";
import { Pagination } from "@web/app/pagination";
import Link from "next/link";
import { Button } from "@web/components/common/button";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{
    after?: number;
    before?: number;
    limit?: number;
    search?: string;
    sources?: string[] | string;
    occupancyStatuses?: string[] | string;
  }>;
}) {
  const params = listingParams.parse(await searchParams);
  const { listings, pageInfo } = await getListings(params);

  return (
    <SidebarProvider>
      <AppSidebar params={params} />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex h-16 items-center gap-2 border-b px-4 z-10">
          <SidebarTrigger className="-ml-1" />
          <div className="flex flex-1">
            <Button asChild variant="link">
              <Link href="/">Grid View</Link>
            </Button>
            <Button asChild variant="link">
              <Link href="/map">Map View</Link>
            </Button>
          </div>
          <Pagination pageInfo={pageInfo} />
        </header>
        <Listing
          className="min-h-[calc(100dvh-(var(--spacing)*16))]"
          listings={listings}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
