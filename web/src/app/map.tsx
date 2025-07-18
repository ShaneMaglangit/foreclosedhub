"use client";

import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map as GMap,
  MapCameraChangedEvent,
} from "@vis.gl/react-google-maps";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@web/components/ui/carousel";
import { env } from "@web/env";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChangeEvent,
  ComponentProps,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDebounceCallback, useMediaQuery } from "usehooks-ts";
import { cn, formatNumeric } from "@web/lib/utils/utils";
import Image from "next/image";
import { execute } from "@web/lib/graphql/execute";
import { GetListingsQuery } from "@web/lib/graphql/getListings";
import { useQuery } from "@tanstack/react-query";
import { z, ZodArray, ZodDefault } from "zod";
import {
  type GetListingsQuery as GetListingsQuerySchema,
  OccupancyStatus,
  Source,
} from "@web/lib/graphql/generated/graphql";
import { Input } from "@web/components/ui/input";
import {
  ChevronDown,
  ExternalLink,
  Filter,
  Mailbox,
  PhilippinePeso,
  Search,
} from "lucide-react";
import { Button } from "@web/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@web/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@web/components/ui/sheet";
import { toast } from "sonner";

const occupancyStatusLabel = {
  occupied: "Occupied",
  unoccupied: "Unoccupied",
  unspecified: "Unspecified",
} satisfies Record<OccupancyStatus, string>;

const occupancyStatusBadgeColor = {
  occupied: "bg-red-100 text-red-800",
  unoccupied: "bg-green-100 text-green-800",
  unspecified: "",
} satisfies Record<OccupancyStatus, string>;

const sourceLabel = {
  secbank: "Security Bank",
  pagibig: "Pagibig",
  unionbank: "Unionbank",
} satisfies Record<Source, string>;

const sourceBadgeColor = {
  secbank: "bg-[#caffb9] text-black",
  pagibig: "bg-[#104183] text-white",
  unionbank: "bg-[#ff6f00] text-white",
} satisfies Record<Source, string>;

const defaultZoomLevel = 7;
const philippinesCentralCoordinates = { lat: 12.8797, lng: 121.774 };

const paramsSchema = z.object({
  minLat: z.coerce.number().min(-90).max(90),
  maxLat: z.coerce.number().min(-90).max(90),
  minLng: z.coerce.number().min(-180).max(180),
  maxLng: z.coerce.number().min(-180).max(180),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  occupancyStatuses: z
    .array(z.nativeEnum(OccupancyStatus))
    .default(Object.values(OccupancyStatus)),
  address: z.string().optional(),
});

type Listing = GetListingsQuerySchema["listings"]["nodes"][0];

