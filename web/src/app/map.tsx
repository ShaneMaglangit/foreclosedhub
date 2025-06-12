"use client";

import {
    APIProvider,
    InfoWindow,
    Map as GMap,
    MapCameraChangedEvent,
    Marker,
    AdvancedMarker
} from "@vis.gl/react-google-maps";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@web/components/ui/carousel"
import { env } from "@web/env";
import { useRouter, useSearchParams } from "next/navigation";
import { ComponentProps, useCallback, useState, useMemo, useEffect, ChangeEvent } from "react";
import { useDebounceCallback, useMediaQuery } from "usehooks-ts";
import { cn, formatNumeric } from "@web/lib/utils/utils";
import Image from "next/image";
import { execute } from "@web/lib/graphql/execute";
import { GetListingsQuery } from "@web/lib/graphql/getListings";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { type GetListingsQuery as GetListingsQuerySchema } from "@web/lib/graphql/generated/graphql";
import { Input } from "@web/components/ui/input";
import { Cigarette, Search } from "lucide-react";

const defaultZoomLevel = 7;
const philippinesCentralCoordinates = { lat: 12.8797, lng: 121.774 };

const paramsSchema = z.object({
    minLat: z.coerce.number().min(-90).max(90),
    maxLat: z.coerce.number().min(-90).max(90),
    minLng: z.coerce.number().min(-180).max(180),
    maxLng: z.coerce.number().min(-180).max(180),
    address: z.string().optional(),
});

type Listing = GetListingsQuerySchema['listings']['nodes'][0]

export default function Map({ className, ...props }: ComponentProps<typeof GMap>) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isMobile = useMediaQuery('(max-width: 768px)')

    const [listings, setListings] = useState<Listing[]>([])
    const [selected, setSelected] = useState<undefined | Listing>();

    const params = useMemo(() => {
        const raw = Object.fromEntries(searchParams.entries());
        const parsed = paramsSchema.safeParse(raw);
        return parsed.success ? parsed.data : null;
    }, [searchParams]);

    const { data } = useQuery({
        queryKey: ['listings', params],
        queryFn: () => {
            if (!params) return Promise.resolve(undefined)
            return execute(GetListingsQuery, {
                minLatitude: params.minLat,
                maxLatitude: params.maxLat,
                minLongitude: params.minLng,
                maxLongitude: params.maxLng,
                address: params.address,
            });
        },
        enabled: !!params,
    });

    const updateUrlParams = useCallback(({ minLat, maxLat, minLng, maxLng, address }: {
        minLat?: number;
        maxLat?: number;
        minLng?: number;
        maxLng?: number;
        address?: string;
    }) => {
        const params = new URLSearchParams(searchParams);

        if (minLat) params.set("minLat", minLat.toFixed(6));
        if (maxLat) params.set("maxLat", maxLat.toFixed(6));
        if (minLng) params.set("minLng", minLng.toFixed(6));
        if (maxLng) params.set("maxLng", maxLng.toFixed(6));
        if (address) params.set("address", address);

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

    const handleInputChange = useDebounceCallback((e: ChangeEvent<HTMLInputElement>) => {
        updateUrlParams({ address: e.target.value })
    }, 500)

    useEffect(() => {
        const nodes = data?.listings?.nodes
        if (nodes) setListings(nodes)
    }, [data])

    return (
        <APIProvider apiKey={env.NEXT_PUBLIC_MAPS_API_KEY}>
            <div className={cn("h-full w-full flex flex-col", className)} >
                <div className="w-full flex gap-1 p-2 items-center">
                    <Input placeholder="Enter address" onChange={handleInputChange} />
                </div>
                <GMap
                    mapId="8ac4deda93a79dfce50e76ae"
                    colorScheme="DARK"
                    className="flex-1"
                    defaultCenter={philippinesCentralCoordinates}
                    defaultZoom={defaultZoomLevel}
                    gestureHandling="greedy"
                    disableDefaultUI
                    onCameraChanged={handleCameraChange}
                    onDrag={() => setSelected(undefined)}
                    onClick={() => setSelected(undefined)}
                    {...props}
                >
                    {listings.map((listing) => (
                        <AdvancedMarker
                            key={listing.id}
                            position={{ lat: listing.latitude, lng: listing.longitude }}
                            onClick={() => setSelected(listing)}
                        >
                            <div className={cn("bg-white p-1 rounded-full border text-md font-medium", getPriceCategoryColor(listing.price))}>
                                {formatNumeric(listing.price)}
                            </div>
                        </AdvancedMarker>
                    ))}
                    {selected && (
                        <InfoWindow
                            headerDisabled={true}
                            position={{ lat: selected.latitude, lng: selected.longitude }}
                            pixelOffset={[0, -22]}
                            minWidth={isMobile ? undefined : 400}
                            maxWidth={isMobile ? undefined : 400}
                        >
                            {selected.images?.length > 0 && (
                                <Carousel>
                                    <CarouselContent>
                                        {selected.images.map((image) => (
                                            <CarouselItem key={image.id}>
                                                <Image
                                                    src={image.url}
                                                    width={400}
                                                    height={300}
                                                    alt="image of the selected property"
                                                    className="w-full aspect-[4/3]"
                                                />
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                            )}
                            <div className="flex flex-col gap-1 p-2">
                                <h4 className="font-bold text-lg">₱{formatNumeric(selected.price)}</h4>
                                <ul>
                                    <li><span className="font-bold">Address:</span> {selected.address}</li>
                                    <li><span className="font-bold">Floor Area:</span> {selected.floorArea} sqm</li>
                                    <li><span className="font-bold">Lot Area:</span> {selected.lotArea} sqm</li>
                                </ul>
                            </div>
                        </InfoWindow>
                    )}
                </GMap>
            </div>
        </APIProvider>
    );
}

function getPriceCategoryColor(price: number): string {
    if (price < 1000000) return 'bg-green-500';
    if (price < 5000000) return 'bg-blue-500';
    if (price < 15000000) return 'bg-yellow-500';
    return 'bg-red-500';
}