require('babel-register');

const Benchmark = require('benchmark');
const iterare = require('iterare');
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

const getArtistId = x => x.artist.id;
const getArtistCreditNames = x => x.artistCredit.names;
const getTracks = x => x.tracks;

const getNewIdsIt = it.compose(
  it.toArray,
  it.uniq,
  it.compact,
  it.map(getArtistId),
  it.flatten,
  it.map(getArtistCreditNames),
  it.flatten,
  it.map(getTracks),
);

/*
 * Iterare has no functional API, no deep flatten, and no uniq (though
 * converting to a Set is a fair comparison, as terable also uses a Set
 * internally).
 */
const getNewIdsIterare = iterable => Array.from(
  iterare.iterate(iterable)
    .map(getTracks)
    .flatten()
    .flatten()
    .map(getArtistCreditNames)
    .flatten()
    .flatten()
    .flatten()
    .map(getArtistId)
    .filter(Boolean)
    .toSet()
);

const getNewIdsLodash = _flowRight(
  _uniq,
  _compact,
  _map(getArtistId),
  _flattenDeep,
  _map(getArtistCreditNames),
  _flattenDeep,
  _map(getTracks),
);

const getNewIdsRamda = R.compose(
  R.uniq,
  R.filter(Boolean),
  R.map(getArtistId),
  R.flatten,
  R.map(getArtistCreditNames),
  R.flatten,
  R.map(getTracks),
);

(new Benchmark.Suite)
  .add('terable', function () {
    getNewIdsIt(mediums);
  })
  .add('iterare', function () {
    getNewIdsIterare(mediums);
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
  .add('iterare', function () {
    iterare.iterate(largeList)
      .map(double)
      .map(double)
      .map(double)
      .map(double)
      .map(double)
      .reduce(sum, 0);
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
