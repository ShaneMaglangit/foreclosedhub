"use client";

import { useState } from "react";
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

export default function ListingMap({
  listings,
  defaultCenter,
}: {
  listings: Listing__Output[];
  defaultCenter: google.maps.LatLngLiteral;
}) {
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

  return (
    <APIProvider apiKey={env.NEXT_PUBLIC_GCP_MAPS_API}>
      <Map
        defaultZoom={10}
        defaultCenter={defaultCenter}
        onCameraChanged={(ev: MapCameraChangedEvent) => {
          handleCenterChanged(ev.detail.center);
        }}
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
