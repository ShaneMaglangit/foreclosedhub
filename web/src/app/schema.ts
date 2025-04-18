import { z } from "zod";

export const listingParams = z.object({
  search: z.string().optional(),
  sources: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (typeof val === "string" ? [val] : val))
    .default([]),
  occupancyStatuses: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (typeof val === "string" ? [val] : val))
    .default([]),
  statuses: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (typeof val === "string" ? [val] : val))
    .default([]),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  after: z.coerce.number().optional(),
  before: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
});

export type ListingParams = z.infer<typeof listingParams>;

export const nearbyListingParams = z.object({
  search: z.string().optional(),
  sources: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (typeof val === "string" ? [val] : val))
    .default([]),
  occupancyStatuses: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (typeof val === "string" ? [val] : val))
    .default([]),
  statuses: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (typeof val === "string" ? [val] : val))
    .default([]),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  longitude: z.coerce.number().optional().default(120.98281),
  latitude: z.coerce.number().optional().default(14.60005),
  limit: z.coerce.number().optional(),
});

export type NearbyListingParams = z.infer<typeof nearbyListingParams>;
