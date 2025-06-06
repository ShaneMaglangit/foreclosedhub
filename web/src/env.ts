import {createEnv} from "@t3-oss/env-nextjs";
import {z} from "zod";

export const env = createEnv({
    server: {
        GRPC_ADDRESS: z.string().default('http://localhost:50051')
    },
    client: {
        NEXT_PUBLIC_GRAPHQL_URI: z.string().default('http://localhost:8080/graphql'),
        NEXT_PUBLIC_MAPS_API_KEY: z.string(),
    },
    runtimeEnv: {
        GRPC_ADDRESS: process.env.GRPC_ADDRESS,
        NEXT_PUBLIC_GRAPHQL_URI: process.env.NEXT_PUBLIC_GRAPHQL_URI,
        NEXT_PUBLIC_MAPS_API_KEY: process.env.NEXT_PUBLIC_MAPS_API_KEY,
    },
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
    emptyStringAsUndefined: true,
});
