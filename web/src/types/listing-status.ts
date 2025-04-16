export const listingStatuses = {
  Active: "active",
  Unlisted: "unlisted",
} as const;

export type ListingStatus = keyof typeof listingStatuses;
