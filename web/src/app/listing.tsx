import { cn, formatNumeric } from "@web/lib/utils";
import { Listing__Output } from "@web/protobuf/listing/Listing";
import { Separator } from "@web/components/common/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@web/components/common/carousel";
import Image from "next/image";
import { LandPlot, PhilippinePeso, UserRound } from "lucide-react";

export function Listing({ listings }: { listings: Listing__Output[] }) {
  return (
    <div
      className={cn(
        "grid auto-rows-min md:grid-cols-6 p-2 gap-2",
        "relative bg-fixed",
        "bg-[image:repeating-linear-gradient(315deg,_var(--accent)_0,_var(--primary)_1px,_transparent_0,_transparent_50%)]",
        "bg-[size:5px_5px] [--pattern-fg:var(--accent)]/5 dark:[--pattern-fg:var(--accent)]/10",
      )}
    >
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}

function ListingCard({ listing }: { listing: Listing__Output }) {
  return (
    <div key={listing.id} className="bg-background border">
      <ListingCarousel listing={listing} />
      <Separator />
      <h6 className="font-medium truncate capitalize p-2">
        {listing.address.toLowerCase()}
      </h6>
      <div className="grid grid-cols-2 px-2 pb-2 gap-2">
        <div className="flex items-center gap-2 text-md">
          <PhilippinePeso className="h-4 w-4" />
          <span>{formatNumeric(listing.price)}</span>
        </div>
        <div className="flex items-center gap-2 text-md">
          <LandPlot className="h-4 w-4" />
          <span>{listing.floorArea} sqm</span>
        </div>
        {listing.occupancyStatus !== "unknown" && (
          <div className="flex items-center gap-2 text-md">
            <UserRound className="h-4 w-4" />
            <span className="capitalize">{listing.occupancyStatus}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ListingCarousel({ listing }: { listing: Listing__Output }) {
  return (
    <Carousel>
      <CarouselContent>
        {listing.imageUrls.length ? (
          listing.imageUrls.map((url, index) => (
            <CarouselItem key={index}>
              <Image
                src={url}
                alt="property image"
                width={500}
                height={250}
                style={{
                  height: "250px",
                  width: "100%",
                }}
              />
            </CarouselItem>
          ))
        ) : (
          <CarouselItem
            className={cn(
              "h-[250px] w-full relative bg-fixed max-lg:h-66 max-lg:border-t lg:border-l",
              "bg-[image:repeating-linear-gradient(315deg,_var(--accent)_0,_var(--primary)_1px,_transparent_0,_transparent_50%)]",
              "bg-[size:10px_10px] [--pattern-fg:var(--accent)]/5 dark:[--pattern-fg:var(--accent)]/10",
            )}
          />
        )}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
