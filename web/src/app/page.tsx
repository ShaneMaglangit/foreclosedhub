import {getListings} from "@web/grpc/client";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@web/components/carousel";
import Image from "next/image"
import {Card, CardContent, CardDescription, CardTitle} from "@web/components/card";
import {formatNumeric} from "@web/lib/utils";
import {Button} from "@web/components/button";
import Link from "next/link";

type Props = {
    searchParams?: {
        after?: number,
        before?: number,
        limit?: number,
    }
}

export default async function Page({searchParams}: Props) {
    const {after = 0, before = 0, limit = 20} = (await searchParams) || {}
    const {listings, pageInfo} = await getListings({after, before, limit})

    return (
        <>
            <header
                className="sticky top-0 z-10 bg-sidebar flex shrink-0 items-center justify-end gap-3 p-3 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex gap-1">
                    {pageInfo?.hasPrevPage && (
                        <Button asChild size="sm">
                            <Link href={`/?before=${pageInfo?.startCursor}&limit=${limit}`}>
                                Back
                            </Link>
                        </Button>
                    )}
                    {pageInfo?.hasNextPage && (
                        <Button asChild size="sm">
                            <Link href={`/?after=${pageInfo?.endCursor}&limit=${limit}`}>
                                Next
                            </Link>
                        </Button>
                    )}
                </div>
            </header>
            <div className="grid grid-cols-5 gap-3 p-3">
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
                                                height: '300px',
                                            }}
                                            width={500}
                                            height={300}
                                            alt="property image"
                                        />
                                    </CarouselItem>
                                ))}
                                {listing.imageUrls.length === 0 && (
                                    <CarouselItem>
                                        <Image
                                            src="/placeholder.png"
                                            style={{
                                                width: '100%',
                                                height: '300px',
                                            }}
                                            width={500}
                                            height={300}
                                            alt="property image"
                                        />
                                    </CarouselItem>
                                )}
                            </CarouselContent>
                            <CarouselPrevious/>
                            <CarouselNext/>
                        </Carousel>
                        <CardContent className="flex flex-col gap-1">
                            <CardTitle className="capitalize truncate">{listing.address.toLowerCase()}</CardTitle>
                            <CardDescription>₱ {formatNumeric(listing.price)}</CardDescription>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    )
}