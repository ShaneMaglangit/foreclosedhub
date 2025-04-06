import {Button} from "@web/components/button";
import {getListings} from "@web/grpc/client";
import Link from "next/link";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@web/components/carousel";

type Props = {
    searchParams?: {
        after?: number,
        before?: number,
        limit?: number,
    }
}

export default async function Page(props: Props) {
    const {after = 0, before = 0, limit = 20} = props.searchParams || {}
    const {listings, pageInfo} = await getListings({after, before, limit})

    return (
        <>
            {pageInfo?.hasPrevPage && (
                <Button asChild>
                    <Link href={`/?before=${pageInfo?.startCursor}&limit=${limit}`}>
                        Previous
                    </Link>
                </Button>
            )}
            {pageInfo?.hasNextPage && (
                <Button asChild>
                    <Link href={`/?after=${pageInfo?.endCursor}&limit=${limit}`}>
                        Next
                    </Link>
                </Button>
            )}
            <div className="grid grid-cols-5 gap-4 p-4">
                {
                    listings.map((listing) => (
                        <div key={listing.id}>
                            <h2 className='text-xl'>
                                <strong>₱ {formatToPhilippineNumeric(listing.price)}</strong> - {listing.address}
                            </h2>
                            <Carousel>
                                <CarouselContent>
                                    {listing.imageUrls.map((url, index) => (
                                        <CarouselItem key={index}>
                                            <img src={url} alt="property preview"/>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious variant="primary"/>
                                <CarouselNext variant="primary"/>
                            </Carousel>
                        </div>
                    ))
                }
            </div>
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