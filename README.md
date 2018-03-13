# Terable [![Build Status](https://travis-ci.org/mwiencek/terable.svg?branch=master)](https://travis-ci.org/mwiencek/terable)

Terable is a wonderful library for using [ES2015 iterables](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols).

The functions it provides are comparable to a subset of lodash, but:

 * They accept iterables as input, and return iterables back (where appropriate)
 * They're lazy where possible (extremely lazy in fact), and have a functional API similar to [lodash/fp](https://github.com/lodash/lodash/wiki/FP-Guide) (no method chaining!)
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
terable (large reduce) x 46,701 ops/sec ±1.31% (93 runs sampled)
iterare (large reduce) x 20,772 ops/sec ±1.12% (92 runs sampled)
lodash/fp (large reduce) x 12,468 ops/sec ±0.86% (90 runs sampled)
ramda (large reduce) x 8,497 ops/sec ±1.90% (82 runs sampled)
Fastest is terable (large reduce)

terable (complex chain) x 1,003,418 ops/sec ±1.07% (91 runs sampled)
iterare (complex chain) x 531,901 ops/sec ±0.67% (89 runs sampled)
lodash/fp (complex chain) x 527,213 ops/sec ±1.11% (91 runs sampled)
ramda (complex chain) x 173,405 ops/sec ±1.29% (85 runs sampled)
Fastest is terable (complex chain)

terable (simple map) x 5,112,881 ops/sec ±1.26% (91 runs sampled)
terable (simple map, inline function) x 2,910,657 ops/sec ±0.91% (90 runs sampled)
iterare (simple map) x 6,077,576 ops/sec ±1.30% (95 runs sampled)
lodash/fp (simple map) x 328,324 ops/sec ±0.45% (87 runs sampled)
ramda (simple map) x 1,577,195 ops/sec ±1.38% (89 runs sampled)
Fastest is iterare (simple map)

terable (take before map) x 6,117,701 ops/sec ±1.58% (90 runs sampled)
terable (take after map) x 3,859,973 ops/sec ±0.55% (94 runs sampled)
iterare (take before map) x 6,758,529 ops/sec ±1.17% (93 runs sampled)
iterare (take after map) x 6,636,016 ops/sec ±0.82% (94 runs sampled)
lodash/fp (take before map) x 173,003 ops/sec ±1.55% (87 runs sampled)
lodash/fp (take after map) x 163,014 ops/sec ±0.59% (86 runs sampled)
ramda (take before map) x 796,197 ops/sec ±1.71% (88 runs sampled)
ramda (take after map) x 719,621 ops/sec ±0.62% (86 runs sampled)
Fastest is iterare (take before map)
```
