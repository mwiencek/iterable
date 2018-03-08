require('babel-register');

const Benchmark = require('benchmark');
const _compact = require('lodash/fp/compact');
const _flattenDeep = require('lodash/fp/flattenDeep');
const _flowRight = require('lodash/fp/flowRight');
const _map = require('lodash/fp/map');
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
