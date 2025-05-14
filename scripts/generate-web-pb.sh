#!/usr/bin/env zsh

pbjs -t static-module -w commonjs -o  ./web/src/lib/proto/compiled.js ./proto/hello.proto
pbts -o ./web/src/lib/proto/compiled.d.ts ./web/src/lib/proto/compiled.js
