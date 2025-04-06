import {getListings} from "web/grpc/client";

export default async function Page() {
    const listings = await getListings()
    return (
        <ul>
            {listings.map((listing) => (
                <li key={listing.id}>
                    <span>{listing.address} - {listing.price}</span>
                    {listing.imageUrls?.map((url, index) => (
                        <img key={index} src={url}/>
                    ))}
                </li>
            ))}
        </ul>
    )
}