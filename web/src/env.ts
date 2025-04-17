import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    ENVIRONMENT: z.enum(["development", "production"]),
    GRPC_ADDRESS: z.string(),
    GRPC_CERT: z.string(),
  },
  client: {
    NEXT_PUBLIC_MAPBOX_API_KEY: z.string(),
  },
  runtimeEnv: {
    ENVIRONMENT: process.env.ENVIRONMENT,
    GRPC_ADDRESS: process.env.GRPC_ADDRESS,
    GRPC_CERT: process.env.GRPC_CERT,
    NEXT_PUBLIC_MAPBOX_API_KEY: process.env.NEXT_PUBLIC_MAPBOX_API_KEY,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
