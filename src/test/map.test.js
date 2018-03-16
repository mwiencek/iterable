// @flow

import {
  concat,
  map,
  toArray,
} from '../';
import {
  badMap,
  badProp,
  closeable,
  spyFactory,
  throws,
} from './util';

test('map', () => {
  const square = map(x => x ** 2);

  expect(toArray(square([1, 2, 3]))).toEqual([1, 4, 9]);

  const iterable = square(concat([[3], [2], [1]]));
  expect(toArray(iterable)).toEqual([9, 4, 1]);

  // Manual iteration
  // $FlowFixMe
  const iterator = iterable[Symbol.iterator]();
  expect(iterator.next()).toEqual({value: 9, done: false});
  expect(iterator.next()).toEqual({value: 4, done: false});
  expect(iterator.next()).toEqual({value: 1, done: false});
  expect(iterator.next()).toEqual({done: true});
  expect(iterator.next()).toEqual({done: true});

  // Lazy iterator creation
  const lazySpy = spyFactory(map(badProp));
  // $FlowFixMe
  badMap(lazySpy([{}]))[Symbol.iterator]();
  expect(lazySpy.calls).toBe(0);
});

test('IteratorClose', () => {
  const c = closeable();
  expect(() => {
    for (const x of map(throws)(c)) {}
  }).toThrow();
  expect(c.closeCalls).toBe(1);
  for (const x of map(x => x)(c)) {
    break;
  }
  expect(c.closeCalls).toBe(2);
});
