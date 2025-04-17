import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    ENVIRONMENT: z.enum(["development", "production"]),
    GRPC_ADDRESS: z.string(),
    GRPC_CERT: z.string(),
  },
  client: {
    NEXT_PUBLIC_GCP_MAPS_API: z.string(),
  },
  runtimeEnv: {
    ENVIRONMENT: process.env.ENVIRONMENT,
    GRPC_ADDRESS: process.env.GRPC_ADDRESS,
    GRPC_CERT: process.env.GRPC_CERT,
    NEXT_PUBLIC_GCP_MAPS_API: process.env.NEXT_PUBLIC_GCP_MAPS_API,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
