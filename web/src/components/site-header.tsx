"use client"

import {SidebarIcon} from "lucide-react"
import {Button} from "@web/components/common/button"
import {Separator} from "@web/components/common/separator"
import {useSidebar} from "@web/components/common/sidebar"

export function SiteHeader() {
    const {toggleSidebar} = useSidebar()

    return (
        <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
            <div className="flex h-(--header-height) w-full items-center gap-2 px-2">
                <Button
                    className="h-8 w-8"
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                >
                    <SidebarIcon/>
                </Button>
                <Separator orientation="vertical" className="mr-2 h-4"/>
                <div className="flex-1 relative">
                    <span className="leading-none font-medium">Homagochi</span>
                </div>
            </div>
        </header>
    )
}
