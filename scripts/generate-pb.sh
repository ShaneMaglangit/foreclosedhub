#!/usr/bin/env zsh

protoc --go_out=./server/internal/ --go_opt=paths=import --go-grpc_out=./server/internal/ --go-grpc_opt=paths=import ./proto/*.proto

cd web || exit
yarn run proto:generate