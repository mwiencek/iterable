#!/bin/bash

set -e

cd "$(dirname "${BASH_SOURCE[0]}")"

yarn install

mkdir -p dist/{js/async,js/util,async,util}

pushd src
../node_modules/.bin/babel *.js --out-dir ../dist/js/
../node_modules/.bin/babel async/*.js --out-dir ../dist/js/async/
../node_modules/.bin/babel util/*.js --out-dir ../dist/js/util/
popd

cp \
    .npmignore \
    LICENSE \
    package.json \
    README.md \
    src/*.js \
    dist/
cp src/async/*.js dist/async/
cp src/util/*.js dist/util/
