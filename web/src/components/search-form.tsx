"use client";

import { Search } from "lucide-react";

import { Label } from "@web/components/common/label";
import { SidebarInput } from "@web/components/common/sidebar";
import { ComponentProps } from "react";
import { cn } from "@web/lib/utils";

type Props = ComponentProps<typeof SidebarInput> & {
  parentProps?: ComponentProps<"div">;
};

export function SearchForm({
  parentProps: { className, ...parentProps } = {},
  ...props
}: Props) {
  return (
    <div className={cn("relative", className)} {...parentProps}>
      <Label htmlFor="search" className="sr-only">
        Search
      </Label>
      <SidebarInput
        id="search"
        placeholder="Type to search..."
        className="h-8 pl-7"
        {...props}
      />
      <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
    </div>
  );
}
