// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var hello_pb = require('./hello_pb.js');

function serialize_hello_SayHelloRequest(arg) {
  if (!(arg instanceof hello_pb.SayHelloRequest)) {
    throw new Error('Expected argument of type hello.SayHelloRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_hello_SayHelloRequest(buffer_arg) {
  return hello_pb.SayHelloRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_hello_SayHelloResponse(arg) {
  if (!(arg instanceof hello_pb.SayHelloResponse)) {
    throw new Error('Expected argument of type hello.SayHelloResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_hello_SayHelloResponse(buffer_arg) {
  return hello_pb.SayHelloResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var HelloServiceService = exports.HelloServiceService = {
  sayHello: {
    path: '/hello.HelloService/SayHello',
    requestStream: false,
    responseStream: false,
    requestType: hello_pb.SayHelloRequest,
    responseType: hello_pb.SayHelloResponse,
    requestSerialize: serialize_hello_SayHelloRequest,
    requestDeserialize: deserialize_hello_SayHelloRequest,
    responseSerialize: serialize_hello_SayHelloResponse,
    responseDeserialize: deserialize_hello_SayHelloResponse,
  },
};

exports.HelloServiceClient = grpc.makeGenericClientConstructor(HelloServiceService, 'HelloService');
