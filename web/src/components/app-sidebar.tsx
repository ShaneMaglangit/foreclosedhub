import * as React from "react"

import {Calendars} from "@web/components/calendars"
import {DatePicker} from "@web/components/date-picker"
import {NavUser} from "@web/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarSeparator,
} from "@web/components/common/sidebar"
import {Send} from "lucide-react";

// This is sample data.
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
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
            <SidebarHeader className="border-sidebar-border h-16 border-b">
                <NavUser user={data.user}/>
            </SidebarHeader>
            <SidebarContent>
                <DatePicker/>
                <SidebarSeparator className="mx-0"/>
                <Calendars calendars={data.calendars}/>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <a href="https://gitlab.com/ShaneMaglangit/homagochi/-/issues/new" target="_blank">
                                <Send/>
                                <span>Feedback</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
