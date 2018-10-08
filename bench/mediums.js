require('@babel/register');

const Benchmark = require('benchmark');
const iterare = require('iterare');
const _compact = require('lodash/fp/compact');
const _flatMap = require('lodash/fp/flatMap');
const _flowRight = require('lodash/fp/flowRight');
const _map = require('lodash/fp/map');
const _uniq = require('lodash/fp/uniq');
const R = require('ramda');
const it = require('../src/index');
const mediums = require('../src/test/mediums').default;

const getArtistId = x => x.artist.id;
const getArtistCreditNames = x => x.artistCredit.names;
const getTracks = x => x.tracks;

const getNewIdsIt = it.compose(
  it.toArray,
  it.uniq,
  it.compact,
  it.map(getArtistId),
  it.concatMap(getArtistCreditNames),
  it.concatMap(getTracks),
);

/*
 * Iterare has no functional API, no concatMap, and no uniq (though
 * converting to a Set is a fair comparison, as terable also uses a Set
 * internally).
 */
const getNewIdsIterare = iterable => Array.from(
  iterare.iterate(iterable)
    .map(getTracks)
    .flatten()
    .map(getArtistCreditNames)
    .flatten()
    .map(getArtistId)
    .filter(Boolean)
    .toSet()
);

const getNewIdsLodash = _flowRight(
  _uniq,
  _compact,
  _map(getArtistId),
  _flatMap(getArtistCreditNames),
  _flatMap(getTracks),
);

const getNewIdsRamda = R.compose(
  R.uniq,
  R.filter(Boolean),
  R.map(getArtistId),
  R.chain(getArtistCreditNames),
  R.chain(getTracks),
);

(new Benchmark.Suite)
  .add('terable (complex chain)', function () {
    getNewIdsIt(mediums);
  })
  .add('iterare (complex chain)', function () {
    getNewIdsIterare(mediums);
  })
  .add('lodash/fp (complex chain)', function () {
    getNewIdsLodash(mediums);
  })
  .add('ramda (complex chain)', function () {
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
