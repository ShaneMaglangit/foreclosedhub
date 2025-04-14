import * as grpc from "@grpc/grpc-js";
import { credentials, ServiceError } from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { ProtoGrpcType } from "@web/lib/protobuf/listing_service";
import { GetListingsResponse__Output } from "@web/lib/protobuf/listing/GetListingsResponse";
import { env } from "@web/env";
import { GetListingsRequest } from "@web/lib/protobuf/listing/GetListingsRequest";
import { promises as fs } from "fs";

const PROTO_PATH = path.join(process.cwd(), "./proto/listing_service.proto");

const descriptorBuffer = await fs.readFile(PROTO_PATH);
const packageDefinition = protoLoader.loadFileDescriptorSetFromBuffer(
  descriptorBuffer,
  {
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  },
);

const proto = grpc.loadPackageDefinition(
  packageDefinition,
) as unknown as ProtoGrpcType;

const cert = Buffer.from(env.GRPC_CERT, "base64");
const client = new proto.listing.ListingService(
  env.GRPC_ADDRESS,
  credentials.createSsl(cert),
);

export function getListings(
  request: GetListingsRequest,
): Promise<GetListingsResponse__Output> {
  return new Promise((resolve, reject) => {
    client.GetListings(
      request,
      (
        err: ServiceError | null,
        response: GetListingsResponse__Output | undefined,
      ) => {
        if (err) return reject(err);
        if (!response) return reject({ reason: "Empty response" });
        resolve(response);
      },
    );
  });
}
