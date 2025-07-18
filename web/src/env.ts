import {createEnv} from "@t3-oss/env-nextjs";
import {z} from "zod";

export const env = createEnv({
    server: {},
    client: {
        NEXT_PUBLIC_GRAPHQL_URI: z.string().default('http://localhost:8080/graphql'),
        NEXT_PUBLIC_MAPS_API_KEY: z.string(),
    },
    runtimeEnv: {
        NEXT_PUBLIC_GRAPHQL_URI: process.env.NEXT_PUBLIC_GRAPHQL_URI,
        NEXT_PUBLIC_MAPS_API_KEY: process.env.NEXT_PUBLIC_MAPS_API_KEY,
    },
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
    emptyStringAsUndefined: true,
});
