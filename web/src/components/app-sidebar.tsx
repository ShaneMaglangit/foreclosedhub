import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@web/components/common/sidebar";
import { Brand } from "@web/components/brand";
import { NavUtility } from "@web/components/nav-utility";
import { Filters } from "@web/app/filters";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="bg-foreground text-background border-sidebar-border h-16 border-b justify-center">
        <Brand />
      </SidebarHeader>
      <SidebarContent>
        <Filters />
      </SidebarContent>
      <SidebarFooter>
        <NavUtility />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
