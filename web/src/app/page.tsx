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
import { Button } from "@web/components/common/button";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { z } from "zod";

type Props = {
  searchParams?: {
    after?: number;
    before?: number;
    limit?: number;
    search?: string;
    sources?: string[] | string;
    occupied?: boolean;
  };
};

const paramsSchema = z.object({
  search: z.string().optional(),
  sources: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (typeof val === "string" ? [val] : val))
    .default(["pagibig"]),
  occupied: z.coerce.boolean().optional(),
  after: z.coerce.number().optional(),
  before: z.coerce.number().optional(),
  limit: z.coerce.number().default(20),
});

export default async function Page({ searchParams }: Props) {
  const params = paramsSchema.parse(await searchParams);
  const { listings, pageInfo } = await getListings(params);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <div className="flex-1">
            <SearchForm className="w-96" />
          </div>
          <div className="flex gap-1">
            {pageInfo?.hasPrevPage && (
              <Button asChild size="sm">
                <Link
                  href={`/?before=${pageInfo?.startCursor}&limit=${params.limit}`}
                >
                  <ArrowLeft />
                </Link>
              </Button>
            )}
            {pageInfo?.hasNextPage && (
              <Button asChild size="sm">
                <Link
                  href={`/?after=${pageInfo?.endCursor}&limit=${params.limit}`}
                >
                  <ArrowRight />
                </Link>
              </Button>
            )}
          </div>
        </header>
        <div className="grid auto-rows-min md:grid-cols-5 p-2 gap-2">
          {listings.map((listing) => (
            <div key={listing.id} className="bg-muted/50 border-[0.5px]">
              <div className="flex flex-col gap-2 p-2">
                <h6 className="font-medium truncate capitalize">
                  {listing.address.toLowerCase()}
                </h6>
                <p>₱ {formatNumeric(listing.price)}</p>
              </div>
              <Separator />
              <Carousel className="bg-accent">
                <CarouselContent>
                  {listing.imageUrls.map((url, index) => (
                    <CarouselItem key={index}>
                      <Image
                        src={url}
                        style={{
                          width: "100%",
                          height: "300px",
                        }}
                        width={500}
                        height={300}
                        alt="property image"
                      />
                    </CarouselItem>
                  ))}
                  {!listing.imageUrls.length && (
                    <CarouselItem
                      className="h-[300px] w-full relative bg-[image:repeating-linear-gradient(315deg,_var(--accent)_0,_var(--primary)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--accent)]/5 max-lg:h-66 max-lg:border-t lg:border-l dark:[--pattern-fg:var(--accent)]/10
"
                    />
                  )}
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
