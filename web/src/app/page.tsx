import {z} from "zod"
import {getListingsInBoundary} from "@web/lib/grpc/getListingsInBoundary";
import Map from "@web/app/map";

const paramsSchema = z.object({
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
    const params = paramsSchema.parse(await searchParams);
    const {listings = []} = await getListingsInBoundary(params) || {};

    return (
        <Map className="w-dvw h-dvh" listings={listings}/>
    )
}
