import {getListings} from "web/grpc/client";

export default async function Page() {
    const listings = await getListings()
    return (
        <>
            {
                listings.map((listing) => (
                    <div key={listing.id}>
                        <h2 className='text-xl'>
                            <strong>₱ {formatToPhilippineNumeric(listing.price)}</strong> - {listing.address}
                        </h2>
                        <div className="grid grid-cols-4 gap-2">
                            {listing.imageUrls.map((url, index) => (
                                <img key={index} src={url} alt="property preview"/>

                            ))}
                        </div>
                    </div>
                ))
            }
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