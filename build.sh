#!/bin/bash

set -e

cd "$(dirname "${BASH_SOURCE[0]}")"

yarn install

mkdir -p dist/src

babel src --out-dir dist/

cp .npmignore LICENSE package.json dist/
cp src/*.js dist/src/
