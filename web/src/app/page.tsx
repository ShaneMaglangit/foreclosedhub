import { getListings } from "@web/grpc/client";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@web/components/common/sidebar";
import { AppSidebar } from "@web/components/app-sidebar";
import { Separator } from "@web/components/common/separator";
import { SearchForm } from "@web/components/search-form";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@web/components/carousel";
import Image from "next/image";
import { formatNumeric } from "@web/lib/utils";

type Props = {
  searchParams?: {
    after?: number;
    before?: number;
    limit?: number;
  };
};

export default async function Page({ searchParams }: Props) {
  const { after = 0, before = 0, limit = 20 } = (await searchParams) || {};
  const { listings, pageInfo } = await getListings({ after, before, limit });

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <SearchForm className="w-96" />
        </header>
        <div className="grid auto-rows-min md:grid-cols-5">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-muted/50 border-r border-b overflow-hidden "
            >
              <div className="flex flex-col gap-2 p-2">
                <h6 className="font-medium truncate capitalize">
                  {listing.address.toLowerCase()}
                </h6>
                <p>₱ {formatNumeric(listing.price)}</p>
              </div>
              <Carousel>
                <CarouselContent>
                  {listing.imageUrls.map((url, index) => (
                    <CarouselItem key={index} className="border-t">
                      <Image
                        src={url}
                        style={{
                          width: "100%",
                          height: "auto",
                        }}
                        width={500}
                        height={300}
                        alt="property image"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          ))}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
