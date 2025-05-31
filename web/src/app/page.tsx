import Map from '@web/app/map'
import {z} from "zod"
import {getListingMarkers} from "@web/lib/grpc/client";

const getListingMarkersParams = z.object({
    minLat: z.coerce.number().min(-90).max(90).default(0),
    maxLat: z.coerce.number().min(-90).max(90).default(0),
    minLng: z.coerce.number().min(-180).max(180).default(0),
    maxLng: z.coerce.number().min(-180).max(180).default(0),
});

export default async function Page({searchParams}: {
    searchParams?: Promise<{
        minLat?: number;
        maxLat?: number;
        minLng?: number;
        maxLng?: number;
    }>
}) {
    const params = getListingMarkersParams.parse(await searchParams);
    const {listingMarkers = []} = await getListingMarkers(params) || {};
    
    return <Map markers={listingMarkers}/>
}
