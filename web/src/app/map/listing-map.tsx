"use client";

import { Listing__Output } from "@web/lib/protobuf/listing/Listing";
import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import { env } from "@web/env";
import { useState } from "react";

const DEFAULT_CENTER = {
  lat: 120.98281926920842,
  lng: 14.600058768732925,
};

export default function ListingMap({
  listings,
  ...props
}: {
  listings: Listing__Output[];
} & React.ComponentProps<typeof GoogleMap>) {
  const listingsWithCoords = listings.filter(
    (listing) => listing.latitude !== 0,
  );

  const center = listingsWithCoords.length
    ? {
        lat: listingsWithCoords[0].latitude,
        lng: listingsWithCoords[0].longitude,
      }
    : DEFAULT_CENTER;

  const [selectedListing, setSelectedListing] =
    useState<Listing__Output | null>(null);

  return (
    <LoadScript googleMapsApiKey={env.NEXT_PUBLIC_GCP_MAPS_API}>
      <GoogleMap {...props} center={center} zoom={10}>
        {listingsWithCoords.map((listing) => (
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
