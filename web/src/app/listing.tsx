import { cn } from "@web/lib/utils";
import { Listing__Output } from "@web/lib/protobuf/listing/Listing";
import { ComponentProps } from "react";
import { ListingCard } from "@web/app/listing-card";

export function Listing({
  listings,
  className,
  ...props
}: { listings: Listing__Output[] } & ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col items-start lg:grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 p-2 gap-2",
        "relative bg-fixed",
        "bg-[image:repeating-linear-gradient(315deg,_var(--accent)_0,_var(--primary)_1px,_transparent_0,_transparent_50%)]",
        "bg-[size:5px_5px] [--pattern-fg:var(--accent)]/5 dark:[--pattern-fg:var(--accent)]/10",
        className,
      )}
      {...props}
    >
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
