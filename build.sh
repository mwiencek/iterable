#!/bin/bash

set -e

cd "$(dirname "${BASH_SOURCE[0]}")"

yarn install

mkdir -p dist/{async/util,util}

./node_modules/.bin/babel src/*.js --out-dir dist/
./node_modules/.bin/babel src/async/*.js --out-dir dist/async/
./node_modules/.bin/babel src/async/util/*.js --out-dir dist/async/util/
./node_modules/.bin/babel src/util/*.js --out-dir dist/util/

pushd src
find . -name '*.js' \( -not -path './test/*' \) -exec cp '{}' '../dist/{}.flow' \;
popd

# These aren't used/needed
rm \
    dist/AsyncTerable.js.flow \
    dist/Concatable.js.flow \
    dist/Terable.js.flow \
    dist/types.js

cp \
    .npmignore \
    LICENSE \
    package.json \
    README.md \
    dist/
