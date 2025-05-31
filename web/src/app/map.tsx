"use client";

import {APIProvider, Map as GMap, MapCameraChangedEvent, Marker} from '@vis.gl/react-google-maps';
import {env} from "@web/env";
import {useRouter, useSearchParams} from 'next/navigation';
import {ComponentProps, useCallback} from 'react';
import {ListingMarker} from "@web/lib/grpc/getListingMarkers";
import {useDebounceCallback} from "usehooks-ts";
import {cn} from "@web/lib/utils/cn";

const defaultZoomLevel = 7;
const philippinesCentralCoordinates = {lat: 12.8797, lng: 121.7740};

export default function Map({markers, className, ...props}: {
    markers: ListingMarker[]
} & ComponentProps<typeof GMap>) {
    const router = useRouter();
    const searchParams = useSearchParams()

    const updateUrlParams = useCallback(({minLat, maxLat, minLng, maxLng, selected}: {
        minLat?: number,
        maxLat?: number,
        minLng?: number,
        maxLng?: number,
        selected?: number
    }) => {
        const params = new URLSearchParams(searchParams)

        if (minLat) params.set("minLat", minLat.toFixed(6));
        if (maxLat) params.set("maxLat", maxLat.toFixed(6));
        if (minLng) params.set("minLng", minLng.toFixed(6));
        if (maxLng) params.set("maxLng", maxLng.toFixed(6));
        if (selected) params.set("selected", selected.toString());

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

    const handleMarkerSelect = (id: number) => {
        updateUrlParams({selected: id})
    }

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
                {markers.map((marker) => (
                    <Marker
                        key={marker.id} position={{lat: marker.lat, lng: marker.lng}}
                        onClick={() => handleMarkerSelect(marker.id)}
                    />
                ))}
            </GMap>
        </APIProvider>
    );
}
