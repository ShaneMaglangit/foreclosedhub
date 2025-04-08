import {SidebarMenu, SidebarMenuButton, SidebarMenuItem} from "@web/components/common/sidebar";
import {Send} from "lucide-react";
import * as React from "react";

export function NavUtility() {
    return (
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
    )
}