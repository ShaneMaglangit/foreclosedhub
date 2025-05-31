import {ComponentProps} from "react";
import {getListing} from "@web/lib/grpc/getListing";
import {cn} from "@web/lib/utils/cn";

export async function Preview({listingId, className, ...props}: { listingId: number } & ComponentProps<"div">) {
    const selectedListing = await getListing(listingId)

    return (
        <div className={cn("bg-white p-2", className)} {...props}>
            {selectedListing ? (
                <ul>
                    <li>Price: {selectedListing.price}</li>
                    <li>Address: {selectedListing.address}</li>
                </ul>
            ) : (
                <p>Something went wrong</p>
            )}
        </div>
    )
}