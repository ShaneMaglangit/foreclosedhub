"use client"

import * as React from "react"
import {LayoutGrid,} from "lucide-react"

import {NavMain} from "@web/components/nav-main"
import {BrandHeader} from "@web/components/brand-header"
import {Sidebar, SidebarContent, SidebarHeader, SidebarRail,} from "@web/components//sidebar"

const menuItems = [
    {
        name: "Listings",
        url: "/",
        icon: LayoutGrid,
    }
]

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <BrandHeader/>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={menuItems}/>
            </SidebarContent>
            <SidebarRail/>
        </Sidebar>
    )
}
