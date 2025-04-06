"use client"

import * as React from "react"
import useEmblaCarousel, {
    type UseEmblaCarouselType,
} from "embla-carousel-react"
import {ChevronLeft, ChevronRight} from "lucide-react"

import {cn} from "@web/lib/utils"
import {Button} from "@web/components/button"
import {
    ComponentProps,
    createContext,
    forwardRef,
    HTMLAttributes,
    useCallback,
    useContext,
    useEffect,
    useState,
    KeyboardEvent
} from "react";

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
    opts?: CarouselOptions
    plugins?: CarouselPlugin
    setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
    carouselRef: ReturnType<typeof useEmblaCarousel>[0]
    api: ReturnType<typeof useEmblaCarousel>[1]
    scrollPrev: () => void
    scrollNext: () => void
    canScrollPrev: boolean
    canScrollNext: boolean
} & CarouselProps

const CarouselContext = createContext<CarouselContextProps | null>(null)

function useCarousel() {
    const context = useContext(CarouselContext)

    if (!context) {
        throw new Error("useCarousel must be used within a <Carousel />")
    }

    return context
}

const Carousel = forwardRef<
    HTMLDivElement,
    HTMLAttributes<HTMLDivElement> & CarouselProps
>(
    (
        {
            opts,
            setApi,
            plugins,
            className,
            children,
            ...props
        },
        ref
    ) => {
        const [carouselRef, api] = useEmblaCarousel(
            {
                ...opts,
                axis: "x"
            },
            plugins
        )
        const [canScrollPrev, setCanScrollPrev] = useState(false)
        const [canScrollNext, setCanScrollNext] = useState(false)

        const onSelect = useCallback((api: CarouselApi) => {
            if (!api) {
                return
            }

            setCanScrollPrev(api.canScrollPrev())
            setCanScrollNext(api.canScrollNext())
        }, [])

        const scrollPrev = useCallback(() => {
            api?.scrollPrev()
        }, [api])

        const scrollNext = useCallback(() => {
            api?.scrollNext()
        }, [api])

        const handleKeyDown = useCallback(
            (event: KeyboardEvent<HTMLDivElement>) => {
                if (event.key === "ChevronLeft") {
                    event.preventDefault()
                    scrollPrev()
                } else if (event.key === "ChevronRight") {
                    event.preventDefault()
                    scrollNext()
                }
            },
            [scrollPrev, scrollNext]
        )

        useEffect(() => {
            if (!api || !setApi) {
                return
            }

            setApi(api)
        }, [api, setApi])

        useEffect(() => {
            if (!api) {
                return
            }

            onSelect(api)
            api.on("reInit", onSelect)
            api.on("select", onSelect)

            return () => {
                api?.off("select", onSelect)
            }
        }, [api, onSelect])

        return (
            <CarouselContext.Provider
                value={{
                    carouselRef,
                    api: api,
                    opts,
                    scrollPrev,
                    scrollNext,
                    canScrollPrev,
                    canScrollNext,
                }}
            >
                <div
                    ref={ref}
                    onKeyDownCapture={handleKeyDown}
                    className={cn("relative", className)}
                    role="region"
                    aria-roledescription="carousel"
                    {...props}
                >
                    {children}
                </div>
            </CarouselContext.Provider>
        )
    }
)
Carousel.displayName = "Carousel"

const CarouselContent = forwardRef<
    HTMLDivElement,
    HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => {
    const {carouselRef} = useCarousel()

    return (
        <div ref={carouselRef} className="overflow-hidden">
            <div
                ref={ref}
                className={cn(
                    "flex",
                    "-ml-4",
                    className
                )}
                {...props}
            />
        </div>
    )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = forwardRef<
    HTMLDivElement,
    HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => {
    const {canScrollNext, canScrollPrev} = useCarousel()
    return (
        <div
            ref={ref}
            role="group"
            aria-roledescription="slide"
            className={cn(
                "min-w-0 shrink-0 grow-0 basis-full pl-4",
                canScrollNext || canScrollPrev ? "cursor-grab" : "",
                className
            )}
            {...props}
        />
    )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = forwardRef<
    HTMLButtonElement,
    ComponentProps<typeof Button>
>(({className, variant = "default", size = "icon", ...props}, ref) => {
    const {scrollPrev, canScrollPrev} = useCarousel()

    if (!canScrollPrev) return <></>

    return (
        <Button
            ref={ref}
            variant={variant}
            size={size}
            className={cn(
                "absolute opacity-80 hover:opacity-100 rounded-full left-4 top-1/2 -translate-y-1/2",
                className
            )}
            onClick={scrollPrev}
            {...props}
        >
            <ChevronLeft/>
            <span className="sr-only">Previous slide</span>
        </Button>
    )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = forwardRef<
    HTMLButtonElement,
    ComponentProps<typeof Button>
>(({className, variant = "default", size = "icon", ...props}, ref) => {
    const {scrollNext, canScrollNext} = useCarousel()

    if (!canScrollNext) return <></>

    return (
        <Button
            ref={ref}
            variant={variant}
            size={size}
            className={cn(
                "absolute opacity-80 hover:opacity-100 rounded-full right-4 top-1/2 -translate-y-1/2",
                className
            )}
            onClick={scrollNext}
            {...props}
        >
            <ChevronRight/>
            <span className="sr-only">Next slide</span>
        </Button>
    )
})
CarouselNext.displayName = "CarouselNext"

export {
    type CarouselApi,
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
}
