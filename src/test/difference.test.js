// @flow

import {
  difference,
  toArray,
} from '../';
import {SYMBOL_ITERATOR} from '../constants';
import {closeable, throws} from './util';

test('difference', () => {
  const setA = [0, 1, 2, 3, 4];
  const setB = [-2, 0, 2, 4, 6];

  expect(toArray(difference([setA, setB]))).toEqual([1, 3]);
  // Shouldn't maintain state between calls.
  expect(toArray(difference([setA, setB]))).toEqual([1, 3]);
  setA.push(5);
  setB.push(1);
  const iterable = difference([setA, setB]);
  expect(toArray(iterable)).toEqual([3, 5]);

  const a = Symbol();
  const b = Symbol();
  const c = Symbol();
  const d = Symbol();
  expect(toArray(difference([[a, b, c, d], [b, c], [c, d]]))).toEqual([a]);

  // Set difference
  expect(toArray(difference([
    new Set([a, b, c, d]),
    new Set([b, c]),
    new Set([c, d]),
  ]))).toEqual([a]);

  expect(toArray(difference([]))).toEqual([]);
  expect(toArray(difference([[], []]))).toEqual([]);
});

test('IteratorClose', () => {
  let closeCalls = 0;
  const c = {
    [SYMBOL_ITERATOR]: function () {
      return c;
    },
    next: function () {
      const d = {
        [SYMBOL_ITERATOR]: function () {
          return d;
        },
        next: function () {
          throw new Error();
        },
      };
      return d;
    },
    return: function () {
      closeCalls++;
      return {done: true};
    },
  };
  expect(() => {
    difference((c: any));
  }).toThrow();
  expect(closeCalls).toBe(1);
});
