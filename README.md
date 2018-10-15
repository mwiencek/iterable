# Terable [![Build Status](https://travis-ci.org/mwiencek/terable.svg?branch=master)](https://travis-ci.org/mwiencek/terable)

Terable is a wonderful library for using [ES2015 iterables](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols).

The functions it provides are comparable to a subset of lodash, but:

 * They accept iterables as input, and return iterables back (where appropriate)
 * They're lazy where possible (extremely lazy in fact), and have a functional API similar to [lodash/fp](https://github.com/lodash/lodash/wiki/FP-Guide) (no method chaining!)
 * They're optimized to reduce the number of iterators and avoid creating intermediary data structures when composed together
 * [Flow](https://flow.org/) types are built-in

While lodash is an incredible library for what it does, it's not inteded to support iterables directly (requiring you to convert them using spread syntax). [[1]](https://github.com/lodash/lodash/issues/737#issuecomment-232161961) The limited support it has for lazy evaluation will also likely be cut from version 5. [[1]](https://github.com/lodash/lodash/issues/3262#issuecomment-315407743) [[2]](https://github.com/lodash/lodash/issues/3601#issuecomment-359351086)

As an alternative, you may also want to look into [iterare](https://github.com/felixfbecker/iterare) if you prefer method chaining and TypeScript support (though the functionality doesn't overlap completely).

## Setup

```sh
yarn add terable
```

```JavaScript
import * as it from 'terable';
// In Node
const it = require('terable');

// You can also import only the functions you need
import map from 'terable/map';
// In Node (note it's the .default export)
const map = require('terable/map').default;
```

The published source is transpiled to support Node 6 and IE11. Generators aren't used, so you don't need the regenerator runtime to use this library.

Flow types are included with the package as separate `*.js.flow` files which are picked up by Flow automatically.

## API

All functions are curried.

Most return values are iterables which *can't be reused* (i.e. iterated more than once), though some functions return a `Set` or `Map` which can of course be reused.

For usage examples, [have a look at the tests](https://github.com/mwiencek/terable/blob/master/src/test).

```
all : <T>(test: (T) => mixed) => (Iterable<T>) => boolean

any : <T>(test: (T) => mixed) => (Iterable<T>) => boolean

compact : <T>(Iterable<T>) => Iterable<$NonMaybeType<T>>

concat : <T>(Iterable <Iterable<T>>) => Iterable<T>

concatMap : <T, U>(func: (T) => Iterable<U>) => (Iterable<T>) => Iterable<U>

countBy : <T, K>(func: (T) => K) => (Iterable<T>) => Map<K, number>

difference : <T>(sets: Iterable<Iterable<T>>) => Set<T>

drop : (count: number) => <T>(Iterable<T>) => Iterable<T>

each : <T>(func: (T) => mixed) => (Iterable<T>) => void

filter : <T, U>(test: ((T | U)) => mixed) => (Iterable<(T | U)>) => Iterable<U>

find : <T>(func: (T) => mixed) => (Iterable<T>) => T

foldl : <T, U>(func: (U, T) => U) => (U) => (Iterable<T>) => U

groupBy : <T, K>(func: (T) => K) => (Iterable<T>) => Map<K, Array<T>>

head : <T>(Iterable<T>) => T

intersect : <T>(sets: Iterable<Iterable<T>>) => Set<T>

join : (sep: string) => (Iterable<string>) => string

keyBy : <T, K>(func: (T) => K) => (Iterable<T>) => Map<K, T>

map : <T, U>(func: (T) => U) => (Iterable<T>) => Iterable<U>

sort : <T>(Iterable<T>) => Iterable<T>

sortBy : <T, K>(func: (T) => K) => (Iterable<T>) => Iterable<T>

take : (count: number) => <T>(Iterable<T>) => Iterable<T>

toArray : <T>(Iterable<T>) => Array<T>

toObject : <K, T>(entries: Iterable<[K, T]>) => {[K]: T}

union : <T>(sets: Iterable<Iterable<T>>) => Set<T>

uniqBy : <T, U>(func: (T) => U) => (Iterable<T>) => Iterable<T>
```

## Benchmarks

You can take these with a grain of salt. I used the benchmarks specifically to measure the performance of large iterator chains. Terable is slower at iterare's own benchmarks, and it would be quite easy to construct micro-benchmarks where lodash is 100x faster.

The main takeaway from these is that Terable isn't half-bad.

```bash
michael@Michaels-MacBook-Pro-2 ~/c/terable> node --version
v10.12.0
michael@Michaels-MacBook-Pro-2 ~/c/terable> for f in (ls bench); node "bench/$f"; echo; end
terable (intersect) x 225,798 ops/sec ±0.46% (92 runs sampled)
lodash (intersect) x 478,862 ops/sec ±1.00% (90 runs sampled)
ramda (intersect) x 15,731 ops/sec ±0.68% (94 runs sampled)
Fastest is lodash (intersect)

terable (large reduce) x 26,124 ops/sec ±0.46% (93 runs sampled)
iterare (large reduce) x 20,079 ops/sec ±0.46% (92 runs sampled)
lodash/fp (large reduce) x 12,826 ops/sec ±0.86% (91 runs sampled)
ramda (large reduce) x 66,106 ops/sec ±0.84% (89 runs sampled)
Fastest is ramda (large reduce)

terable (complex chain) x 515,600 ops/sec ±0.48% (86 runs sampled)
iterare (complex chain) x 435,195 ops/sec ±0.65% (93 runs sampled)
lodash/fp (complex chain) x 638,640 ops/sec ±0.49% (94 runs sampled)
ramda (complex chain) x 149,667 ops/sec ±0.82% (91 runs sampled)
Fastest is lodash/fp (complex chain)

terable (simple map) x 2,958,367 ops/sec ±1.63% (92 runs sampled)
terable (simple map, inline function) x 2,511,654 ops/sec ±0.56% (92 runs sampled)
iterare (simple map) x 4,129,526 ops/sec ±1.31% (89 runs sampled)
lodash/fp (simple map) x 437,384 ops/sec ±0.37% (94 runs sampled)
ramda (simple map) x 1,968,403 ops/sec ±1.20% (90 runs sampled)
Fastest is iterare (simple map)

terable (sortBy) x 374,045 ops/sec ±2.26% (78 runs sampled)
lodash/fp (sortBy) x 305,761 ops/sec ±0.48% (94 runs sampled)
ramda (sortBy) x 434,463 ops/sec ±1.05% (90 runs sampled)
Fastest is ramda (sortBy)

terable (take before map) x 6,319,365 ops/sec ±2.87% (90 runs sampled)
terable (take after map) x 6,399,383 ops/sec ±1.01% (91 runs sampled)
iterare (take before map) x 7,890,394 ops/sec ±1.65% (85 runs sampled)
iterare (take after map) x 7,583,817 ops/sec ±1.25% (88 runs sampled)
lodash/fp (take before map) x 257,589 ops/sec ±1.44% (91 runs sampled)
lodash/fp (take after map) x 243,316 ops/sec ±0.72% (96 runs sampled)
ramda (take before map) x 828,582 ops/sec ±0.81% (94 runs sampled)
ramda (take after map) x 802,170 ops/sec ±1.01% (94 runs sampled)
Fastest is iterare (take before map)
```
