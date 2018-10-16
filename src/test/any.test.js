// @flow

import {
  any,
  drop,
  map,
  take,
} from '../';
import asyncAny from '../async/any';
import asyncMap from '../async/map';
import {closeable, throws, makeAsyncIterator} from './util';

test('any', async function () {
  const array = [1, 2, 3];

  expect(any(x => x > 2)([])).toBe(false);
  expect(await asyncAny(x => x > 2)(makeAsyncIterator([]))).toBe(false);

  expect(any(x => x > 2)(array)).toBe(true);
  expect(await asyncAny(x => x > 2)(makeAsyncIterator(array))).toBe(true);

  expect(any(x => x < 1)(array)).toBe(false);
  expect(await asyncAny(x => x < 1)(makeAsyncIterator(array))).toBe(false);

  expect(any(x => x > 0)(map(x => -x)(array))).toBe(false);
  expect(await asyncAny(x => x > 0)(asyncMap(x => -x)(makeAsyncIterator(array)))).toBe(false);

  expect(any(x => x === 0)(drop(1)(map(x => x - 1)(array)))).toBe(false);
  expect(any(x => x === 0)(take(1)(map(x => x - 1)(array)))).toBe(true);
});

test('IteratorClose', () => {
  const c = closeable(true);
  expect(() => {
    any(throws)(c);
  }).toThrow();
  expect(c.closeCalls).toBe(1);
});
