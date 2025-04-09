"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@web/components/common/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@web/components/common/sidebar";
import { SearchForm } from "@web/components/search-form";
import { Checkbox } from "@web/components/common/checkbox";

export function Filters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const sourceParams = searchParams.getAll("source");
  const isPagibigChecked = sourceParams.includes("pagibig");

  const updateSource = (value: string, shouldAdd: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    const values = params.getAll("source");
    params.delete("source");

    const updated = shouldAdd
      ? [...new Set([...values, value])]
      : values.filter((v) => v !== value);

    updated.forEach((v) => params.append("source", v));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div>
      <SidebarGroup>
        <SearchForm defaultValue={searchParams.get("search") || ""} />
      </SidebarGroup>
      <SidebarSeparator className="mx-0" />
      <SidebarGroup>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroupLabel
            asChild
            className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full text-sm"
          >
            <CollapsibleTrigger>
              Source
              <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
            <SidebarGroupContent>
              <label className="flex gap-2 p-2 hover:bg-accent cursor-pointer">
                <Checkbox
                  checked={isPagibigChecked}
                  onCheckedChange={(checked) =>
                    updateSource("pagibig", !!checked)
                  }
                />
                <span className="text-sm font-medium leading-none">
                  Pagibig Fund
                </span>
              </label>
            </SidebarGroupContent>
          </CollapsibleContent>
        </Collapsible>
      </SidebarGroup>
    </div>
  );
}
