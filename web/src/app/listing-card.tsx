"use client";

import { Listing__Output } from "@web/lib/protobuf/listing/Listing";
import { Separator } from "@web/components/common/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@web/components/common/tooltip";
import {
  ExternalLink,
  LandPlot,
  PhilippinePeso,
  UserRound,
} from "lucide-react";
import { cn, formatNumeric } from "@web/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@web/components/common/carousel";
import Image from "next/image";
import { Button } from "@web/components/common/button";
import { useIsMobile } from "@web/lib/hooks/use-mobile";
import { ComponentProps } from "react";
import Link from "next/link";

export function ListingCard({
  listing,
  className,
  ...props
}: { listing: Listing__Output } & ComponentProps<"div">) {
  const isMobile = useIsMobile();

  return (
    <div
      key={listing.id}
      className={cn("bg-background border w-full", className)}
      {...props}
    >
      <ListingCarousel listing={listing} />
      <Separator />
      {isMobile ? (
        <h6 className="text-left font-medium truncate capitalize p-2">
          {listing.address.toLowerCase()}
        </h6>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="w-full">
              <h6 className="text-left font-medium truncate capitalize p-2">
                {listing.address.toLowerCase()}
              </h6>
            </TooltipTrigger>
            <TooltipContent>
              <p className="capitalize">{listing.address.toLowerCase()}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
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
        {listing.source === "secbank" && <SecbankButton />}
      </div>
    </div>
  );
}

function SecbankButton() {
  return (
    <Button
      variant="link"
      size="sm"
      className="h-auto has-[>svg]:p-0 justify-start"
      asChild
    >
      <Link
        href="https://www.securitybank.com/personal/loans/repossessed-assets/properties-for-sale/"
        target="_blank"
      >
        <ExternalLink />
        Bank Website
      </Link>
    </Button>
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
      <input type="hidden" name="ropaId" value={listing.externalId} />
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
