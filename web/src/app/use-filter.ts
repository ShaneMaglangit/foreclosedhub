import { ListingParam } from "@web/app/schema";
import { usePathname, useRouter } from "next/navigation";

export function useFilter(initial: ListingParam) {
  const pathname = usePathname();
  const router = useRouter();

  const filters = { ...initial };

  const appendArrayParam = (
    key: string,
    value: string[] | undefined,
    urlParams: URLSearchParams,
  ) => {
    if (value && value.length > 0) {
      value.forEach((v) => urlParams.append(key, v));
    }
  };

  const updateFilter = (updatedFilters: ListingParam) => {
    const urlParams = new URLSearchParams();

    if (updatedFilters.search) urlParams.set("search", updatedFilters.search);
    if (updatedFilters.before) {
      urlParams.set("before", updatedFilters.before.toString());
    }
    if (updatedFilters.after) {
      urlParams.set("after", updatedFilters.after.toString());
    }
    if (updatedFilters.limit) {
      urlParams.set("limit", updatedFilters.limit.toString());
    }

    appendArrayParam(
      "occupancyStatuses",
      updatedFilters.occupancyStatuses,
      urlParams,
    );
    appendArrayParam("sources", updatedFilters.sources, urlParams);

    router.push(`${pathname}?${urlParams.toString()}`);
  };

  const setSearch = (search: string) => {
    updateFilter({ ...filters, search });
  };

  const setSources = (newSources: string[]) => {
    updateFilter({ ...filters, sources: newSources });
  };

  const setOccupancyStatuses = (newOccupancyStatuses: string[]) => {
    updateFilter({ ...filters, occupancyStatuses: newOccupancyStatuses });
  };

  return {
    filters,
    setSearch,
    setSources,
    setOccupancyStatuses,
  };
}
