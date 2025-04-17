#!/bin/zsh

protoc \
  --proto_path=proto \
  --go_out=./backend/internal/protobuf --go_opt=paths=source_relative \
  --go-grpc_out=./backend/internal/protobuf --go-grpc_opt=paths=source_relative \
  proto/*.proto

pushd web
pbjs -o ./protodef/listing_service.json -t json ../proto/listing_service.proto
npx proto-loader-gen-types --keepCase=false --longs=String --enums=String --defaults --oneofs --grpcLib=@grpc/grpc-js --outDir=src/lib/protobuf/ ../proto/*.proto
popd
