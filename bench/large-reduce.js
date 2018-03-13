require('babel-register');

const Benchmark = require('benchmark');
const iterare = require('iterare');
const _flowRight = require('lodash/fp/flowRight');
const _map = require('lodash/fp/map');
const _reduce = require('lodash/fp/reduce');
const R = require('ramda');
const it = require('../src/index');

const largeList = R.repeat(1, 1000);
const sum = (accum, x) => accum + x;
const double = x => x * 2;
const doubleIt = it.map(double);
const doubleLodash = _map(double);
const doubleRamda = R.map(double);

(new Benchmark.Suite)
  .add('terable (large reduce)', function () {
    it.foldl(sum, 0)(it.compose(
      doubleIt,
      doubleIt,
      doubleIt,
      doubleIt,
      doubleIt,
    )(largeList));
  })
  .add('iterare (large reduce)', function () {
    iterare.iterate(largeList)
      .map(double)
      .map(double)
      .map(double)
      .map(double)
      .map(double)
      .reduce(sum, 0);
  })
  .add('lodash/fp (large reduce)', function () {
    _reduce(sum, 0)(_flowRight(
      doubleLodash,
      doubleLodash,
      doubleLodash,
      doubleLodash,
      doubleLodash,
    )(largeList));
  })
  .add('ramda (large reduce)', function () {
    R.reduce(sum, 0)(R.compose(
      doubleRamda,
      doubleRamda,
      doubleRamda,
      doubleRamda,
      doubleRamda,
    )(largeList));
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .on('error', function (err) {
    console.error(err);
  })
  .run({async: false});
