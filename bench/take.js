require('@babel/register');

const Benchmark = require('benchmark');
const iterare = require('iterare');
const _map = require('lodash/fp/map');
const _take = require('lodash/fp/take');
const R = require('ramda');
const it = require('../src/index');

const xObjects = [
  {x: ''},
  {x: 0},
  {x: false},
  {x: NaN},
  {x: null},
  {x: undefined},
  {},
];

const getX = x => x.x;

(new Benchmark.Suite)
  .add('terable (take before map)', function () {
    it.toArray(it.map(getX)(it.take(1)(xObjects)));
  })
  .add('terable (take after map)', function () {
    it.toArray(it.take(1)(it.map(getX)(xObjects)));
  })
  .add('iterare (take before map)', function () {
    it.toArray(iterare.iterate(xObjects).take(1).map(getX));
  })
  .add('iterare (take after map)', function () {
    it.toArray(iterare.iterate(xObjects).map(getX).take(1));
  })
  .add('lodash/fp (take before map)', function () {
    _map(getX)(_take(1)(xObjects));
  })
  .add('lodash/fp (take after map)', function () {
    _take(1)(_map(getX)(xObjects));
  })
  .add('ramda (take before map)', function () {
    R.map(getX)(R.take(1)(xObjects));
  })
  .add('ramda (take after map)', function () {
    R.take(1)(R.map(getX)(xObjects));
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
