"use client";

import {APIProvider, InfoWindow, Map as GMap, MapCameraChangedEvent, Marker} from '@vis.gl/react-google-maps';
import {env} from "@web/env";
import {useRouter, useSearchParams} from 'next/navigation';
import {ComponentProps, useCallback, useState} from 'react';
import {useDebounceCallback} from "usehooks-ts";
import {cn, formatNumeric} from "@web/lib/utils/utils";
import {Listing} from "@web/lib/grpc/shared";
import Image from 'next/image'

const defaultZoomLevel = 7;
const philippinesCentralCoordinates = {lat: 12.8797, lng: 121.7740};

export default function Map({listings, className, ...props}: {
    listings: Listing[]
} & ComponentProps<typeof GMap>) {
    const router = useRouter();
    const searchParams = useSearchParams()

    const [selected, setSelected] = useState<undefined | Listing>()

    const updateUrlParams = useCallback(({minLat, maxLat, minLng, maxLng}: {
        minLat?: number,
        maxLat?: number,
        minLng?: number,
        maxLng?: number,
    }) => {
        const params = new URLSearchParams(searchParams)

        if (minLat) params.set("minLat", minLat.toFixed(6));
        if (maxLat) params.set("maxLat", maxLat.toFixed(6));
        if (minLng) params.set("minLng", minLng.toFixed(6));
        if (maxLng) params.set("maxLng", maxLng.toFixed(6));

        router.replace(`?${params.toString()}`);
    }, [router, searchParams]);

    const handleCameraChange = useDebounceCallback((e: MapCameraChangedEvent) => {
        const bounds = e.detail.bounds;

        if (!bounds) return;

        updateUrlParams({
            minLat: bounds.south,
            maxLat: bounds.north,
            minLng: bounds.west,
            maxLng: bounds.east
        })
    }, 500)

    return (
        <APIProvider apiKey={env.NEXT_PUBLIC_MAPS_API_KEY}>
            <GMap
                className={cn('h-full w-full', className)}
                defaultCenter={philippinesCentralCoordinates}
                defaultZoom={defaultZoomLevel}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                onCameraChanged={handleCameraChange}
                {...props}
            >
                {listings.map((listing) => (
                    <Marker
                        key={listing.id} position={{lat: listing.lat, lng: listing.lng}}
                        onClick={() => setSelected(listing)}
                    />
                ))}
                {selected && (
                    <InfoWindow
                        position={{lat: selected.lat, lng: selected.lng}}
                        headerContent={<h4 className="font-bold text-lg">{formatNumeric(selected.price)}</h4>}
                        className="flex flex-col gap-2"
                    >
                        {selected.imageUrls[0] && (
                            <Image
                                src={selected.imageUrls[0]}
                                width={500}
                                height={300}
                                alt="image of the selected property"
                                className="w-full"
                            />
                        )}
                        <ul>
                            <li>Address: {selected.address}</li>
                            <li>FloorArea: {selected.floorArea}</li>
                            <li>LotArea: {selected.lotArea}</li>
                        </ul>
                    </InfoWindow>
                )}
            </GMap>
        </APIProvider>
    );
}
