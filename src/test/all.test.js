// @flow

import {
  all,
  drop,
  map,
} from '../';
import asyncAll from '../async/all';
import asyncMap from '../async/map';
import {badProp, closeable, throws, makeAsyncIterator} from './util';

test('all', async function () {
  const array = [1, 2, 3];

  expect(all(x => x > 0)([])).toBe(true);
  expect(await asyncAll(x => x > 0)(makeAsyncIterator([]))).toBe(true);

  expect(all(x => x > 0)(array)).toBe(true);
  expect(await asyncAll(x => x > 0)(makeAsyncIterator(array))).toBe(true);

  expect(all(x => x > 1)(array)).toBe(false);
  expect(await asyncAll(x => x > 1)(makeAsyncIterator(array))).toBe(false);

  expect(all(x => x > 0)(map(x => -x)(array))).toBe(false);
  expect(await asyncAll(x => x > 0)(asyncMap(x => -x)(makeAsyncIterator(array)))).toBe(false);

  expect(all(x => x > 0)(drop(1)(map(x => x - 1)(array)))).toBe(true);
});

test('IteratorClose', () => {
  const c = closeable(true);
  expect(() => {
    all(throws)(c);
  }).toThrow();
  expect(c.closeCalls).toBe(1);
});
