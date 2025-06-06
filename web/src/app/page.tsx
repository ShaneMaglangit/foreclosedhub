import Map from "@web/app/map";
import QueryProvider from "@web/app/queryProvider"


export default async function Page() {
    return (
        <QueryProvider>
            <Map className="w-dvw h-dvh" />
        </QueryProvider>
    )
}
