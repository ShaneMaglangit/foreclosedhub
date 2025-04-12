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

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    after?: number;
    before?: number;
    limit?: number;
    search?: string;
    sources?: string[] | string;
    occupancyStatuses?: string[] | string;
  };
}) {
  const params = listingParams.parse(await searchParams);
  const { listings, pageInfo } = await getListings(params);

  return (
    <SidebarProvider>
      <AppSidebar params={params} />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex h-16 items-center justify-between gap-2 border-b px-4 z-10">
          <SidebarTrigger className="-ml-1" />
          <Pagination pageInfo={pageInfo} />
        </header>
        <Listing listings={listings} />
      </SidebarInset>
    </SidebarProvider>
  );
}
