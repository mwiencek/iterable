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
terable (intersect) x 236,639 ops/sec ±0.59% (92 runs sampled)
lodash (intersect) x 224,449 ops/sec ±0.95% (88 runs sampled)
ramda (intersect) x 13,746 ops/sec ±1.11% (91 runs sampled)
Fastest is terable (intersect)

terable (large reduce) x 33,893 ops/sec ±0.78% (90 runs sampled)
iterare (large reduce) x 19,118 ops/sec ±1.20% (92 runs sampled)
lodash/fp (large reduce) x 12,625 ops/sec ±1.66% (87 runs sampled)
ramda (large reduce) x 7,721 ops/sec ±1.71% (80 runs sampled)
Fastest is terable (large reduce)

terable (complex chain) x 1,029,923 ops/sec ±0.78% (92 runs sampled)
iterare (complex chain) x 513,663 ops/sec ±0.87% (88 runs sampled)
lodash/fp (complex chain) x 531,474 ops/sec ±1.11% (91 runs sampled)
ramda (complex chain) x 176,583 ops/sec ±1.52% (89 runs sampled)
Fastest is terable (complex chain)

terable (simple map) x 3,535,762 ops/sec ±0.48% (92 runs sampled)
terable (simple map, inline function) x 2,167,876 ops/sec ±0.80% (90 runs sampled)
iterare (simple map) x 5,735,699 ops/sec ±1.38% (89 runs sampled)
lodash/fp (simple map) x 361,345 ops/sec ±0.80% (85 runs sampled)
ramda (simple map) x 1,793,450 ops/sec ±1.08% (86 runs sampled)
Fastest is iterare (simple map)

terable (sortBy) x 379,095 ops/sec ±0.41% (93 runs sampled)
lodash/fp (sortBy) x 251,404 ops/sec ±0.63% (86 runs sampled)
ramda (sortBy) x 359,833 ops/sec ±0.93% (90 runs sampled)
Fastest is terable (sortBy)

terable (take before map) x 4,621,149 ops/sec ±0.65% (93 runs sampled)
terable (take after map) x 4,518,899 ops/sec ±1.23% (92 runs sampled)
iterare (take before map) x 8,391,380 ops/sec ±0.89% (92 runs sampled)
iterare (take after map) x 7,326,033 ops/sec ±0.49% (93 runs sampled)
lodash/fp (take before map) x 192,521 ops/sec ±1.74% (86 runs sampled)
lodash/fp (take after map) x 185,880 ops/sec ±0.45% (94 runs sampled)
ramda (take before map) x 855,649 ops/sec ±0.85% (91 runs sampled)
ramda (take after map) x 761,968 ops/sec ±1.30% (92 runs sampled)
Fastest is iterare (take before map)
```
