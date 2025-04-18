"use client";

import { Listing__Output } from "@web/lib/protobuf/listing/Listing";
import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import { env } from "@web/env";
import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounceCallback } from "usehooks-ts";

export default function ListingMap({
  listings,
  center,
  ...props
}: {
  listings: Listing__Output[];
} & React.ComponentProps<typeof GoogleMap>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mapRef = useRef<google.maps.Map | null>(null);

  const [initialCenter] = useState(center);
  const [selectedListing, setSelectedListing] =
    useState<Listing__Output | null>(null);

  const handleCenterChanged = useDebounceCallback(() => {
    const newCenter = mapRef?.current?.getCenter();
    if (!newCenter) return;

    const currentParams = new URLSearchParams(searchParams.toString());

    currentParams.set("longitude", newCenter.lat().toFixed(6));
    currentParams.set("latitude", newCenter.lng().toFixed(6));

    router.push(`?${currentParams.toString()}`);
  }, 500);

  const handleOnLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  return (
    <LoadScript googleMapsApiKey={env.NEXT_PUBLIC_GCP_MAPS_API}>
      <GoogleMap
        {...props}
        center={initialCenter}
        zoom={10}
        onLoad={handleOnLoad}
        onCenterChanged={handleCenterChanged}
      >
        {listings.map((listing) => (
          <Marker
            key={listing.id}
            position={{ lat: listing.latitude, lng: listing.longitude }}
            onClick={() => setSelectedListing(listing)}
            label={{
              text: `₱${(parseFloat(listing.price) / 1000000).toFixed(1)}M`,
              fontSize: "14px",
              fontWeight: "bold",
              color: "#000",
            }}
          />
        ))}

        {selectedListing && (
          <InfoWindow
            position={{
              lat: selectedListing.latitude,
              lng: selectedListing.longitude,
            }}
            onCloseClick={() => setSelectedListing(null)}
          >
            <div>
              <h2 className="font-bold text-sm">{selectedListing.address}</h2>
              <p>₱{selectedListing.price.toLocaleString()}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}