export default function Map({
  className,
  ...props
}: ComponentProps<typeof GMap>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [filterOpen, setFilterOpen] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [selected, setSelected] = useState<undefined | Listing>();

  const params = useMemo(() => {
    const raw: Record<string, unknown> = {};

    for (const [key, schema] of Object.entries(paramsSchema.shape)) {
      if (isZodArrayType(schema)) {
        const values = searchParams.getAll(key);
        if (values.length) raw[key] = values;
      } else {
        const value = searchParams.get(key);
        if (value !== null) raw[key] = value;
      }
    }

    const parsed = paramsSchema.safeParse(raw);
    return parsed.success ? parsed.data : null;
  }, [searchParams]);

  const { data } = useQuery({
    queryKey: ["listings", params],
    queryFn: () => {
      if (!params) return Promise.resolve(undefined);
      return execute(GetListingsQuery, {
        minLatitude: params.minLat,
        maxLatitude: params.maxLat,
        minLongitude: params.minLng,
        maxLongitude: params.maxLng,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        address: params.address,
        occupancyStatuses: params.occupancyStatuses,
        pageSize: isMobile ? 200 : 500,
      });
    },
    enabled: !!params,
  });

  const updateUrlParams = useCallback(
    ({
      minLat,
      maxLat,
      minLng,
      maxLng,
      minPrice,
      maxPrice,
      address,
      occupancyStatuses,
    }: {
      minLat?: number;
      maxLat?: number;
      minLng?: number;
      maxLng?: number;
      minPrice?: number;
      maxPrice?: number;
      address?: string;
      occupancyStatuses?: OccupancyStatus[];
    }) => {
      const updatedParams = new URLSearchParams(searchParams);

      if (minLat) updatedParams.set("minLat", minLat.toFixed(6));
      if (maxLat) updatedParams.set("maxLat", maxLat.toFixed(6));
      if (minLng) updatedParams.set("minLng", minLng.toFixed(6));
      if (maxLng) updatedParams.set("maxLng", maxLng.toFixed(6));
      if (minPrice) updatedParams.set("minPrice", minPrice.toString());
      if (maxPrice) updatedParams.set("maxPrice", maxPrice.toString());
      if (address) updatedParams.set("address", address);

      if (occupancyStatuses) {
        updatedParams.delete("occupancyStatuses");
        occupancyStatuses?.forEach((occupancyStatus) =>
          updatedParams.append("occupancyStatuses", occupancyStatus),
        );
      }

      router.replace(`?${updatedParams.toString()}`);
    },
    [router, searchParams],
  );

  const deleteUrlParams = useCallback(
    (keys: KeysAsStringLiterals<z.infer<typeof paramsSchema>>) => {
      const updatedParams = new URLSearchParams(searchParams);

      keys.forEach((key) => updatedParams.delete(key));

      router.replace(`?${updatedParams.toString()}`);
    },
    [router, searchParams],
  );

  const handleCameraChange = useDebounceCallback((e: MapCameraChangedEvent) => {
    const bounds = e.detail.bounds;
    updateUrlParams({
      minLat: bounds.south,
      maxLat: bounds.north,
      minLng: bounds.west,
      maxLng: bounds.east,
    });
  }, 500);

  const handleAddressChange = useDebounceCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value) updateUrlParams({ address: e.target.value });
      else deleteUrlParams(["address"]);
    },
    1,
  );

  const handleMinPriceChange = useDebounceCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value)
        updateUrlParams({
          minPrice: z.coerce.number().default(0).parse(e.target.value),
        });
      else deleteUrlParams(["minPrice"]);
    },
    500,
  );

  const handleMaxPriceChange = useDebounceCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value)
        updateUrlParams({
          maxPrice: z.coerce
            .number()
            .default(1_000_000_000)
            .parse(e.target.value),
        });
      else deleteUrlParams(["maxPrice"]);
    },
    500,
  );

  const handleOccupancyStatusCheck = (
    occupancyStatus: OccupancyStatus,
    checked: boolean,
  ) => {
    const currentOccupancyStatuses = params?.occupancyStatuses || [];
    const updatedOccupancyStatuses = checked
      ? [...currentOccupancyStatuses, occupancyStatus]
      : currentOccupancyStatuses.filter((status) => status !== occupancyStatus);

    if (updatedOccupancyStatuses.length > 0)
      updateUrlParams({ occupancyStatuses: updatedOccupancyStatuses });
    else deleteUrlParams(["occupancyStatuses"]);
  };

  useEffect(() => {
    const nodes = data?.listings?.nodes;
    if (nodes) setListings(nodes);
  }, [data]);

  useEffect(() => {
    if (!isMobile) setFilterOpen(false);
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) return;
    toast.custom(() => (
      <div className="flex flex-col items-start gap-1 bg-white p-3 rounded-xl shadow-md">
        <p className="font-semibold">Hey there! 👋</p>
        <p className="text-sm text-muted-foreground">
          For the best experience, we recommend using a laptop or desktop to
          browse the site.
        </p>
      </div>
    ));
  }, []);

  return (
    <APIProvider apiKey={env.NEXT_PUBLIC_MAPS_API_KEY}>
      <div className={cn("h-full w-full flex flex-col", className)}>
        <div className="flex md:hidden items-center p-2">
          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" /> Filters
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-[300px] gap-0">
              <SheetHeader>
                <SheetTitle>Filter</SheetTitle>
              </SheetHeader>
              <div className="p-2">
                <FilterBar
                  params={params}
                  handlers={{
                    handleAddressChange,
                    handleMinPriceChange,
                    handleMaxPriceChange,
                    handleOccupancyStatusCheck,
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <div className="hidden md:flex gap-1 p-2 items-center">
          <FilterBar
            params={params}
            handlers={{
              handleAddressChange,
              handleMinPriceChange,
              handleMaxPriceChange,
              handleOccupancyStatusCheck,
            }}
          />
        </div>
        <GMap
          mapId="f8c223bbf451ffb115f60be0"
          className="flex-1 relative"
          clickableIcons={false}
          defaultCenter={philippinesCentralCoordinates}
          defaultZoom={defaultZoomLevel}
          gestureHandling="greedy"
          disableDefaultUI
          onCameraChanged={handleCameraChange}
          onDrag={() => setSelected(undefined)}
          onClick={() => setSelected(undefined)}
          {...props}
        >
          {listings.map((listing) => (
            <AdvancedMarker
              key={listing.id}
              position={{ lat: listing.latitude, lng: listing.longitude }}
              onClick={() => setSelected({ ...listing })}
            >
              <div className="flex items-center gap-1 rounded-full border border-gray-300 bg-white p-1 text-xs font-medium">
                <div
                  className={cn(
                    "rounded-full p-0.5",
                    getPriceCategoryColor(listing.price),
                  )}
                >
                  <PhilippinePeso className="h-2 w-2" />
                </div>
                {formatNumeric(listing.price)}
              </div>
            </AdvancedMarker>
          ))}
          {selected && (
            <InfoWindow
              headerDisabled={true}
              position={{ lat: selected.latitude, lng: selected.longitude }}
              pixelOffset={[0, -22]}
              minWidth={isMobile ? undefined : 400}
              maxWidth={isMobile ? undefined : 400}
            >
              {selected.images?.length > 0 && (
                <Carousel opts={{ watchDrag: false }}>
                  <CarouselContent>
                    {selected.images.map((image) => (
                      <CarouselItem key={image.id}>
                        <Image
                          src={image.url}
                          width={400}
                          height={300}
                          alt="image of the selected property"
                          className="w-full aspect-[4/3]"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              )}
              <div className="bg-card text-card-foreground p-4 space-y-3 w-full max-w-md">
                <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-1 items-start">
                  <div className="flex-1 text-xl font-semibold text-primary leading-tight">
                    ₱{formatNumeric(selected.price)}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <span
                      className={cn(
                        "text-xs bg-muted px-2 py-0.5 rounded font-semibold",
                        sourceBadgeColor[selected.source],
                      )}
                    >
                      {sourceLabel[selected.source]}
                    </span>
                    {selected.occupancyStatus !== "unspecified" && (
                      <span
                        className={cn(
                          "text-xs bg-muted px-2 py-0.5 rounded font-semibold",
                          occupancyStatusBadgeColor[selected.occupancyStatus],
                        )}
                      >
                        {occupancyStatusLabel[selected.occupancyStatus]}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {selected.address}
                </div>
                <div className="flex flex-col md:grid md:grid-cols-3 gap-2 md:gap-4 pt-2 text-sm">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Floor Area
                    </span>
                    <span className="text-foreground">
                      {selected.floorArea} sqm
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Lot Area
                    </span>
                    <span className="text-foreground">
                      {selected.lotArea} sqm
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 items-start">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Actions
                    </span>
                    {selected.source === "secbank" && (
                      <SecbankOfferButton listing={selected} />
                    )}
                    {selected.source === "pagibig" && (
                      <PagibigFormButton listing={selected} />
                    )}
                    {selected.source === "unionbank" && (
                      <UnionbankOfferButton listing={selected} />
                    )}
                  </div>
                </div>
              </div>
            </InfoWindow>
          )}
        </GMap>
      </div>
    </APIProvider>
  );
}

function FilterBar({ params, handlers }: { params: any; handlers: any }) {
  return (
    <div className="w-full flex flex-col gap-2 md:flex-row md:items-center md:gap-1">
      <SearchInput
        className="flex-1 max-w-[500px]"
        placeholder="Address"
        onChange={handlers.handleAddressChange}
        defaultValue={params?.address}
      />
      <Input
        className="w-full md:w-[150px]"
        placeholder="Minimum Price"
        type="number"
        onChange={handlers.handleMinPriceChange}
        defaultValue={params?.minPrice}
      />
      <Input
        className="w-full md:w-[150px]"
        placeholder="Maximum Price"
        type="number"
        onChange={handlers.handleMaxPriceChange}
        defaultValue={params?.maxPrice}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="flex justify-between" variant="outline">
            Occupancy Status <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          {Object.values(OccupancyStatus).map((status) => (
            <DropdownMenuCheckboxItem
              key={status}
              checked={params?.occupancyStatuses.includes(status)}
              onCheckedChange={(checked) =>
                handlers.handleOccupancyStatusCheck(status, checked)
              }
              onSelect={(e) => e.preventDefault()}
            >
              {occupancyStatusLabel[status]}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="link" asChild>
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLScnO8sK4I05BtWG7iE8s4wiSLEjCxhWdiToaZrLLr3ssQRuHw/viewform?usp=header"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline md:ml-auto"
        >
          <Mailbox /> Join Mailing List
        </a>
      </Button>
    </div>
  );
}

function UnionbankOfferButton({ listing }: { listing: Listing }) {
  const url = `https://www.unionbankph.com/foreclosed-properties/${listing.externalId}`;
  return (
    <Button
      variant="link"
      className="text-blue-600 underline h-auto has-[>svg]:p-0"
      size="sm"
      asChild
    >
      <a href={url.toString()} target="_blank">
        <ExternalLink /> More details
      </a>
    </Button>
  );
}

function SecbankOfferButton({ listing }: { listing: Listing }) {
  const url = new URL(
    "https://www.securitybank.com/personal/loans/repossessed-assets/properties-for-sale/offer-form",
  );

  url.searchParams.set("tfa_4", listing.lotArea.toString() + "sqms");
  url.searchParams.set("tfa_6", listing.address);
  url.searchParams.set("tfa_7", listing.floorArea.toString() + "sqms");
  url.searchParams.set("tfa_9", listing.price.toString());

  return (
    <Button
      variant="link"
      className="text-blue-600 underline h-auto has-[>svg]:p-0"
      size="sm"
      asChild
    >
      <a href={url.toString()} target="_blank">
        <ExternalLink /> Submit offer
      </a>
    </Button>
  );
}

function PagibigFormButton({ listing }: { listing: Listing }) {
  const rawPayload = JSON.parse(listing.payload);
  const batchNumber = rawPayload.batch_number;
  const flag = "3"; // I have no clue what does this mean, this was derived straight from PagibigFund's source code.
  const hbc =
    rawPayload.status === "1" || rawPayload.status === "2"
      ? batchNumber.substring(3, 5)
      : batchNumber.substring(0, 2);

  return (
    <form
      method="POST"
      action="https://www.pagibigfundservices.com/OnlinePublicAuction/Bidding/Login"
      target="_blank"
    >
      <input type="hidden" name="batchNo" value={batchNumber} />
      <input type="hidden" name="ropaId" value={listing.externalId} />
      <input type="hidden" name="flag" value={flag} />
      <input type="hidden" name="hbc" value={hbc} />
      <Button variant="link" size="sm" className="h-auto has-[>svg]:p-0">
        <ExternalLink /> Submit offer
      </Button>
    </form>
  );
}

function SearchInput({ className, ...props }: ComponentProps<typeof Input>) {
  return (
    <div className={cn("relative w-full", className)}>
      <Input className="pr-9" placeholder="Search..." {...props} />
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
    </div>
  );
}

function getPriceCategoryColor(price: number): string {
  if (price < 500_000) return "bg-gray-200 text-black";
  if (price < 1_000_000) return "bg-green-400 text-black";
  if (price < 5_000_000) return "bg-green-600 text-white";
  if (price < 10_000_000) return "bg-amber-400 text-white";
  return "bg-amber-500 text-white";
}

function isZodArrayType(schema: any): schema is ZodArray<any> {
  if (schema instanceof ZodArray) return true;
  return (
    schema instanceof ZodDefault && schema._def.innerType instanceof ZodArray
  );
}
