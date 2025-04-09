import { z } from "zod";
import { occupancyStatuses } from "@web/types/occupancy-status";
import { sources } from "@web/types/source";

export const listingParams = z.object({
  search: z.string().optional(),
  sources: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (typeof val === "string" ? [val] : val))
    .default(Object.values(sources)),
  occupancyStatuses: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (typeof val === "string" ? [val] : val))
    .default(Object.values(occupancyStatuses)),
  after: z.coerce.number().optional(),
  before: z.coerce.number().optional(),
  limit: z.coerce.number().default(30),
});

export type ListingParam = z.infer<typeof listingParams>;
