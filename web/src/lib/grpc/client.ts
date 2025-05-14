import * as grpc from '@grpc/grpc-js';
import {hello} from "@web/lib/proto/hello";
import HelloServiceClient = hello.HelloServiceClient;
import SayHelloRequest = hello.SayHelloRequest;
import SayHelloResponse = hello.SayHelloResponse;

const address = process.env.GRPC_ADDRESS || 'localhost:50051';
const client = new HelloServiceClient(address, grpc.credentials.createInsecure());

export function sayHello(): Promise<SayHelloResponse | undefined> {
    const req = new SayHelloRequest();

    return new Promise((resolve, reject) => {
        client.SayHello(req, (err, res) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
}