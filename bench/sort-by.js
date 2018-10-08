require('@babel/register');

const Benchmark = require('benchmark');
const _sortBy = require('lodash/fp/sortBy');
const R = require('ramda');
const it = require('../src/index');

const items = [
  {a: 3, b: 7, index: 0},
  {a: 3, b: 6, index: 1},
  {a: 2, b: 0, index: 2},
  {a: 0, b: 7, index: 3},
  {a: 7, b: 2, index: 4},
  {a: 6, b: 4, index: 5},
  {a: 2, b: 3, index: 6},
  {a: 9, b: 7, index: 7},
  {a: 7, b: 6, index: 8},
  {a: 0, b: 9, index: 9},
];

const getA = x => x.a;
const getB = x => x.b;

(new Benchmark.Suite)
  .add('terable (sortBy)', function () {
    it.toArray(it.sortBy(getA)(it.sortBy(getB)(items)));
  })
  .add('lodash/fp (sortBy)', function () {
    _sortBy([getA, getB])(items);
  })
  .add('ramda (sortBy)', function () {
    R.sortBy(getA)(R.sortBy(getB)(items));
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
