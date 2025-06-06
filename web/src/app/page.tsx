import { z } from "zod"
import { getListingsInBoundary } from "@web/lib/grpc/getListingsInBoundary";
import Map from "@web/app/map";
import { execute } from "@web/lib/graphql/execute";
import { GetListingsQuery } from "@web/lib/graphql/getListings";
import { useQuery } from '@tanstack/react-query'
import QueryProvider from "@web/app/queryProvider"


export default async function Page() {
    return (
        <QueryProvider>
            <Map className="w-dvw h-dvh" />
        </QueryProvider>
    )
}
