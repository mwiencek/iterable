require('babel-register');

const Benchmark = require('benchmark');
const iterare = require('iterare');
const _map = require('lodash/fp/map');
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
  .add('terable (simple map)', function () {
    it.toArray(it.map(getX)(xObjects));
  })
  .add('terable (simple map, inline function)', function () {
    it.toArray(it.map(x => x.x)(xObjects));
  })
  .add('iterare (simple map)', function () {
    it.toArray(iterare.iterate(xObjects).map(getX));
  })
  .add('lodash/fp (simple map)', function () {
    _map(getX)(xObjects);
  })
  .add('ramda (simple map)', function () {
    R.map(getX)(xObjects);
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
