# Terable [![Build Status](https://travis-ci.org/mwiencek/terable.svg?branch=master)](https://travis-ci.org/mwiencek/terable)

Terable is a wonderful library for using [ES2015 iterables](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols).

The functions it provides are comparable to a subset of lodash, but:

 * They accept iterables as input, and return iterables back (where appropriate)
 * They're always lazy (extremely lazy in fact), and have a functional API similar to [lodash/fp](https://github.com/lodash/lodash/wiki/FP-Guide) (no method chaining!)
 * They're optimized to reduce the number of iterators and avoid creating intermediary data structures when composed together
 * [Flow](https://flow.org/) types are built-in

While lodash is an incredible library for what it does, it's not inteded to support iterables directly (requiring you to convert them using spread syntax). [[1]](https://github.com/lodash/lodash/issues/737#issuecomment-232161961) The limited support it has for lazy evaluation will also likely be cut from version 5. [[1]](https://github.com/lodash/lodash/issues/3262#issuecomment-315407743) [[2]](https://github.com/lodash/lodash/issues/3601#issuecomment-359351086)

As an alternative, you may also want to look into [iterare](https://github.com/felixfbecker/iterare) if you prefer method chaining and TypeScript support (though the functionality doesn't overlap completely).

## API

TODO

In the meantime, you can [look at the tests for examples](https://github.com/mwiencek/terable/blob/master/src/test/all.test.js).

## Benchmarks

You can take these with a grain of salt. I used the benchmarks specifically to measure the performance of large iterator chains. Terable is slower at iterare's own benchmarks, and it would be quite easy to construct micro-benchmarks where lodash is 100x faster.

The main takeaway from these is that Terable isn't half-bad.

```bash
michael@Michaels-MacBook-Pro-2 ~/c/terable> for f in (ls bench); node "bench/$f"; echo; end
terable (large reduce) x 41,371 ops/sec ±1.41% (88 runs sampled)
iterare (large reduce) x 20,413 ops/sec ±0.85% (94 runs sampled)
lodash/fp (large reduce) x 12,787 ops/sec ±1.34% (91 runs sampled)
ramda (large reduce) x 7,144 ops/sec ±0.95% (86 runs sampled)
Fastest is terable (large reduce)

terable (complex chain) x 538,415 ops/sec ±1.21% (91 runs sampled)
iterare (complex chain) x 338,245 ops/sec ±0.70% (93 runs sampled)
lodash/fp (complex chain) x 336,373 ops/sec ±1.19% (91 runs sampled)
ramda (complex chain) x 100,295 ops/sec ±0.83% (86 runs sampled)
Fastest is terable (complex chain)

terable (simple map) x 4,096,976 ops/sec ±1.28% (94 runs sampled)
terable (simple map, inline function) x 2,531,427 ops/sec ±0.68% (92 runs sampled)
iterare (simple map) x 5,957,257 ops/sec ±2.12% (91 runs sampled)
lodash/fp (simple map) x 327,644 ops/sec ±0.63% (87 runs sampled)
ramda (simple map) x 1,599,157 ops/sec ±1.16% (91 runs sampled)
Fastest is iterare (simple map)

terable (take before map) x 5,306,813 ops/sec ±1.31% (92 runs sampled)
terable (take after map) x 3,828,375 ops/sec ±0.50% (92 runs sampled)
iterare (take before map) x 8,523,099 ops/sec ±1.17% (93 runs sampled)
iterare (take after map) x 7,415,196 ops/sec ±0.97% (95 runs sampled)
lodash/fp (take before map) x 195,560 ops/sec ±1.72% (79 runs sampled)
lodash/fp (take after map) x 187,541 ops/sec ±0.41% (95 runs sampled)
ramda (take before map) x 871,938 ops/sec ±1.00% (91 runs sampled)
ramda (take after map) x 813,383 ops/sec ±0.48% (89 runs sampled)
Fastest is iterare (take before map)
```
