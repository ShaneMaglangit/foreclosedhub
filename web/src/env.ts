import {createEnv} from "@t3-oss/env-nextjs";
import {z} from "zod";

export const env = createEnv({
    server: {
        GRPC_ADDRESS: z.string().url(),
    },
    client: {},
    runtimeEnv: {
        GRPC_ADDRESS: process.env.GRPC_ADDRESS,
    },
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
    emptyStringAsUndefined: true,
});