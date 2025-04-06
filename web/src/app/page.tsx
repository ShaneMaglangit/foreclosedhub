import {Button} from "web/components/button";
import {getListings} from "web/grpc/client";

export default async function Page(props: {
    searchParams?: {
        after?: number,
        before?: number,
        limit?: number,
    }
}) {
    const {after = 0, before = 0, limit = 20} = props.searchParams || {}
    const {listings, pageInfo} = await getListings({after, before, limit})

    return (
        <>
            {
                listings.map((listing) => (
                    <div key={listing.id}>
                        <h2 className='text-xl'>
                            <strong>₱ {formatToPhilippineNumeric(listing.price)}</strong> - {listing.address}
                        </h2>
                        <div className="grid grid-cols-8 gap-2">
                            {listing.imageUrls.map((url, index) => (
                                <img key={index} src={url} alt="property preview"/>
                            ))}
                        </div>
                    </div>
                ))
            }
            {pageInfo?.hasPrevPage && (
                <Button as='link' href={`/?before=${pageInfo?.startCursor}&limit=${limit}`}>
                    Previous
                </Button>
            )}
            {pageInfo?.hasNextPage && (
                <Button as='link' href={`/?after=${pageInfo?.endCursor}&limit=${limit}`}>
                    Next
                </Button>
            )}
        </>
    )
}

function formatToPhilippineNumeric(
    input: string | number,
    decimals: number = 2
): string {
    const cleaned = input.toString().replace(/[^0-9.-]/g, "");

    const number = parseFloat(cleaned);
    if (isNaN(number)) return "0.00";

    return number.toLocaleString("en-PH", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}