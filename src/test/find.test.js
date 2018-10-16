// @flow

import {
  find,
  map,
} from '../';
import {
  closeable,
  throws,
} from './util';

test('find', () => {
  const haystack = [
    {a: 1, b: 4},
    {a: 2, b: 5},
    {a: 3, b: 6},
  ];
  expect(find(x => x.a === 1)(haystack).b).toBe(4);
  expect(find(x => x.b > 5)(haystack).a).toBe(3);
  expect(find(x => x > 'a')('abc')).toBe('b');
  expect(find(Array.isArray)(new Set([1, [2], 3]))).toEqual([2]);
});

test('IteratorClose', () => {
  const c = closeable(1);
  expect(() => {
    find(throws)(c);
  }).toThrow();
  expect(c.closeCalls).toBe(1);

  const c2 = closeable(map(x => x + 9)(c));
  for (const x of find(x => true)(c2)) {
    expect(x).toBe(10);
    break;
  }
  expect(c.closeCalls).toBe(2);
  expect(c2.closeCalls).toBe(1);
});
