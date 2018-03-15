require('babel-register');

const Benchmark = require('benchmark');
const it = require('../src');
const _intersection = require('lodash/intersection');
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

const intersectRamda = R.reduce(
  (accum, x) => accum ? R.intersection(accum, x) : x,
  null,
);

(new Benchmark.Suite)
  .add('terable (intersect)', function () {
    it.intersect(lists);
  })
  .add('lodash (intersect)', function () {
    _intersection(...lists);
  })
  .add('ramda (intersect)', function () {
    intersectRamda(lists);
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
