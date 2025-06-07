import Map from "@web/app/map";
import QueryProvider from "@web/app/queryProvider"
import { Suspense } from 'react'

export default async function Page() {
    return (
        <QueryProvider>
            <Suspense fallback={<div className="w-dvw h-dvh flex items-center justify-center">Loading...</div>}>
                <Map className="w-dvw h-dvh" />
            </Suspense>
        </QueryProvider>
    )
}
