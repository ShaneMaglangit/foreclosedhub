"use client";

import {
    APIProvider,
    InfoWindow,
    Map as GMap,
    MapCameraChangedEvent,
    Marker,
} from "@vis.gl/react-google-maps";
import { env } from "@web/env";
import { useRouter, useSearchParams } from "next/navigation";
import { ComponentProps, useCallback, useState, useMemo, useEffect } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { cn, formatNumeric } from "@web/lib/utils/utils";
import Image from "next/image";
import { execute } from "@web/lib/graphql/execute";
import { GetListingsQuery } from "@web/lib/graphql/getListings";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Listing } from "@web/lib/graphql/generated/graphql";

const defaultZoomLevel = 7;
const philippinesCentralCoordinates = { lat: 12.8797, lng: 121.774 };

const paramsSchema = z.object({
    minLat: z.coerce.number().min(-90).max(90),
    maxLat: z.coerce.number().min(-90).max(90),
    minLng: z.coerce.number().min(-180).max(180),
    maxLng: z.coerce.number().min(-180).max(180),
});

export default function Map({ className, ...props }: ComponentProps<typeof GMap>) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [listings, setListings] = useState<Listing[]>([])
    const [selected, setSelected] = useState<undefined | Listing>();

    const bounds = useMemo(() => {
        const raw = Object.fromEntries(searchParams.entries());
        const parsed = paramsSchema.safeParse(raw);
        return parsed.success ? parsed.data : null;
    }, [searchParams]);

    const { data } = useQuery({
        queryKey: ['listings', bounds],
        queryFn: () => {
            if (!bounds) return Promise.resolve(undefined)
            return execute(GetListingsQuery, {
                minLatitude: bounds.minLat,
                maxLatitude: bounds.maxLat,
                minLongitude: bounds.minLng,
                maxLongitude: bounds.maxLng,
            });
        },
        enabled: !!bounds,
    });

    const updateUrlParams = useCallback(({ minLat, maxLat, minLng, maxLng }: {
        minLat?: number;
        maxLat?: number;
        minLng?: number;
        maxLng?: number;
    }) => {
        const params = new URLSearchParams(searchParams);

        if (minLat !== undefined) params.set("minLat", minLat.toFixed(6));
        if (maxLat !== undefined) params.set("maxLat", maxLat.toFixed(6));
        if (minLng !== undefined) params.set("minLng", minLng.toFixed(6));
        if (maxLng !== undefined) params.set("maxLng", maxLng.toFixed(6));

        router.replace(`?${params.toString()}`);
    }, [router, searchParams]);

    const handleCameraChange = useDebounceCallback((e: MapCameraChangedEvent) => {
        const bounds = e.detail.bounds;
        updateUrlParams({
            minLat: bounds.south,
            maxLat: bounds.north,
            minLng: bounds.west,
            maxLng: bounds.east,
        });
    }, 500);

    useEffect(() => {
        const nodes = data?.data?.listings?.nodes
        if (nodes) setListings(nodes)
    }, [data])

    return (
        <APIProvider apiKey={env.NEXT_PUBLIC_MAPS_API_KEY}>
            <GMap
                className={cn("h-full w-full", className)}
                defaultCenter={philippinesCentralCoordinates}
                defaultZoom={defaultZoomLevel}
                gestureHandling="greedy"
                disableDefaultUI
                onCameraChanged={handleCameraChange}
                onClick={() => setSelected(undefined)}
                {...props}
            >
                {listings.map((listing) => (
                    <Marker
                        key={listing.id}
                        position={{ lat: listing.latitude, lng: listing.longitude }}
                        onClick={() => setSelected(listing)}
                    />
                ))}
                {selected && (
                    <InfoWindow
                        position={{ lat: selected.latitude, lng: selected.longitude }}
                        headerContent={<h4 className="font-bold text-lg">{formatNumeric(selected.price)}</h4>}
                        className="flex flex-col gap-2"
                    >
                        {selected.images?.[0] && (
                            <Image
                                src={selected.images[0].url}
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
