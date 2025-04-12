import { cn, formatNumeric } from "@web/lib/utils";
import { Listing__Output } from "@web/lib/protobuf/listing/Listing";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@web/components/common/carousel";
import Image from "next/image";
import {
  ExternalLink,
  LandPlot,
  PhilippinePeso,
  UserRound,
} from "lucide-react";
import { Button } from "@web/components/common/button";
import { Separator } from "@web/components/common/separator";

export function Listing({ listings }: { listings: Listing__Output[] }) {
  return (
    <div
      className={cn(
        "flex flex-col lg:grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 p-2 gap-2",
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
        <div className="flex items-center gap-2 ">
          <PhilippinePeso className="h-4 w-4" />
          <span>{formatNumeric(listing.price)}</span>
        </div>
        <div className="flex items-center gap-2 ">
          <LandPlot className="h-4 w-4" />
          <span>{listing.floorArea} sqm</span>
        </div>
        <div className="flex items-center gap-2 ">
          <UserRound className="h-4 w-4" />
          <span className="capitalize">{listing.occupancyStatus}</span>
        </div>
        {listing.source === "pagibig" && (
          <PagibigFormButton listing={listing} />
        )}
      </div>
    </div>
  );
}

function PagibigFormButton({ listing }: { listing: Listing__Output }) {
  const rawPayload = JSON.parse(listing.payload);
  const batchNumber = rawPayload.batch_number;
  const flag = "3"; // I have no clue what does mean, this was derived straight from PagibigFund's source code.
  const hbc =
    rawPayload.status === "1" || rawPayload.status === "2"
      ? batchNumber.substring(3, 5)
      : batchNumber.substring(0, 2);

  return (
    <form
      method="POST"
      action="https://www.pagibigfundservices.com/OnlinePublicAuction/Bidding/Login"
      target="_blank"
    >
      <input type="hidden" name="batchNo" value={batchNumber} />
      <input type="hidden" name="ropaId" value={listing.id} />
      <input type="hidden" name="flag" value={flag} />
      <input type="hidden" name="hbc" value={hbc} />
      <Button variant="link" size="sm" className="h-auto has-[>svg]:p-0">
        <ExternalLink /> Submit offer
      </Button>
    </form>
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
