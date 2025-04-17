import { listingParams } from "@web/app/schema";
import { getListings } from "@web/lib/grpc/client";
import ListingMap from "@web/app/map/listing-map";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{
    after?: number;
    before?: number;
    limit?: number;
    search?: string;
    sources?: string[] | string;
    occupancyStatuses?: string[] | string;
  }>;
}) {
  const params = listingParams.parse(await searchParams);
  const { listings } = await getListings(params);

  return <ListingMap listings={listings} />;
}
