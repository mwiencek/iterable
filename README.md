# Terable

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
michael@Michaels-MacBook-Pro-2 ~/c/terable> node bench.js
terable x 512,556 ops/sec ±1.28% (88 runs sampled)
iterare x 323,963 ops/sec ±1.29% (86 runs sampled)
lodash/fp x 332,995 ops/sec ±1.23% (88 runs sampled)
ramda x 100,419 ops/sec ±0.82% (91 runs sampled)
Fastest is terable
terable x 14,084 ops/sec ±0.93% (89 runs sampled)
iterare x 7,072 ops/sec ±0.82% (92 runs sampled)
lodash/fp x 9,218 ops/sec ±1.34% (90 runs sampled)
ramda x 5,509 ops/sec ±1.69% (68 runs sampled)
Fastest is terable
```
