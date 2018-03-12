#!/bin/bash

set -e

cd "$(dirname "${BASH_SOURCE[0]}")"

yarn install

pushd src
babel *.js --out-dir ../dist/
popd

cp \
    .npmignore \
    LICENSE \
    package.json \
    README.md \
    src/*.js.flow \
    dist/
