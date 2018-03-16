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

In the meantime, you can [look at the tests for examples](https://github.com/mwiencek/terable/blob/master/src/test).

## Benchmarks

You can take these with a grain of salt. I used the benchmarks specifically to measure the performance of large iterator chains. Terable is slower at iterare's own benchmarks, and it would be quite easy to construct micro-benchmarks where lodash is 100x faster.

The main takeaway from these is that Terable isn't half-bad.

```bash
michael@Michaels-MacBook-Pro-2 ~/c/terable> node --version
v9.6.1
michael@Michaels-MacBook-Pro-2 ~/c/terable> for f in (ls bench); node "bench/$f"; echo; end
terable (intersect) x 228,850 ops/sec ±1.10% (91 runs sampled)
lodash (intersect) x 456,587 ops/sec ±0.62% (90 runs sampled)
ramda (intersect) x 13,551 ops/sec ±1.24% (89 runs sampled)
Fastest is lodash (intersect)

terable (large reduce) x 37,087 ops/sec ±1.20% (91 runs sampled)
iterare (large reduce) x 19,947 ops/sec ±0.67% (90 runs sampled)
lodash/fp (large reduce) x 12,430 ops/sec ±1.36% (83 runs sampled)
ramda (large reduce) x 8,725 ops/sec ±2.25% (84 runs sampled)
Fastest is terable (large reduce)

terable (complex chain) x 1,000,144 ops/sec ±1.70% (91 runs sampled)
iterare (complex chain) x 507,666 ops/sec ±1.51% (84 runs sampled)
lodash/fp (complex chain) x 524,060 ops/sec ±1.24% (90 runs sampled)
ramda (complex chain) x 172,599 ops/sec ±0.82% (89 runs sampled)
Fastest is terable (complex chain)

terable (simple map) x 3,884,002 ops/sec ±1.29% (94 runs sampled)
terable (simple map, inline function) x 2,266,839 ops/sec ±0.56% (91 runs sampled)
iterare (simple map) x 5,922,709 ops/sec ±1.62% (92 runs sampled)
lodash/fp (simple map) x 326,457 ops/sec ±0.71% (87 runs sampled)
ramda (simple map) x 1,578,584 ops/sec ±1.35% (91 runs sampled)
Fastest is iterare (simple map)

terable (sortBy) x 327,428 ops/sec ±1.26% (88 runs sampled)
lodash/fp (sortBy) x 219,689 ops/sec ±0.52% (89 runs sampled)
ramda (sortBy) x 310,816 ops/sec ±1.22% (91 runs sampled)
Fastest is terable (sortBy)

terable (take before map) x 5,165,748 ops/sec ±1.39% (93 runs sampled)
terable (take after map) x 3,713,791 ops/sec ±0.43% (91 runs sampled)
iterare (take before map) x 7,833,968 ops/sec ±2.18% (88 runs sampled)
iterare (take after map) x 5,976,025 ops/sec ±0.55% (93 runs sampled)
lodash/fp (take before map) x 167,707 ops/sec ±1.44% (89 runs sampled)
lodash/fp (take after map) x 151,440 ops/sec ±0.72% (90 runs sampled)
ramda (take before map) x 755,783 ops/sec ±1.09% (91 runs sampled)
ramda (take after map) x 718,602 ops/sec ±0.42% (90 runs sampled)
Fastest is iterare (take before map)
```
