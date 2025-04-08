import * as React from "react"

import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail,} from "@web/components/common/sidebar"
import {Brand} from "@web/components/brand";
import {NavUtility} from "@web/components/nav-utility";
import {Filters} from "@web/components/filters";

const data = {
    calendars: [
        {
            name: "My Calendars",
            items: ["Personal", "Work", "Family"],
        },
        {
            name: "Favorites",
            items: ["Holidays", "Birthdays"],
        },
        {
            name: "Other",
            items: ["Travel", "Reminders", "Deadlines"],
        },
    ],
}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar {...props}>
            <SidebarHeader className="border-sidebar-border h-16 border-b justify-center">
                <Brand/>
            </SidebarHeader>
            <SidebarContent>
                <Filters />
            </SidebarContent>
            <SidebarFooter>
                <NavUtility/>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
