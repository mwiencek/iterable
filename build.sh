#!/bin/bash

set -e

cd "$(dirname "${BASH_SOURCE[0]}")"

yarn install

mkdir -p dist/src

pushd src
babel *.js util/*.js --out-dir ../dist/
popd

cp \
    .npmignore \
    LICENSE \
    package.json \
    README.md \
    src/*.js.flow \
    dist/
cp src/*.js dist/src/
cp src/*.js.flow dist/src/
