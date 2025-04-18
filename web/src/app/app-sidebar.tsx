import * as React from "react";
import { ComponentProps } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@web/components/common/sidebar";
import { NavUtility } from "@web/components/nav-utility";
import { Filters } from "@web/app/filters";
import Link from "next/link";
import { Logo } from "@web/assets/logo";
import { ListingParams } from "@web/app/schema";

export function AppSidebar({
  params,
  ...props
}: ComponentProps<typeof Sidebar> & {
  params: ListingParams;
}) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="bg-foreground text-background border-sidebar-border h-16 border-b justify-center">
        <Link href="/" className="flex gap-2">
          <Logo className="h-8 w-8" />
          <div className="grid flex-1 text-left  leading-tight">
            <span className="truncate font-medium">ForeclosedHub</span>
            <span className="truncate text-xs">Foreclosed properties</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <Filters initialFilters={params} />
      </SidebarContent>
      <SidebarFooter>
        <NavUtility />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
