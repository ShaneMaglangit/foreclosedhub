"use client";

import { Listing__Output } from "@web/lib/protobuf/listing/Listing";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { env } from "@web/env";

const DEFAULT_CENTER = {
  lat: 120.98281926920842,
  lng: 14.600058768732925,
};

export default function ListingMap({
  listings,
}: {
  listings: Listing__Output[];
}) {
  const listingsWithCoords = listings.filter(
    (listing) => listing.latitude !== 0,
  );

  const center = listingsWithCoords.length
    ? {
        lat: listingsWithCoords[0].latitude,
        lng: listingsWithCoords[0].longitude,
      }
    : DEFAULT_CENTER;

  return (
    <LoadScript googleMapsApiKey={env.NEXT_PUBLIC_GCP_MAPS_API}>
      <GoogleMap mapContainerClassName="w-dvw h-dvh" center={center} zoom={10}>
        {listingsWithCoords.map((listing) => (
          <Marker
            key={listing.id}
            position={{ lat: listing.latitude, lng: listing.longitude }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}
