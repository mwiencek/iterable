require('babel-register');

const Benchmark = require('benchmark');
const _compact = require('lodash/fp/compact');
const _compose = require('lodash/fp/compose');
const _flattenDeep = require('lodash/fp/flattenDeep');
const _flowRight = require('lodash/fp/flowRight');
const _map = require('lodash/fp/map');
const _reduce = require('lodash/fp/reduce');
const _uniq = require('lodash/fp/uniq');
const R = require('ramda');
const it = require('./src/index');
const mediums = require('./src/test/mediums').default;

const getNewIdsIt = it.compose(
  it.toArray,
  it.uniq,
  it.compact,
  it.map(x => x.artist.id),
  it.flatten,
  it.map(x => x.artistCredit.names),
  it.flatten,
  it.map(x => x.tracks),
);

const getNewIdsLodash = _flowRight(
  _uniq,
  _compact,
  _map(x => x.artist.id),
  _flattenDeep,
  _map(x => x.artistCredit.names),
  _flattenDeep,
  _map(x => x.tracks),
);

const getNewIdsRamda = R.compose(
  R.uniq,
  R.filter(Boolean),
  R.map(x => x.artist.id),
  R.flatten,
  R.map(x => x.artistCredit.names),
  R.flatten,
  R.map(x => x.tracks),
);

(new Benchmark.Suite)
  .add('terable', function () {
    getNewIdsIt(mediums);
  })
  .add('lodash/fp', function () {
    getNewIdsLodash(mediums);
  })
  .add('ramda', function () {
    getNewIdsRamda(mediums);
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

const largeList = R.repeat(1, 1000);
const sum = (accum, x) => accum + x;
const double = x => x * 2;
const doubleIt = it.map(double);
const doubleLodash = _map(double);
const doubleRamda = R.map(double);

(new Benchmark.Suite)
  .add('terable', function () {
    it.reduce(sum, 0)(it.compose(
      doubleIt,
      doubleIt,
      doubleIt,
      doubleIt,
      doubleIt,
    )(largeList));
  })
  .add('lodash/fp', function () {
    _reduce(sum, 0)(_compose(
      doubleLodash,
      doubleLodash,
      doubleLodash,
      doubleLodash,
      doubleLodash,
    )(largeList));
  })
  .add('ramda', function () {
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
