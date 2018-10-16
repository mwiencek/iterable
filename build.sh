#!/bin/bash

set -e

cd "$(dirname "${BASH_SOURCE[0]}")"

yarn install

mkdir -p dist/{async/util,util}

./node_modules/.bin/babel src/*.js --out-dir dist/
./node_modules/.bin/babel src/async/*.js --out-dir dist/async/
./node_modules/.bin/babel src/async/util/*.js --out-dir dist/async/util/
./node_modules/.bin/babel src/util/*.js --out-dir dist/util/

cp \
    .npmignore \
    LICENSE \
    package.json \
    README.md \
    src/flow/*.js.flow \
    dist/
cp src/flow/async/*.js.flow dist/async/
