import {getListings} from "@web/grpc/client";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@web/components/carousel";
import Image from "next/image"
import {Card, CardContent, CardDescription, CardTitle} from "@web/components/card";
import {formatNumeric} from "@web/lib/utils";

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
        <div className="grid grid-cols-5 gap-4 px-4 pb-4">
            {listings.map((listing) => (
                <Card key={listing.id}>
                    <Carousel>
                        <CarouselContent>
                            {listing.imageUrls.map((url, index) => (
                                <CarouselItem key={index}>
                                    <Image
                                        src={url}
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                        }}
                                        width={500}
                                        height={300}
                                        alt="property image"
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious/>
                        <CarouselNext/>
                    </Carousel>
                    <CardContent className="flex flex-col gap-1">
                        <CardTitle className="truncate">{listing.address}</CardTitle>
                        <CardDescription>₱ {formatNumeric(listing.price)}</CardDescription>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}