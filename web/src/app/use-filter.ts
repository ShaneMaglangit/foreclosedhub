import { ListingParams } from "@web/app/schema";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useFilter(initial: ListingParams) {
  const pathname = usePathname();
  const router = useRouter();

  const [filters, setFilters] = useState(initial);

  const setArrayParam = (
    key: string,
    value: string[] | undefined,
    urlParams: URLSearchParams,
  ) => {
    if (!value || value.length === 0) return;
    value.forEach((v) => urlParams.append(key, v));
  };

  const setSearch = (search: string) => {
    setFilters({ ...filters, search });
  };

  const toggleSourceChange = (source: string) => {
    const updatedSources = filters.sources.includes(source)
      ? filters.sources.filter((source) => source !== source)
      : [...filters.sources, source];

    setFilters({ ...filters, sources: updatedSources });
  };

  const toggleOccupancyStatusChange = (status: string) => {
    const updatedStatuses = filters.occupancyStatuses.includes(status)
      ? filters.occupancyStatuses.filter((s) => s !== status)
      : [...filters.occupancyStatuses, status];

    setFilters({ ...filters, occupancyStatuses: updatedStatuses });
  };

  const setMinPrice = (value?: number) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: value,
    }));
  };

  const setMaxPrice = (value?: number) => {
    setFilters((prev) => ({
      ...prev,
      maxPrice: value,
    }));
  };

  useEffect(() => {
    const {
      search,
      sources,
      occupancyStatuses,
      minPrice,
      maxPrice,
      before,
      after,
      limit,
    } = filters;

    const urlParams = new URLSearchParams();

    if (search) urlParams.set("search", search);
    if (before) urlParams.set("before", before.toString());
    if (after) urlParams.set("after", after.toString());
    if (limit) urlParams.set("limit", limit.toString());
    if (minPrice) urlParams.set("minPrice", minPrice.toString());
    if (maxPrice) urlParams.set("maxPrice", maxPrice.toString());

    setArrayParam("occupancyStatuses", occupancyStatuses, urlParams);
    setArrayParam("sources", sources, urlParams);

    router.push(`${pathname}?${urlParams.toString()}`);
  }, [pathname, router, filters]);

  return {
    filters,
    setSearch,
    toggleSourceChange,
    toggleOccupancyStatusChange,
    setMinPrice,
    setMaxPrice,
  };
}
