"use client";

import {APIProvider, Map as GMap, MapCameraChangedEvent, Marker} from '@vis.gl/react-google-maps';
import {env} from "@web/env";
import {useRouter} from 'next/navigation';
import {useCallback} from 'react';
import {ListingMarker} from "@web/lib/grpc/client";
import {useDebounceCallback} from "usehooks-ts";

const defaultZoomLevel = 7;
const philippinesCentralCoordinates = {lat: 12.8797, lng: 121.7740};

export default function Map({markers}: { markers: ListingMarker[] }) {
    const router = useRouter();

    const handleCameraChange = useCallback((e: MapCameraChangedEvent) => {
        const bounds = e.detail.bounds;

        if (!bounds) return;

        const minLat = bounds.south;
        const maxLat = bounds.north;
        const minLng = bounds.west;
        const maxLng = bounds.east;

        const params = new URLSearchParams({
            minLat: minLat.toFixed(6),
            maxLat: maxLat.toFixed(6),
            minLng: minLng.toFixed(6),
            maxLng: maxLng.toFixed(6),
        });

        router.replace(`?${params.toString()}`);
    }, [router]);

    const debouncedHandleCameraChange = useDebounceCallback(handleCameraChange, 500)

    return (
        <APIProvider apiKey={env.NEXT_PUBLIC_MAPS_API_KEY}>
            <GMap
                className='h-dvh w-dvw'
                defaultCenter={philippinesCentralCoordinates}
                defaultZoom={defaultZoomLevel}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                onCameraChanged={debouncedHandleCameraChange}
            >
                {markers.map((marker) => (
                    <Marker key={marker.id} position={{lat: marker.lat ?? 0, lng: marker.lng ?? 0}}/>
                ))}
            </GMap>
        </APIProvider>
    );
}
