"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { env } from "@web/env";
import { Listing__Output } from "@web/lib/protobuf/listing/Listing";
import "mapbox-gl/dist/mapbox-gl.css";

export default function ListingMap({
  listings,
}: {
  listings: Listing__Output[];
}) {
  const mapRef = useRef<mapboxgl.Map | null>(null); // Mapbox map reference
  const mapContainerRef = useRef<HTMLDivElement | null>(null); // Container reference

  const listingsWithCoords = listings.filter(
    (listing) => listing.latitude !== 0,
  );

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = env.NEXT_PUBLIC_MAPBOX_API_KEY;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: listingsWithCoords.length
        ? [listingsWithCoords[0].longitude, listingsWithCoords[0].latitude]
        : [0, 0],
      zoom: 10,
    });

    listingsWithCoords.forEach((listing) => {
      new mapboxgl.Marker()
        .setLngLat([listing.longitude, listing.latitude])
        .addTo(map);
    });

    mapRef.current = map;

    return () => {
      mapRef.current?.remove();
    };
  }, [mapRef, mapContainerRef, listingsWithCoords]);

  return (
    <>
      <div id="map-container" ref={mapContainerRef} className="w-dvw h-dvh" />
    </>
  );
}
