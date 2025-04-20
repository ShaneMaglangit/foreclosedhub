"use client";

import * as React from "react";
import { ChangeEvent, ComponentProps } from "react";
import { ListingParams } from "@web/app/schema";
import { SearchForm } from "@web/components/search-form";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@web/components/common/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@web/components/common/collapsible";
import { ChevronRight, Star } from "lucide-react";
import { useFilter } from "@web/app/use-filter";
import { Checkbox } from "@web/components/common/checkbox";
import { Source, sources } from "@web/types/source";
import {
  OccupancyStatus,
  occupancyStatuses,
} from "@web/types/occupancy-status";
import { typedEntries } from "@web/lib/utils";
import { Input } from "@web/components/common/input";
import { ListingStatus, listingStatuses } from "@web/types/listing-status";
import { Button } from "@web/components/common/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@web/components/common/alert-dialog";

export function Filters({ initialFilters }: { initialFilters: ListingParams }) {
  const {
    filters,
    setSearch,
    toggleSource,
    toggleOccupancyStatus,
    toggleStatus,
    setMinPrice,
    setMaxPrice,
  } = useFilter(initialFilters);

  return (
    <>
      <SidebarGroup>
        <SearchForm
          defaultValue={filters.search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SidebarGroup>
      <SidebarSeparator className="mx-0" />
      <SourceFilter
        currentValues={filters.sources}
        onCheckChanged={toggleSource}
      />
      <SidebarSeparator className="mx-0" />
      <OccupancyStatusFilter
        currentValues={filters.occupancyStatuses}
        onCheckChanged={toggleOccupancyStatus}
      />
      <SidebarSeparator className="mx-0" />
      <ListingStatusFilter
        currentValues={filters.statuses}
        onCheckChanged={toggleStatus}
      />
      <SidebarSeparator className="mx-0" />
      <PriceRangeFilter
        currentMin={filters.minPrice}
        currentMax={filters.maxPrice}
        onMinChange={setMinPrice}
        onMaxChange={setMaxPrice}
      />
      <SidebarSeparator className="mx-0" />
    </>
  );
}

const sourceLabel = {
  Pagibig: "Pagibig Fund",
  Secbank: "Security Bank",
} satisfies Record<Source, string>;

function SourceFilter({
  currentValues,
  onCheckChanged,
}: {
  currentValues: string[];
  onCheckChanged: (value: string) => unknown;
}) {
  const premiumSources = ["UnionBank", "BDO", "RCBC"];

  return (
    <SidebarFilterGroup title="Source">
      {typedEntries(sources).map(([key, value]) => (
        <label
          key={key}
          className="flex gap-2 p-2 hover:bg-accent cursor-pointer"
        >
          <Checkbox
            defaultChecked={currentValues.includes(value)}
            onCheckedChange={() => onCheckChanged(value)}
          />
          <span className="text-sm font-medium leading-none">
            {sourceLabel[key]}
          </span>
        </label>
      ))}

      {premiumSources.map((source) => (
        <AlertDialog key={source}>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 has-[>svg]:pl-2"
              size="sm"
            >
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium leading-none">{source}</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Get Early Access to {source} Listings
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base">
                Properties from {source} will soon be available through our
                premium service. Be the first to know when it launches—join the
                waitlist today.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="flex-1">Close</AlertDialogCancel>
              <AlertDialogAction asChild>
                <a
                  href="https://forms.gle/BDu3ZLiAquWGcNJr8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  Join Waitlist
                </a>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ))}
    </SidebarFilterGroup>
  );
}

const occupancyStatusLabel = {
  Occupied: "Occupied",
  Unoccupied: "Unoccupied",
  Unspecified: "Unspecified",
} satisfies Record<OccupancyStatus, string>;

function OccupancyStatusFilter({
  currentValues,
  onCheckChanged,
}: {
  currentValues: string[];
  onCheckChanged: (value: string) => unknown;
}) {
  return (
    <SidebarFilterGroup title="Occupancy Status">
      {typedEntries(occupancyStatuses).map(([key, value]) => (
        <label
          key={key}
          className="flex gap-2 p-2 hover:bg-accent cursor-pointer"
        >
          <Checkbox
            defaultChecked={currentValues.includes(value)}
            onCheckedChange={() => onCheckChanged(value)}
          />
          <span className="text-sm font-medium leading-none">
            {occupancyStatusLabel[key]}
          </span>
        </label>
      ))}
    </SidebarFilterGroup>
  );
}

const listingStatusLabel = {
  Active: "Active",
  Unlisted: "Unlisted",
} satisfies Record<ListingStatus, string>;

function ListingStatusFilter({
  currentValues,
  onCheckChanged,
}: {
  currentValues: string[];
  onCheckChanged: (value: string) => unknown;
}) {
  return (
    <SidebarFilterGroup title="Listing Status">
      {typedEntries(listingStatuses).map(([key, value]) => (
        <label
          key={key}
          className="flex gap-2 p-2 hover:bg-accent cursor-pointer"
        >
          <Checkbox
            defaultChecked={currentValues.includes(value)}
            onCheckedChange={() => onCheckChanged(value)}
          />
          <span className="text-sm font-medium leading-none">
            {listingStatusLabel[key]}
          </span>
        </label>
      ))}
    </SidebarFilterGroup>
  );
}

function PriceRangeFilter({
  currentMin,
  currentMax,
  onMinChange,
  onMaxChange,
}: {
  currentMin?: number;
  currentMax?: number;
  onMinChange: (value?: number) => unknown;
  onMaxChange: (value?: number) => unknown;
}) {
  const handleMinChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    onMinChange(target.value ? parseInt(target.value) : undefined);
  };

  const handleMaxChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    onMaxChange(target.value ? parseInt(target.value) : undefined);
  };

  return (
    <SidebarFilterGroup title="Price Range">
      <div className="flex gap-2 p-2">
        <label className="flex flex-col gap-2">
          <span>Minimum</span>
          <Input
            type="number"
            className="truncate"
            min="0"
            max={Number.MAX_SAFE_INTEGER}
            defaultValue={currentMin}
            placeholder="Enter min price"
            onChange={handleMinChange}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span>Maximum</span>
          <Input
            type="number"
            className="truncate"
            min={currentMin}
            max={Number.MAX_SAFE_INTEGER}
            defaultValue={currentMax}
            placeholder="Enter max price"
            onChange={handleMaxChange}
          />
        </label>
      </div>
    </SidebarFilterGroup>
  );
}

function SidebarFilterGroup({
  title,
  children,
  ...props
}: { title: string } & ComponentProps<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <Collapsible className="group/collapsible">
        <SidebarGroupLabel
          asChild
          className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full "
        >
          <CollapsibleTrigger>
            {title}
            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>{children}</SidebarGroupContent>
        </CollapsibleContent>
      </Collapsible>
    </SidebarGroup>
  );
}
