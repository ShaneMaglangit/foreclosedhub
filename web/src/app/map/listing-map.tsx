"use client";

import { ComponentProps, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounceCallback } from "usehooks-ts";
import {
  APIProvider,
  InfoWindow,
  Map,
  MapCameraChangedEvent,
  Marker,
} from "@vis.gl/react-google-maps";

import { Listing__Output } from "@web/lib/protobuf/listing/Listing";
import { ListingCard } from "@web/app/listing-card";
import { env } from "@web/env";
import { cn } from "@web/lib/utils";
import { useIsMobile } from "@web/lib/hooks/use-mobile";
import { Info } from "lucide-react";

type ListingMapProps = {
  listings: Listing__Output[];
  defaultCenter: google.maps.LatLngLiteral;
} & ComponentProps<typeof Map>;

export default function ListingMap(props: ListingMapProps) {
  const isMobile = useIsMobile();
  const [selectedListing, setSelectedListing] =
    useState<Listing__Output | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCenterChanged = useDebounceCallback(
    (newCenter: google.maps.LatLngLiteral) => {
      const currentParams = new URLSearchParams(searchParams.toString());

      currentParams.set("longitude", newCenter.lng.toFixed(5));
      currentParams.set("latitude", newCenter.lat.toFixed(5));

      router.push(`?${currentParams.toString()}`);
    },
    500,
  );

  const contentProps = {
    selectedListing,
    setSelectedListing,
    handleCenterChanged,
    ...props,
  };

  return (
    <div className="relative flex w-full h-[calc(100dvh-(var(--spacing)*16))]">
      {isMobile ? (
        <>
          <Content {...contentProps} />
          <div className="absolute flex items-center gap-2 bottom-4 left-1/4 -translate-x-1/4 rounded-xl bg-background px-4 py-2 shadow-lg text-sm text-muted-foreground">
            Some listings may be hidden due to overlapping pins. For better
            navigation, try using a desktop or laptop to access additional
            sidebars.
          </div>
        </>
      ) : (
        <>
          <ContentWithSidebar {...contentProps} />
          <div className="absolute flex items-center gap-2 bottom-4 left-1/2 -translate-x-1/2 rounded-xl bg-background px-4 py-2 shadow-lg text-sm text-muted-foreground">
            <Info className="h-4 w-4" />
            Some listings may be hidden due to overlapping pins. Use the right
            sidebar to help easily navigate all properties in the current area.
          </div>
        </>
      )}
    </div>
  );
}

type ContentProps = {
  selectedListing: Listing__Output | null;
  setSelectedListing: (listing: Listing__Output | null) => void;
  handleCenterChanged: (center: google.maps.LatLngLiteral) => void;
} & ListingMapProps;

function Content({
  listings,
  defaultCenter,
  selectedListing,
  setSelectedListing,
  handleCenterChanged,
  ...props
}: ContentProps) {
  return (
    <APIProvider apiKey={env.NEXT_PUBLIC_GCP_MAPS_API}>
      <Map
        defaultZoom={10}
        defaultCenter={defaultCenter}
        onCameraChanged={(ev: MapCameraChangedEvent) => {
          handleCenterChanged(ev.detail.center);
        }}
        {...props}
      >
        {listings.map((listing) => (
          <Marker
            key={listing.id}
            position={{ lat: listing.latitude, lng: listing.longitude }}
            onClick={() => setSelectedListing(listing)}
          />
        ))}

        {selectedListing && (
          <InfoWindow
            headerContent={
              <h3 className="max-w-[460px] truncate capitalize">
                {selectedListing.address.toLowerCase()}
              </h3>
            }
            position={{
              lat: selectedListing.latitude,
              lng: selectedListing.longitude,
            }}
            onCloseClick={() => setSelectedListing(null)}
          >
            <ListingCard className="max-w-[500px]" listing={selectedListing} />
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
}

function ContentWithSidebar(props: ContentProps) {
  const { listings, selectedListing, setSelectedListing } = props;

  const listingRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (selectedListing) {
      const node = listingRefs.current[selectedListing.id];
      if (node) {
        node.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [selectedListing]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();

        const currentIndex = listings.findIndex(
          (l) => l.id === selectedListing?.id,
        );

        if (e.key === "ArrowDown" && currentIndex < listings.length - 1) {
          setSelectedListing(listings[currentIndex + 1]);
        } else if (e.key === "ArrowUp" && currentIndex > 0) {
          setSelectedListing(listings[currentIndex - 1]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [listings, selectedListing, setSelectedListing]);

  return (
    <>
      <Content {...props} />

      <div className="w-[500px] flex flex-col gap-2 p-2 overflow-x-scroll">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            ref={(node) => {
              listingRefs.current[listing.id] = node;
            }}
            className={cn(
              "cursor-pointer",
              listing === selectedListing ? "border-4" : "",
            )}
            listing={listing}
            onClick={() => setSelectedListing(listing)}
          />
        ))}
      </div>
    </>
  );
}
