import {z} from "zod"

export type Listing = z.infer<typeof listingSchema>

export const listingSchema = z.object({
    id: z.number(),
    address: z.string(),
    price: z.number(),
    floorArea: z.number(),
    lotArea: z.number(),
    latitude: z.number(),
    longitude: z.number(),
    imageUrls: z.array(z.string())
})