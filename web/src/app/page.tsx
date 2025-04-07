import {getListings} from "@web/grpc/client";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@web/components/carousel";
import Link from "next/link";
import {Button} from "@web/components/button";

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
        <div className="py-16">
            <div className="grid grid-cols-3 gap-6 p-6">
                {listings.map((listing) => (
                    <div key={listing.id} className="flex flex-col gap-2">
                        <Carousel className="rounded-lg overflow-hidden">
                            <CarouselContent>
                                {listing.imageUrls.map((url, index) => (
                                    <CarouselItem key={index}>
                                        <img src={url} alt="property preview"/>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious/>
                            <CarouselNext/>
                        </Carousel>
                        <h4 className="font-semibold truncate">{listing.address}</h4>
                        <p className="font-semibold">₱ {formatToPhilippineNumeric(listing.price)}</p>
                    </div>
                ))}
            </div>
            <div className="flex">
                <Button asChild className="w-full" disabled={pageInfo?.hasPrevPage}>
                    <Link href={`/?before=${pageInfo?.startCursor}&limit=${limit}`}>
                        Previous
                    </Link>
                </Button>
                <Button asChild className="w-full" disabled={pageInfo?.hasNextPage}>
                    <Link href={`/?after=${pageInfo?.endCursor}&limit=${limit}`}>
                        Next
                    </Link>
                </Button>
            </div>
        </div>
    )
}

function formatToPhilippineNumeric(
    input: string | number,
): string {
    const cleaned = input.toString().replace(/[^0-9.-]/g, "");

    const number = parseFloat(cleaned);
    if (isNaN(number)) return "0";

    return number.toLocaleString("en-PH", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
}