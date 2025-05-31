import Map from '@web/app/map'
import {z} from "zod"
import {getListingMarkers} from "@web/lib/grpc/getListingMarkers";
import {Preview} from "@web/app/preview";
import {Suspense} from "react";

const paramsSchema = z.object({
    minLat: z.coerce.number().min(-90).max(90).default(0),
    maxLat: z.coerce.number().min(-90).max(90).default(0),
    minLng: z.coerce.number().min(-180).max(180).default(0),
    maxLng: z.coerce.number().min(-180).max(180).default(0),
    selected: z.coerce.number().optional(),
});

export default async function Page({searchParams}: {
    searchParams?: Promise<{
        minLat?: number;
        maxLat?: number;
        minLng?: number;
        maxLng?: number;
        selected?: number;
    }>
}) {
    const {minLat, maxLat, minLng, maxLng, selected} = paramsSchema.parse(await searchParams);
    const {listingMarkers = []} = await getListingMarkers({minLat, maxLat, minLng, maxLng}) || {};

    return (
        <div className="flex w-dvw h-dvh">
            <Map className="flex-3/4" markers={listingMarkers}/>
            {selected && (
                <Suspense fallback={<div className="flex-1/4 bg-white"/>}>
                    <Preview className="flex-1/4 text-black" listingId={selected}/>
                </Suspense>
            )}
        </div>
    )
}
