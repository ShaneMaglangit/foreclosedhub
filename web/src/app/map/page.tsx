import { nearbyListingParams, NearbyListingParams } from "@web/app/schema";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@web/components/common/sidebar";
import { AppSidebar } from "@web/app/app-sidebar";
import { Button } from "@web/components/common/button";
import Link from "next/link";
import { getNearbyListings } from "@web/lib/grpc/client";
import ListingMap from "@web/app/map/listing-map";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<NearbyListingParams>;
}) {
  const params = nearbyListingParams.parse(await searchParams);
  const { listings } = await getNearbyListings(params);

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
        </header>
        <ListingMap
          center={{ lat: params.latitude, lng: params.longitude }}
          listings={listings}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
