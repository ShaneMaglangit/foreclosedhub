"use client";

import * as React from "react";
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
import { ChevronRight } from "lucide-react";
import { useFilter } from "@web/app/use-filter";
import { Checkbox } from "@web/components/common/checkbox";
import { Source, sources } from "@web/types/source";
import {
  OccupancyStatus,
  occupancyStatuses,
} from "@web/types/occupancy-status";
import { typedEntries } from "@web/lib/utils";

const sourceLabel = {
  Pagibig: "Pagibig Fund",
} satisfies Record<Source, string>;

const occupancyStatusLabel = {
  Occupied: "Occupied",
  Unoccupied: "Unoccupied",
  Unspecified: "Unspecified",
} satisfies Record<OccupancyStatus, string>;

export function Filters({ initialFilters }: { initialFilters: ListingParams }) {
  const { filters, setSearch, setSources, setOccupancyStatuses } =
    useFilter(initialFilters);

  const handleSourceChange = (source: string) => {
    const updatedSources = filters.sources.includes(source)
      ? filters.sources.filter((source) => source !== source)
      : [...filters.sources, source];

    setSources(updatedSources);
  };

  const handleOccupancyStatusChange = (status: string) => {
    const updatedStatuses = filters.occupancyStatuses.includes(status)
      ? filters.occupancyStatuses.filter((s) => s !== status)
      : [...filters.occupancyStatuses, status];

    setOccupancyStatuses(updatedStatuses);
  };

  return (
    <>
      <SidebarGroup>
        <SearchForm
          defaultValue={filters.search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SidebarGroup>
      <SidebarSeparator className="mx-0" />
      <SourceFilters
        currentValues={filters.sources}
        onCheckChanged={handleSourceChange}
      />
      <SidebarSeparator className="mx-0" />
      <OccupancyStatusFilters
        currentValues={filters.occupancyStatuses}
        onCheckChanged={handleOccupancyStatusChange}
      />
      <SidebarSeparator className="mx-0" />
    </>
  );
}

function SourceFilters({
  currentValues,
  onCheckChanged,
}: {
  currentValues: string[];
  onCheckChanged: (value: string) => unknown;
}) {
  return (
    <SidebarGroup>
      <Collapsible className="group/collapsible">
        <SidebarGroupLabel
          asChild
          className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full "
        >
          <CollapsibleTrigger>
            Source
            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
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
          </SidebarGroupContent>
        </CollapsibleContent>
      </Collapsible>
    </SidebarGroup>
  );
}

function OccupancyStatusFilters({
  currentValues,
  onCheckChanged,
}: {
  currentValues: string[];
  onCheckChanged: (value: string) => unknown;
}) {
  return (
    <SidebarGroup>
      <Collapsible className="group/collapsible">
        <SidebarGroupLabel
          asChild
          className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full "
        >
          <CollapsibleTrigger>
            Occupancy Status
            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
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
          </SidebarGroupContent>
        </CollapsibleContent>
      </Collapsible>
    </SidebarGroup>
  );
}
