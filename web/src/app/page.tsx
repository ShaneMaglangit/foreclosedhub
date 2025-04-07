import {getListings} from "@web/grpc/client";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@web/components/carousel";
import Image from "next/image"
import {Card, CardContent, CardDescription, CardTitle} from "@web/components/card";
import {formatNumeric} from "@web/lib/utils";
import {SidebarTrigger} from "@web/components/sidebar";
import {Separator} from "@web/components/separator";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@web/components/breadcrumb";
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

    console.log(pageInfo)

    return (
        <>
            <header
                className="flex h-16 shrink-0 items-center gap-4 px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex flex-1 items-center gap-2">
                    <SidebarTrigger className="cursor-pointer -ml-1"/>
                    <Separator orientation="vertical" className="mr-2 h-4"/>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbPage>Listings</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className="flex gap-1">
                    {pageInfo?.hasPrevPage && (
                        <Button asChild>
                            <Link href={`/?before=${pageInfo?.startCursor}&limit=${limit}`}>
                                Back
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
                </div>
            </header>
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
                                                height: '300px',
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
        </>
    )
}