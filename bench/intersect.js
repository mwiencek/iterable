require('babel-register');

const Benchmark = require('benchmark');
const it = require('../src');
const _intersection = require('lodash/intersection');
const _intersectionFp = require('lodash/fp/intersection');
const _reduceFp = require('lodash/fp/reduce');
const R = require('ramda');

const lists = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
  [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
  [1, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
  [1, 3, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
  [1, 3, 5, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
  [1, 3, 5, 7, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19],
  [1, 3, 5, 7, 9, 11, 13, 14, 15, 16, 17, 18, 19],
  [1, 3, 5, 7, 9, 11, 13, 15, 16, 17, 18, 19],
  [1, 3, 5, 7, 9, 11, 13, 15, 17, 18, 19],
  [1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
];

const intersectTerable = (accum, x) => accum ? it.intersect(accum)(x) : x;
const intersectLodash = (accum, x) => accum ? _intersectionFp(accum, x) : x;
const intersectRamda = (accum, x) => accum ? R.intersection(accum, x) : x;

const getResultTerable = it.compose(
  it.toArray,
  it.foldl(intersectTerable, null),
);

const getResultLodashFp = _reduceFp(intersectLodash, null);

const getResultLodash = x => _intersection(...x);

const getResultRamda = R.reduce(intersectRamda, null);

(new Benchmark.Suite)
  .add('terable (intersect)', function () {
    getResultTerable(lists);
  })
  .add('lodash (intersect)', function () {
    getResultLodashFp(lists);
  })
  .add('lodash (intersect, no fp, no reduce)', function () {
    getResultLodash(lists);
  })
  .add('ramda (intersect)', function () {
    getResultRamda(lists);
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
