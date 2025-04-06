import {getListings} from "web/grpc/client";

export default async function Page() {
    const listings = await getListings()
    return (
        <ul>
            {listings.map((listing) => (
                <li key={listing.id}>{listing.address}</li>
            ))}
        </ul>
    )
}